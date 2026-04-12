import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useCart } from "../cart/CartProvider";
import { Separator } from "../ui/separator";

export function CartSheet() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = "Hola! Quiero realizar la siguiente compra:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Talla: ${item.size} | Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    message += `*Total estimado: $${totalPrice.toFixed(2)}*\n\n`;
    message += "Por favor, indíquenme cómo proceder con el pago y envío. Gracias!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/1234567890?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full border-l border-border bg-card p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-serif text-xl flex items-center gap-2 text-foreground">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Mi Bolsa de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center h-[50vh]">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-foreground">Tu bolsa está vacía</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Descubre nuestra colección y encuentra piezas perfectas para ti.
                </p>
                <Button onClick={() => setIsCartOpen(false)} className="w-full sm:w-auto">
                  Explorar Tienda
                </Button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-medium text-sm text-foreground line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Talla: {item.size}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none rounded-l-md text-foreground"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none rounded-r-md text-foreground"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-card/95 backdrop-blur-sm">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Envío</span>
                <span>Calculado por WhatsApp</span>
              </div>
              <Separator className="bg-border" />
              <div className="flex justify-between font-serif text-lg text-foreground">
                <span>Total Estimado</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              className="w-full py-6 text-base font-medium flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
              onClick={handleCheckout}
            >
              <SiWhatsapp className="w-5 h-5" />
              Comprar por WhatsApp
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Serás redirigida a WhatsApp para finalizar tu compra de forma segura y personalizada.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

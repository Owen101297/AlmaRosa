import { useState } from "react";
import { ShoppingBag, X, Minus, Plus, Trash2, Tag, Check } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useCart } from "../cart/CartProvider";
import { Separator } from "../ui/separator";

const DISCOUNT_CODES: Record<string, number> = {
  BIENVENIDA10: 10,
  ALMAROSA15: 15,
  ENVIOGRATIS: 0,
};

const SHIPPING_THRESHOLD = 999;

export function CartSheet() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    totalPrice,
  } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percent: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");

  const applyDiscount = () => {
    const code = discountCode.toUpperCase().trim();
    if (DISCOUNT_CODES[code] !== undefined) {
      setAppliedDiscount({ code, percent: DISCOUNT_CODES[code] });
      setDiscountError("");
      setDiscountCode("");
    } else {
      setDiscountError("Código inválido");
    }
  };

  const discountAmount = appliedDiscount
    ? (totalPrice * appliedDiscount.percent) / 100
    : 0;
  const freeShipping = totalPrice >= SHIPPING_THRESHOLD;
  const finalPrice = totalPrice - discountAmount;

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = "Hola! Quiero realizar la siguiente compra:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Talla: ${item.size} | Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    if (appliedDiscount) {
      message += `Código aplicado: ${appliedDiscount.code}\n`;
    }
    message += `*Total estimado: $${finalPrice.toFixed(2)}*\n`;
    message += `*Envío: ${freeShipping ? "GRATIS" : "por calcular"}*\n\n`;
    message +=
      "Por favor, indíquenme cómo proceder con el pago y envío. Gracias!";

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
                <h3 className="font-serif text-xl mb-2 text-foreground">
                  Tu bolsa está vacía
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Descubre nuestra colección y encuentra piezas perfectas para
                  ti.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full sm:w-auto"
                >
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
                          <h4 className="font-medium text-sm text-foreground line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Talla: {item.size}
                          </p>
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
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none rounded-r-md text-foreground"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
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
            {/* Discount Code Input */}
            {!appliedDiscount && (
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onKeyDown={(e) => e.key === "Enter" && applyDiscount()}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={applyDiscount}
                    className="text-sm"
                  >
                    Aplicar
                  </Button>
                </div>
                {discountError && (
                  <p className="text-xs text-destructive mt-2">
                    {discountError}
                  </p>
                )}
              </div>
            )}

            {appliedDiscount && (
              <div className="mb-6 p-3 bg-primary/10 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    {appliedDiscount.code}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {appliedDiscount.percent === 0
                      ? "Envío gratis"
                      : `-${appliedDiscount.percent}%`}
                  </span>
                </div>
                <button
                  onClick={() => setAppliedDiscount(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Price Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Descuento</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Envío</span>
                <span
                  className={freeShipping ? "text-primary font-medium" : ""}
                >
                  {freeShipping ? "GRATIS" : "Calculado por WhatsApp"}
                </span>
              </div>
              {!freeShipping && totalPrice > 0 && (
                <p className="text-xs text-muted-foreground">
                  Añade ${(SHIPPING_THRESHOLD - totalPrice).toFixed(2)} más para
                  envío gratis
                </p>
              )}
              <Separator className="bg-border" />
              <div className="flex justify-between font-serif text-lg text-foreground">
                <span>Total Estimado</span>
                <span>${finalPrice.toFixed(2)}</span>
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
              Serás redirigida a WhatsApp para finalizar tu compra de forma
              segura y personalizada.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

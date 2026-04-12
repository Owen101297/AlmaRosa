import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { useOrders } from "@/hooks/useOrders";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Check, MapPin, Plus } from "lucide-react";

const addressSchema = z.object({
  full_name: z.string().min(2, "Nombre requerido"),
  phone: z.string().min(10, "Teléfono requerido"),
  street: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Estado requerido"),
  zip_code: z.string().min(5, "CP requerido"),
  country: z.string().default("México"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface CheckoutProps {
  onComplete?: () => void;
}

export default function Checkout(props: CheckoutProps) {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { addresses, addAddress, getDefaultAddress, fetchAddresses } =
    useAddresses();
  const { createOrder, isLoading: orderLoading } = useOrders();
  const [step, setStep] = useState<"address" | "review">("address");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [orderComplete, setOrderComplete] = useState(false);
  const [newAddressMode, setNewAddressMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "México",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login?redirect=/checkout");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, getDefaultAddress]);

  const handleAddAddress = async (data: AddressFormData) => {
    const { address, error } = await addAddress({
      ...data,
      is_default: addresses.length === 0,
    });
    if (!error && address) {
      setSelectedAddressId(address.id);
      setNewAddressMode(false);
      fetchAddresses();
    }
  };

  const handlePlaceOrder = async () => {
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) return;

    const orderItems = items.map((item) => ({
      productId: item.productId,
      productName: item.name,
      productImage: item.image,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.price,
    }));

    const { order, error } = await createOrder(
      totalPrice,
      selectedAddr,
      orderItems,
    );
    if (!error && order) {
      clearCart();
      setOrderComplete(true);
      setLocation(`/pedidos/${order.id}`);
    }
  };

  if (orderComplete) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
          <Card className="w-full max-w-md text-center">
            <CardHeader className="justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">
                ¡Pedido realizado!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tu pedido ha sido confirmado. Recibirás un email con los
                detalles.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/pedidos">
                <Button className="w-full">Ver mis pedidos</Button>
              </Link>
              <Link href="/tienda">
                <Button variant="outline" className="w-full">
                  Seguir comprando
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (authLoading || items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-destructive/10 pt-24 pb-12 border-b border-destructive/20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Finalizar Compra
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dirección de entrega</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewAddressMode(!newAddressMode)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva dirección
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {newAddressMode ? (
                  <form
                    onSubmit={handleSubmit(handleAddAddress)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nombre completo</Label>
                        <Input {...register("full_name")} />
                        {errors.full_name && (
                          <p className="text-sm text-destructive">
                            {errors.full_name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          {...register("phone")}
                          placeholder="5512345678"
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street">Dirección</Label>
                      <Input
                        {...register("street")}
                        placeholder="Calle, número, colonia"
                      />
                      {errors.street && (
                        <p className="text-sm text-destructive">
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad</Label>
                        <Input {...register("city")} />
                        {errors.city && (
                          <p className="text-sm text-destructive">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input {...register("state")} />
                        {errors.state && (
                          <p className="text-sm text-destructive">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">Código Postal</Label>
                        <Input {...register("zip_code")} />
                        {errors.zip_code && (
                          <p className="text-sm text-destructive">
                            {errors.zip_code.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Guardar dirección
                    </Button>
                  </form>
                ) : addresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddressId?.toString()}
                    onValueChange={(v) => setSelectedAddressId(Number(v))}
                    className="space-y-3"
                  >
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <RadioGroupItem
                          value={addr.id.toString()}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{addr.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.street}, {addr.city}, {addr.state}{" "}
                            {addr.zip_code}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {addr.phone}
                          </p>
                        </div>
                        {addr.is_default && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No tienes direcciones guardadas.
                    <br />
                    <Button
                      variant="link"
                      onClick={() => setNewAddressMode(true)}
                    >
                      Agregar dirección
                    </Button>
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              disabled={!selectedAddressId || orderLoading}
              onClick={handlePlaceOrder}
            >
              {orderLoading ? "Procesando..." : "Confirmar pedido"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Talla: {item.size} | Cant: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-muted-foreground">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

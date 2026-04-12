import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Package, MapPin, Calendar, Truck } from "lucide-react";
import type { Order, OrderItem } from "@/types/supabase";

const statusConfig = {
  pending: {
    label: "Pendiente",
    variant: "secondary" as const,
    icon: Calendar,
  },
  processing: {
    label: "Procesando",
    variant: "default" as const,
    icon: Package,
  },
  shipped: { label: "Enviado", variant: "outline" as const, icon: Truck },
  delivered: {
    label: "Entregado",
    variant: "secondary" as const,
    icon: Package,
  },
  cancelled: { label: "Cancelado", destructive: true, icon: Package },
};

interface OrderDetailParams {
  id?: string;
}

export default function OrderDetail() {
  const params = useParams() as OrderDetailParams;
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { fetchOrder, currentOrder, orderItems, isLoading } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login?redirect=/pedidos");
      return;
    }

    if (params.id) {
      fetchOrder(Number(params.id)).then((fetchedOrder) => {
        if (fetchedOrder && fetchedOrder.user_id !== user?.id) {
          setLocation("/pedidos");
        }
        setOrder(fetchedOrder);
        setItems(orderItems);
      });
    }
  }, [params.id, authLoading, user]);

  if (authLoading || isLoading || !order) {
    return (
      <Layout>
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Layout>
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link href="/pedidos">
            <Button variant="ghost" className="mb-4 -ml-2">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver a mis pedidos
            </Button>
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl">
            Pedido #{order.id}
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date(order.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Talla: {item.size} | Cantidad: {item.quantity}
                        </p>
                        <p className="font-medium mt-1">
                          ${item.total_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección de entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {typeof order.shipping_address === "object" && (
                  <div>
                    <p className="font-medium">
                      {(order.shipping_address as any).full_name}
                    </p>
                    <p className="text-muted-foreground">
                      {(order.shipping_address as any).street}
                    </p>
                    <p className="text-muted-foreground">
                      {(order.shipping_address as any).city},{" "}
                      {(order.shipping_address as any).state}{" "}
                      {(order.shipping_address as any).zip_code}
                    </p>
                    <p className="text-muted-foreground">
                      {(order.shipping_address as any).phone}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <Badge
                      variant={status.variant}
                      className={status.destructive ? "bg-destructive" : ""}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-muted-foreground">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

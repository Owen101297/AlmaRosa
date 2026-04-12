import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight } from "lucide-react";

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  processing: { label: "Procesando", variant: "default" as const },
  shipped: { label: "Enviado", variant: "outline" as const },
  delivered: { label: "Entregado", variant: "secondary" as const },
  cancelled: { label: "Cancelado", destructive: true },
};

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { orders, isLoading, fetchOrders } = useOrders();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login?redirect=/pedidos");
    } else if (user) {
      fetchOrders();
    }
  }, [authLoading, user, setLocation, fetchOrders]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">
              Cargando pedidos...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-destructive/10 pt-24 pb-12 border-b border-destructive/20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Mis Pedidos
          </h1>
          <p className="text-muted-foreground mt-2">Historial de tus compras</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {orders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle>No hay pedidos aún</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Cuando.realices tu primer pedido, aparecerá aquí.
              </p>
              <Link href="/tienda">
                <Button>Explorar la tienda</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <Link key={order.id} href={`/pedidos/${order.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Pedido #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(
                              "es-MX",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge
                            variant={status.variant}
                            className={
                              status.destructive ? "bg-destructive" : ""
                            }
                          >
                            {status.label}
                          </Badge>
                          <p className="text-lg font-medium">
                            ${order.total_amount.toFixed(2)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

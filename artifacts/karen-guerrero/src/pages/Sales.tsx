import { useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { ProductCard } from "../components/ui/ProductCard";
import { useListOnSaleProducts } from "@workspace/api-client-react";
import { Percent } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

export default function Sales() {
  const { data: onSaleProducts, isLoading } = useListOnSaleProducts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="bg-destructive/10 pt-24 pb-12 border-b border-destructive/20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
            <Percent className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Ofertas Exclusivas</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre el lujo accesible. Piezas seleccionadas con precios especiales por tiempo limitado.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-[3/4] mb-4 rounded-md"></div>
                <div className="h-4 bg-muted w-3/4 mb-2"></div>
                <div className="h-4 bg-muted w-1/4"></div>
              </div>
            ))}
          </div>
        ) : !Array.isArray(onSaleProducts) || onSaleProducts.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-lg border border-border">
            <h3 className="font-serif text-2xl mb-2">No hay ofertas en este momento</h3>
            <p className="text-muted-foreground mb-6">Nuestras ofertas cambian constantemente. ¡Vuelve pronto!</p>
            <Link href="/tienda">
              <Button variant="outline">Explorar la tienda</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(onSaleProducts) && onSaleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

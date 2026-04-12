import { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "../components/layout/Layout";
import { useListCategories, useGetProductsSummary } from "@workspace/api-client-react";
import { ArrowRight } from "lucide-react";

export default function Collections() {
  const { data: categories, isLoading } = useListCategories();
  const { data: summary } = useGetProductsSummary();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary tracking-[0.2em] text-sm uppercase mb-4 font-medium block">
            Descubre nuestro universo
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Colecciones</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Piezas curadas y agrupadas para cada faceta de tu personalidad y cada momento de tu día.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-muted h-[400px] rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {Array.isArray(categories) && categories.map((category, idx) => (
              <Link 
                key={category.id} 
                href={`/tienda?category=${category.id}`} 
                className="group relative h-[450px] lg:h-[550px] overflow-hidden rounded-lg block"
              >
                <img 
                  src={`/images/category-${category.slug}.png`} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1512496015851-a1fbbfc6ae87?q=80&w=800&auto=format&fit=crop`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col justify-end h-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-2">{category.name}</h2>
                    <p className="text-gray-300 text-sm md:text-base mb-6 font-light max-w-md line-clamp-2">
                      Explora la selección de {category.name.toLowerCase()} diseñados especialmente para ti.
                    </p>
                    
                    <div className="flex items-center text-primary text-sm font-medium tracking-widest uppercase">
                      Ver Colección ({category.productCount}) <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

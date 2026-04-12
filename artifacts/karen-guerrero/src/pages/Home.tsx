import { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "../components/layout/Layout";
import { ProductCard } from "../components/ui/ProductCard";
import { useListProducts, useListCategories, useListTestimonials } from "@workspace/api-client-react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Home() {
  const { data: featuredProducts } = useListProducts({ featured: true });
  const { data: categories } = useListCategories();
  const { data: testimonials } = useListTestimonials();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90dvh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Karen Guerrero Lingerie" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-primary tracking-[0.3em] text-sm md:text-base uppercase mb-4 font-medium block">
            Descubre tu poder interior
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
            Sensualidad & <br/><span className="text-primary italic font-light">Elegancia</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Piezas exclusivas diseñadas para abrazar tu silueta, celebrar tu confianza y hacerte sentir extraordinaria todos los días.
          </p>
          <Link href="/tienda">
            <Button size="lg" className="text-sm tracking-wider uppercase px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90 border-none group">
              Explorar Colección
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Nuestras Colecciones</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.slice(0, 4).map((category, idx) => (
              <Link key={category.id} href={`/tienda?category=${category.id}`} className="group block relative h-[400px] overflow-hidden">
                <img 
                  src={`/images/category-${category.slug}.png`} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1512496015851-a1fbbfc6ae87?q=80&w=800&auto=format&fit=crop`; // Fallback just in case
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                  <h3 className="font-serif text-2xl text-white mb-2">{category.name}</h3>
                  <span className="text-primary text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Ver piezas
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Piezas Destacadas</h2>
              <p className="text-muted-foreground">La selección favorita de nuestras clientas.</p>
            </div>
            <Link href="/tienda" className="hidden md:flex text-primary hover:text-primary/80 items-center gap-2 text-sm uppercase tracking-wider font-medium">
              Ver Todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/tienda">
              <Button variant="outline" className="w-full uppercase tracking-widest text-xs">
                Ver Todo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Experience / Banner */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
          <div className="w-12 h-12 mb-8 text-primary opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-8 leading-tight">
            "La verdadera belleza comienza en el momento en que decides ser tú misma."
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl font-light">
            En Karen Guerrero creemos que la lencería no es solo para ocasiones especiales, es una celebración diaria de tu feminidad. Cada pieza está confeccionada pensando en tu comodidad y poder.
          </p>
          <div className="w-16 h-[1px] bg-primary/50"></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Lo que dicen de nosotras</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.slice(0, 3).map(testimonial => (
              <div key={testimonial.id} className="bg-card p-8 rounded-lg border border-border relative">
                <div className="absolute -top-6 left-8">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-background"
                  />
                </div>
                <div className="flex gap-1 mb-4 mt-2 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <h4 className="font-medium text-foreground">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

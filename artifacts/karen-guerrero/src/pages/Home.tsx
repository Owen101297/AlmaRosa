import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Layout } from "../components/layout/Layout";
import { ProductCard } from "../components/ui/ProductCard";
import {
  useListProducts,
  useListCategories,
  useListTestimonials,
} from "@workspace/api-client-react";
import {
  ArrowRight,
  Star,
  Quote,
  Truck,
  RefreshCw,
  ShieldCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function Home() {
  const { data: featuredProducts } = useListProducts({ featured: true });
  const { data: categories } = useListCategories();
  const { data: testimonials } = useListTestimonials();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % Math.min(testimonials.length, 3),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const nextTestimonial = () => {
    if (!testimonials) return;
    setCurrentTestimonial(
      (prev) => (prev + 1) % Math.min(testimonials.length, 3),
    );
  };

  const prevTestimonial = () => {
    if (!testimonials) return;
    setCurrentTestimonial(
      (prev) =>
        (prev - 1 + Math.min(testimonials.length, 3)) %
        Math.min(testimonials.length, 3),
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85dvh] w-full pt-20 flex items-stretch">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="flex-1 py-12 md:py-0 md:pr-12 z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="text-primary tracking-[0.4em] text-xs md:text-sm uppercase mb-6 font-semibold block">
              Colección Luxury Light
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-8 leading-none tracking-tight">
              Sensualidad <br />
              <span className="italic font-light opacity-80">& Elegancia</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-lg font-light leading-relaxed">
              Piezas exclusivas de lencería diseñadas para abrazar tu silueta y celebrar tu confianza todos los días.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/tienda">
                <Button
                  size="lg"
                  className="rounded-none text-sm tracking-wider uppercase px-10 h-14 bg-primary text-primary-foreground hover:bg-primary/90 border-none group transition-all"
                >
                  Ver Colección
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content (Framed) */}
          <div className="flex-1 h-[500px] md:h-[700px] w-full relative animate-in fade-in zoom-in-95 duration-1200">
             <div className="absolute inset-4 md:inset-12 border border-primary/20 -z-10 translate-x-4 translate-y-4"></div>
             <div className="w-full h-full relative overflow-hidden bg-secondary">
               <img
                 src="/images/hero.png"
                 alt="Alma Rosa Lingerie"
                 className="w-full h-full object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-primary/5"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 letter-spacing-tight">
              Nuestras Colecciones
            </h2>
            <div className="w-16 h-[1px] bg-primary/80 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(categories) &&
              categories.slice(0, 4).map((category, idx) => (
                <Link
                  key={category.id}
                  href={`/tienda?category=${category.id}`}
                  className="group block relative h-[420px] overflow-hidden"
                >
                  <img
                    src={`/images/category-${category.slug}.png`}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://images.unsplash.com/photo-1512496015851-a1fbbfc6ae87?q=80&w=800&auto=format&fit=crop`; // Fallback just in case
                    }}
                  />
                  <div className="absolute inset-0 bg-primary/8 group-hover:bg-primary/12 transition-colors duration-600"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-8 pt-16 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-600 text-center">
                    <h3 className="font-serif text-2xl text-white mb-3 tracking-tight drop-shadow-md">
                      {category.name}
                    </h3>
                    <span className="text-white/90 text-sm uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition-opacity duration-600 delay-150 font-medium drop-shadow-md">
                      Ver piezas
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Guarantees / warranties */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors duration-500">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Envío Gratis</h3>
              <p className="text-xs text-muted-foreground">
                En pedidos desde $999
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors duration-500">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">
                Cambios Fáciles
              </h3>
              <p className="text-xs text-muted-foreground">Hasta 30 días</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors duration-500">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Pago Seguro</h3>
              <p className="text-xs text-muted-foreground">100% protegido</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors duration-500">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">
                Atención WhatsApp
              </h3>
              <p className="text-xs text-muted-foreground">
                Respuesta inmediata
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-14">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 letter-spacing-tight">
                Piezas Destacadas
              </h2>
              <p className="text-muted-foreground/80">
                La selección favorita de nuestras clientas.
              </p>
            </div>
            <Link
              href="/tienda"
              className="hidden md:flex text-primary hover:text-primary/70 items-center gap-2.5 text-sm uppercase tracking-wider font-medium"
            >
              Ver Todo{" "}
              <ArrowRight className="w-4 h-4 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(featuredProducts) &&
              featuredProducts
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <div className="mt-14 text-center md:hidden">
            <Link href="/tienda">
              <Button
                variant="outline"
                className="w-full uppercase tracking-widest text-xs px-6 py-2.5 transition-all duration-300"
              >
                Ver Todo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Experience / Banner */}
      <section className="py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/90"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
          <div className="w-10 h-10 mb-10 text-primary opacity-60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-10 leading-none tracking-tighter">
            "La verdadera belleza comienza en el momento en que decides ser tú
            misma."
          </h2>
          <p className="text-muted-foreground/80 text-lg mb-12 max-w-2xl font-light leading-relaxed">
            En Alma Rosa creemos que la lencería no es solo para ocasiones
            especiales, es una celebración diaria de tu feminidad. Cada pieza
            está confeccionada pensando en tu comodidad y poder.
          </p>
          <div className="w-16 h-[1px] bg-primary/30"></div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-28 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-18">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 letter-spacing-tight">
              Lo que dicen de nosotras
            </h2>
            <div className="w-16 h-[1px] bg-primary/60 mx-auto"></div>
          </div>

          {/* Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {Array.isArray(testimonials) &&
                  testimonials.slice(0, 3).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-card/70 backdrop-blur-sm p-8 md:p-14 rounded-xl border border-border/60 shadow-lg shadow-black/4 max-w-2xl mx-auto text-center">
                        <div className="w-10 h-10 mb-5 rounded-full bg-primary/8 flex items-center justify-center mx-auto">
                          <Quote className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex gap-1 mb-5 justify-center text-primary/90">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? "fill-current" : "text-border/60"}`}
                            />
                          ))}
                        </div>

                        <p className="text-muted-foreground/80 italic mb-7 leading-relaxed text-lg">
                          "{testimonial.comment}"
                        </p>

                        <div className="flex items-center justify-center gap-3">
                          <h4 className="font-medium text-foreground text-lg">
                            {testimonial.name}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider bg-primary/12 text-primary px-3 py-1.5 rounded-full">
                            Cliente verificada
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-10 w-12 h-12 rounded-full bg-background/70 border border-border/60 flex items-center justify-center text-foreground/90 hover:bg-primary hover:text-primary-foreground hover:border-primary/90 transition-all duration-400"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-10 w-12 h-12 rounded-full bg-background/70 border border-border/60 flex items-center justify-center text-foreground/90 hover:bg-primary hover:text-primary-foreground hover:border-primary/90 transition-all duration-400"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2.5 mt-10">
              {Array.isArray(testimonials) &&
                testimonials
                  .slice(0, 3)
                  .map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentTestimonial === i
                          ? "w-9 bg-primary"
                          : "bg-border/60 hover:bg-primary/20"
                      }`}
                    />
                  ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { ProductCard } from "../components/ui/ProductCard";
import {
  useListProducts,
  useListCategories,
} from "@workspace/api-client-react";
import { Button } from "../components/ui/button";
import { Filter, X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Shop() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : undefined;

  const [categoryId, setCategoryId] = useState<number | undefined>(
    initialCategoryId,
  );
  const [size, setSize] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string>("newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string | undefined>(undefined);

  const { data: products, isLoading } = useListProducts({ categoryId, size });
  const { data: categories } = useListCategories();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = [...(products || [])].filter((product) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !product.name?.toLowerCase().includes(query) &&
        !product.description?.toLowerCase().includes(query) &&
        !product.categoryName?.toLowerCase().includes(query)
      )
        return false;
    }
    if (priceRange) {
      const price = product.salePrice || product.price;
      if (priceRange === "0-500" && (price < 0 || price > 500)) return false;
      if (priceRange === "500-1000" && (price < 500 || price > 1000))
        return false;
      if (priceRange === "1000-1500" && (price < 1000 || price > 1500))
        return false;
      if (priceRange === "1500+" && price < 1500) return false;
    }
    return true;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sort === "price-asc")
      return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sort === "price-desc")
      return (b.salePrice || b.price) - (a.salePrice || a.price);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const clearFilters = () => {
    setCategoryId(undefined);
    setSize(undefined);
    setSearchQuery("");
    setPriceRange(undefined);
  };

  const SIZES = ["XS", "S", "M", "L", "XL"];
  const PRICE_RANGES = [
    { value: "0-500", label: "$0 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000-1500", label: "$1,000 - $1,500" },
    { value: "1500+", label: "$1,500+" },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            La Tienda
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra colección completa de lencería diseñada para
            empoderarte cada día.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden flex justify-between items-center mb-4">
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 uppercase tracking-wider text-xs"
            >
              <Filter className="w-4 h-4" /> Filtros
            </Button>
            <div className="text-sm text-muted-foreground">
              {sortedProducts.length} resultados
            </div>
          </div>

          <aside
            className={`lg:w-64 flex-shrink-0 ${isMobileFiltersOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : "hidden lg:block"}`}
          >
            <div className="flex justify-between items-center mb-8 lg:hidden">
              <h2 className="font-serif text-2xl">Filtros</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-8">
              {(categoryId || size || searchQuery || priceRange) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  Limpiar todos los filtros
                </button>
              )}

              <div>
                <h3 className="font-medium uppercase tracking-wider text-sm mb-4 border-b border-border pb-2">
                  Categorías
                </h3>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer text-sm ${!categoryId ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => {
                      setCategoryId(undefined);
                      setIsMobileFiltersOpen(false);
                    }}
                  >
                    Todas las categorías
                  </div>
                  {categories?.map((cat) => (
                    <div
                      key={cat.id}
                      className={`cursor-pointer text-sm ${categoryId === cat.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => {
                        setCategoryId(cat.id);
                        setIsMobileFiltersOpen(false);
                      }}
                    >
                      {cat.name}{" "}
                      <span className="text-xs opacity-50 ml-1">
                        ({cat.productCount})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium uppercase tracking-wider text-sm mb-4 border-b border-border pb-2">
                  Precio
                </h3>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer text-sm ${!priceRange ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setPriceRange(undefined)}
                  >
                    Todos los precios
                  </div>
                  {PRICE_RANGES.map((range) => (
                    <div
                      key={range.value}
                      className={`cursor-pointer text-sm ${priceRange === range.value ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                      onClick={() => setPriceRange(range.value)}
                    >
                      {range.label}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium uppercase tracking-wider text-sm mb-4 border-b border-border pb-2">
                  Talla
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(size === s ? undefined : s)}
                      className={`w-10 h-10 text-xs font-medium border ${size === s ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-foreground border-border hover:border-primary"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div className="text-sm text-muted-foreground">
                {searchQuery && (
                  <span className="text-primary mr-2">"{searchQuery}"</span>
                )}
                Mostrando {sortedProducts.length} resultados
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  Ordenar por:
                </span>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px] bg-transparent border-border">
                    <SelectValue placeholder="Novedades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Novedades</SelectItem>
                    <SelectItem value="price-asc">
                      Precio: Menor a Mayor
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Precio: Mayor a Menor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-[3/4] mb-4 rounded-md"></div>
                    <div className="h-4 bg-muted w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-lg border border-border">
                <h3 className="font-serif text-2xl mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-muted-foreground mb-6">
                  Intenta cambiar tus filtros de búsqueda.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

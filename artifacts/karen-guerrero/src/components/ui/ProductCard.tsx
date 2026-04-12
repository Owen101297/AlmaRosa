import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "./button";
import { useCart } from "../cart/CartProvider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || "",
  );

  // Robust image selection: prefers images array, falls back to single image field, then placeholder
  const imageUrl = product.images?.[0] || (product as any).image;
  const hasMultipleImages =
    Array.isArray(product.images) && product.images.length > 1;
  const currentImage =
    isHovered && hasMultipleImages ? product.images[1] : imageUrl;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: imageUrl || "",
      size: selectedSize || "Única",
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block no-underline hover:no-underline"
    >
      <div
        className="relative overflow-hidden bg-white aspect-[3/4] mb-6 shadow-none border border-border/60 transition-all duration-400 hover:shadow-lg hover:border-primary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[11px] font-medium px-2.5 py-1 tracking-wider uppercase">
            Nuevo
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 right-3 z-10 bg-primary/90 text-primary-foreground text-[11px] font-medium px-2.5 py-1 tracking-wider uppercase">
            Oferta
          </div>
        )}

        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-102"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1556906781-4128abade3ca?q=80&w=800&auto=format&fit=crop";
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556906781-4128abade3ca?q=80&w=800"
              alt="Vista previa"
              className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[60%]"
            />
            <div className="absolute inset-0 bg-primary/8"></div>
            <span className="relative z-10 font-serif text-sm tracking-wider italic text-primary/80">
              Detalle Rosa
            </span>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/95 to-transparent/70 transform transition-transform duration-500 ${isHovered ? "translate-y-0" : "translate-y-full"}`}
        >
          {product.sizes?.length > 0 && (
            <div className="flex gap-2.5 justify-center mb-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-9 h-9 text-xs font-medium border border-border/60 ${selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-background/80 text-foreground/80 border-border/60 hover:border-primary/40"} transition-all duration-300`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <Button
            className="w-full rounded-none tracking-wider text-xs uppercase font-medium flex items-center justify-center px-4 py-2.5 transition-all duration-300 hover:bg-primary/8"
            onClick={handleAddToCart}
          >
            Añadir a la bolsa
          </Button>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <h3 className="font-serif text-lg text-foreground/90 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex gap-2.5 items-baseline">
          {product.salePrice ? (
            <>
              <span className="text-destructive font-medium">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="text-muted-foreground/60 text-sm line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-foreground/90 font-medium">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

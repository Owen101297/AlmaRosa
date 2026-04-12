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
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "");

  const hasMultipleImages = product.images?.length > 1;
  const currentImage = isHovered && hasMultipleImages ? product.images[1] : product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images?.[0] || "",
      size: selectedSize || "Única",
      quantity: 1,
    });
  };

  return (
    <Link href={`/producto/${product.id}`} className="group block group-hover:no-underline">
      <div 
        className="relative overflow-hidden bg-card rounded-md aspect-[3/4] mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 tracking-wider uppercase">
            Nuevo
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 tracking-wider uppercase">
            Oferta
          </div>
        )}
        
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        
        {/* Quick Add Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          {product.sizes?.length > 0 && (
            <div className="flex gap-2 justify-center mb-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-8 h-8 text-xs font-medium border ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-background/80 text-foreground border-border hover:border-primary'} transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <Button 
            className="w-full rounded-none tracking-wider text-xs uppercase"
            onClick={handleAddToCart}
          >
            Añadir a la bolsa
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <div className="flex gap-2 items-center">
          {product.salePrice ? (
            <>
              <span className="text-destructive font-medium">${product.salePrice.toFixed(2)}</span>
              <span className="text-muted-foreground text-sm line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-foreground font-medium">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

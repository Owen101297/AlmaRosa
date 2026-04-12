import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Layout } from "../components/layout/Layout";
import { useGetProduct, useListProducts } from "@workspace/api-client-react";
import { Button } from "../components/ui/button";
import { useCart } from "../components/cart/CartProvider";
import { Minus, Plus, ShoppingBag, Truck, ArrowLeft, Star } from "lucide-react";
import { ProductCard } from "../components/ui/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProduct(Number(id));
  const { data: relatedProducts } = useListProducts({ categoryId: product?.categoryId });
  
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      if (product.images?.length > 0) setSelectedImage(product.images[0]);
      if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
      setQuantity(1);
    }
  }, [product]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl mb-4">Producto no encontrado</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images?.[0] || "",
      size: selectedSize || "Única",
      quantity,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-24">
          
          {/* Images */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-muted rounded-md overflow-hidden aspect-[3/4] relative group">
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 tracking-wider uppercase">
                  Nuevo
                </div>
              )}
              {product.salePrice && (
                <div className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground text-xs font-medium px-3 py-1.5 tracking-wider uppercase">
                  Oferta
                </div>
              )}
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 lg:py-8">
            <div className="text-primary text-sm tracking-wider uppercase mb-2">
              {product.categoryName}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl text-destructive font-medium">${product.salePrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl text-foreground font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>
              <div className="h-6 w-[1px] bg-border"></div>
              <div className="flex items-center text-primary text-sm">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-2 text-muted-foreground">(12 reseñas)</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-8">
              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium uppercase tracking-wider">Talla seleccionada: {selectedSize}</span>
                    <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Guía de tallas</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 text-sm font-medium border transition-colors ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-foreground border-border hover:border-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm font-medium uppercase tracking-wider block mb-3">Cantidad</span>
                <div className="flex items-center border border-border w-max rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                size="lg" 
                className="w-full h-14 text-sm tracking-widest uppercase bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> Añadir a la bolsa
              </Button>
            </div>

            <div className="mt-8 space-y-4 pt-8 border-t border-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Envíos a todo el país</h4>
                  <p className="text-xs text-muted-foreground mt-1">El costo de envío se calculará al finalizar la compra por WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.filter(p => p.id !== product.id).length > 0 && (
          <div className="pt-16 border-t border-border">
            <h2 className="font-serif text-3xl mb-8 text-center">También te podría gustar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, User, Package, LogOut } from "lucide-react";
import { useCart } from "../cart/CartProvider";
import { useAuth } from "../../hooks/useAuth";
import { CartSheet } from "./CartSheet";
import { Button } from "../ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/tienda", label: "Tienda" },
    { href: "/colecciones", label: "Colecciones" },
    { href: "/ofertas", label: "Ofertas" },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-border/50 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex-1 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
                className="text-foreground hover:bg-transparent hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          <nav className="hidden md:flex flex-1 gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 flex justify-center">
            <Link
              href="/"
              className="flex items-center"
            >
              <img 
                src="/images/logo.png" 
                alt="Alma Rosa" 
                className="h-16 w-auto md:h-20 transition-all duration-300 mix-blend-multiply" 
              />
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2">
            {!isLoading &&
              (user ? (
                <>
                  <Link href="/pedidos">
                    <Button
                      variant="ghost"
                      size="sm"
                        className="text-foreground hover:bg-transparent hover:text-primary transition-colors"
                    >
                      <Package className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Mis pedidos</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                      className="text-foreground hover:bg-transparent hover:text-primary transition-colors"
                    onClick={() => signOut()}
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                      className="text-foreground hover:bg-transparent hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Iniciar sesión</span>
                  </Button>
                </Link>
              ))}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:bg-transparent hover:text-primary"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                className="text-foreground"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`text-2xl font-serif tracking-wider ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="py-8 text-center text-sm text-muted-foreground">
              Sensualidad, Elegancia, Confianza.
            </div>
          </div>
        </div>
      )}

      <CartSheet />
    </>
  );
}

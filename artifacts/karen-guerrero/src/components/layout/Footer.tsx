import { Link } from "wouter";
import { Instagram } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-primary block mb-6">
              KAREN GUERRERO
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Lencería femenina que irradia sensualidad, elegancia y confianza.
              Diseños exclusivos para mujeres que buscan el lujo accesible y 
              quieren sentirse espectaculares todos los días.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide text-foreground">Explorar</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/tienda" className="hover:text-primary transition-colors">Tienda Completa</Link></li>
              <li><Link href="/colecciones" className="hover:text-primary transition-colors">Colecciones</Link></li>
              <li><Link href="/ofertas" className="hover:text-primary transition-colors">Ofertas Especiales</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide text-foreground">Contacto</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <SiWhatsapp className="w-4 h-4" />
                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  Atención por WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  @karenguerrero.lenceria
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Karen Guerrero Lencería. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Lock,
  CreditCard,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-stone-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="block mb-6"
            >
              <img 
                src="/images/logo.png" 
                alt="Alma Rosa" 
                className="h-16 w-auto brightness-110 contrast-110" 
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Redefiniendo la elegancia íntima con piezas diseñadas para
              empoderar y celebrar tu belleza natural.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-medium text-sm mb-2 text-white">
                Suscríbete a nuestro boletín
              </h4>
              <p className="text-gray-400 text-xs mb-3">
                Recibe ofertas exclusivas y las últimas tendencias
              </p>
              {subscribed ? (
                <div className="p-3 bg-primary/10 rounded text-primary text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Gracias por suscribirte!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-stone-800 border border-stone-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    required
                  />
                   <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-primary/90 transition-colors"
                  >
                    Suscribirse
                  </button>
                </form>
              )}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-gray-400 hover:bg-rose-500 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-white mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tienda"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Comprar Colección
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Contáctanos
                </Link>
              </li>
            </ul>

            <h3 className="font-serif text-lg text-white mb-3 mt-6">
              Políticas
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Política de Envíos
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Política de Cambios
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Payments */}
          <div>
            <h3 className="font-serif text-lg text-white mb-4">Contáctanos</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                📍 <span>Av. de la Moda 123, Ciudad de México</span>
              </li>
              <li className="flex items-center gap-2">
                📱 <span>+52 55 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                ✉️ <span>hola@almarosa.com</span>
              </li>
              <li className="flex items-center gap-2">
                📸 <span>@almarosa.lenceria</span>
              </li>
            </ul>

            <h3 className="font-serif text-lg text-white mb-3 mt-6">
              Métodos de Pago
            </h3>
            <div className="flex gap-2 flex-wrap">
              <div className="w-12 h-8 bg-stone-800 rounded flex items-center justify-center text-gray-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="w-12 h-8 bg-stone-800 rounded flex items-center justify-center text-gray-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="w-12 h-8 bg-stone-800 rounded flex items-center justify-center text-gray-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="w-12 h-8 bg-stone-800 rounded flex items-center justify-center text-gray-400 text-xs font-bold">
                PayPal
              </div>
              <div className="w-12 h-8 bg-stone-800 rounded flex items-center justify-center text-gray-400 text-xs font-bold">
                OXXO
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-gray-500 text-xs">
              <Lock className="w-3 h-3" />
              <span>Pago 100% seguro</span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
          <p>
            © {new Date().getFullYear()} Alma Rosa Lencería. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

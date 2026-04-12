import { SiWhatsapp } from "react-icons/si";

export function WhatsAppButton() {
  const defaultMessage = "Hola, me interesa conocer más sobre los productos de Karen Guerrero.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/1234567890?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-pulse"
      aria-label="Contactar por WhatsApp"
    >
      <SiWhatsapp className="w-7 h-7" />
    </a>
  );
}

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

export default function WhatsAppFloat() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi ToolzHub, I need help."
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-20" />
    </a>
  );
}
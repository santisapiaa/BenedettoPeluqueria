import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/50 transition-transform duration-300 hover:scale-110 sm:bottom-7 sm:right-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ping-slow rounded-full bg-[#25d366]/50"
      />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}

import { Clock, MapPin, Navigation, Phone, PhoneCall } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { directionsUrl, mapsEmbedUrl, phoneHref, whatsappUrl } from "@/lib/links";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";

export function Location() {
  return (
    <section id="ubicacion" className="section-y bg-coal">
      <div className="container-x">
        <SectionHeading eyebrow="Encontranos" title="Ubicación y contacto" />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="space-y-7 lg:col-span-2">
            <InfoRow icon={MapPin} title="Dirección">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city}
            </InfoRow>

            <InfoRow icon={Clock} title="Horarios">
              <ul className="space-y-2">
                {siteConfig.hours.map((h) => (
                  <li key={h.days}>
                    <span className="block text-bone">{h.days}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </InfoRow>

            <InfoRow icon={Phone} title="WhatsApp">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-light"
              >
                {siteConfig.phone}
              </a>
            </InfoRow>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={directionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4" /> Cómo llegar
              </Button>
              <Button href={phoneHref()} variant="outline">
                <PhoneCall className="h-4 w-4" /> Llamar
              </Button>
              <Button
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                <InstagramIcon className="h-4 w-4" /> Instagram
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="overflow-hidden rounded-sm border border-white/10">
              <iframe
                title="Mapa de Benedetto Peluquería y Barbería"
                src={mapsEmbedUrl()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                // Tema oscuro para el mapa: invierte y rota el matiz.
                className="h-[360px] w-full border-0 [filter:invert(92%)_hue-rotate(180deg)_grayscale(0.5)_contrast(0.9)] sm:h-[440px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
      <div className="min-w-0 flex-1">
        <h3 className="mb-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold">
          {title}
        </h3>
        <div className="text-sm leading-relaxed text-bone-muted">{children}</div>
      </div>
    </div>
  );
}

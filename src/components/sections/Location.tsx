import { Clock, MapPin, Phone } from "lucide-react";

import { mapsEmbedUrl, siteConfig, whatsappUrl } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";

export function Location() {
  return (
    <section id="ubicacion" className="section-y bg-coal">
      <div className="container-x">
        <SectionHeading
          eyebrow="Encontranos"
          title="Ubicación y"
          accent="contacto"
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal className="space-y-6 lg:col-span-2">
            <InfoRow icon={MapPin} title="Dirección">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city}
            </InfoRow>

            <InfoRow icon={Clock} title="Horarios">
              <ul className="space-y-1">
                {siteConfig.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-6">
                    <span>{h.days}</span>
                    <span className="text-bone">{h.time}</span>
                  </li>
                ))}
              </ul>
            </InfoRow>

            <InfoRow icon={Phone} title="Contacto">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-light"
              >
                {siteConfig.phone}
              </a>
            </InfoRow>

            <Button
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <InstagramIcon className="h-4 w-4" />@{siteConfig.instagram.handle}
            </Button>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="metal-border overflow-hidden rounded-sm">
              <iframe
                title="Mapa de Benedetto Peluquería y Barbería"
                src={mapsEmbedUrl()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                // Tema oscuro para el mapa: invierte y rota el matiz.
                className="h-[360px] w-full border-0 [filter:invert(92%)_hue-rotate(180deg)_grayscale(0.4)_contrast(0.9)] sm:h-[440px]"
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
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 font-display text-sm uppercase tracking-[0.25em] text-copper-light">
          {title}
        </h3>
        <div className="text-sm leading-relaxed text-bone-muted">{children}</div>
      </div>
    </div>
  );
}

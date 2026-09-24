"use client";

import { Clock } from "lucide-react";

import { colorist } from "@/data/barbers";
import { services } from "@/data/services";
import { whatsappUrl } from "@/lib/links";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { useBooking } from "@/components/booking/BookingProvider";

export function Services() {
  const { selectService } = useBooking();

  return (
    <section id="servicios" className="section-y bg-ink">
      <div className="container-x">
        <SectionHeading
          eyebrow="Lo que hacemos"
          title="Servicios y precios"
          subtitle="Elegí un servicio y reservá tu turno directamente."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={0.06 * i}>
              <article className="card flex h-full flex-col p-6 hover:border-gold/50 sm:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl">{s.name}</h3>
                  <span className="font-display text-2xl text-gold">
                    {formatPrice(s.price)}
                  </span>
                </div>
                <p className="mt-3 flex-1 leading-relaxed text-bone-muted">
                  {s.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm text-bone-muted">
                    <Clock className="h-4 w-4" />
                    {s.duration} min
                  </span>
                  <Button
                    href="#turnos"
                    variant="outline"
                    className="!px-5 !py-2.5"
                    onClick={() => selectService(s.id)}
                  >
                    Reservar
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Alexander maneja su propia agenda y precios: no entra en el flujo de turnos */}
        <Reveal delay={0.1} className="mt-4">
          <article className="card flex flex-col gap-5 border-dashed p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
                {colorist.role} · {colorist.days}
              </p>
              <h3 className="mt-2 font-display text-2xl">
                Color con {colorist.name}
              </h3>
              <p className="mt-2 max-w-xl leading-relaxed text-bone-muted">
                {colorist.description}
              </p>
            </div>
            <Button
              href={whatsappUrl(colorist.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="shrink-0"
            >
              Consultar precios
            </Button>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

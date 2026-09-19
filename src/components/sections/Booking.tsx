import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BookingFlow } from "@/components/booking/BookingFlow";

export function Booking() {
  return (
    <section id="turnos" className="section-y bg-ink">
      <div className="container-x">
        <SectionHeading
          eyebrow="Turnos"
          title="Reservá tu turno"
          subtitle="Mirá los horarios libres y pedí tu turno por WhatsApp: te confirmamos enseguida. Los turnos son cada 30 minutos."
        />
        <Reveal className="mx-auto max-w-3xl">
          <BookingFlow />
        </Reveal>
      </div>
    </section>
  );
}

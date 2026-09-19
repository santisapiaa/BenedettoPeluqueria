import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BookingFlow } from "@/components/booking/BookingFlow";

export function Booking() {
  return (
    <section id="turnos" className="section-y bg-ink">
      <div className="container-x">
        <SectionHeading
          eyebrow="Reservas online"
          title="Reservá tu turno"
          subtitle="Elegí servicio, peluquero y horario. Los turnos son cada 30 minutos y los horarios que ves están siempre actualizados."
        />
        <Reveal className="mx-auto max-w-3xl">
          <BookingFlow />
        </Reveal>
      </div>
    </section>
  );
}

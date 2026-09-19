import { SectionHeading } from "@/components/ui/SectionHeading";

// TODO (paso 4-5): flujo servicio → barbero → fecha/hora → datos, contra
// /api/bookings (Google Calendar con Service Account).
export function Booking() {
  return (
    <section id="turnos" className="section-y bg-ink">
      <div className="container-x">
        <SectionHeading
          eyebrow="Reservas online"
          title="Reservá tu"
          accent="turno"
        />
        <div className="rounded-sm border border-dashed border-gold/25 p-12 text-center text-sm text-bone-muted">
          Módulo de turnos en construcción
        </div>
      </div>
    </section>
  );
}

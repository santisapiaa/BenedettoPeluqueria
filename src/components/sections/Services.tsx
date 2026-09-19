import { SectionHeading } from "@/components/ui/SectionHeading";

// TODO (paso 2): tarjetas interactivas desde data/services.ts + selección de
// servicio que precarga el módulo de turnos.
export function Services() {
  return (
    <section id="servicios" className="section-y bg-ink">
      <div className="container-x">
        <SectionHeading
          eyebrow="Lo que hacemos"
          title="Servicios y"
          accent="precios"
        />
        <div className="rounded-sm border border-dashed border-gold/25 p-12 text-center text-sm text-bone-muted">
          Sección en construcción
        </div>
      </div>
    </section>
  );
}

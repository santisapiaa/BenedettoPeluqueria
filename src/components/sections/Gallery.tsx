import { SectionHeading } from "@/components/ui/SectionHeading";

// TODO (paso 3): pestañas "El Local" / "Cortes & Estilos" con grilla + lightbox.
export function Gallery() {
  return (
    <section id="galeria" className="section-y bg-coal">
      <div className="container-x">
        <SectionHeading
          eyebrow="Galería"
          title="Nuestro"
          accent="trabajo"
        />
        <div className="rounded-sm border border-dashed border-gold/25 p-12 text-center text-sm text-bone-muted">
          Sección en construcción
        </div>
      </div>
    </section>
  );
}

import { listPublicImages } from "@/lib/public-files";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryTabs } from "@/components/gallery/GalleryTabs";

/**
 * Las fotos se toman de las carpetas:
 *   public/gallery/local   → "El Local"
 *   public/gallery/cortes  → "Cortes y Estilos"
 * Alcanza con copiar las imágenes ahí (se ordenan por nombre de archivo).
 */
export function Gallery() {
  const tabs = [
    { id: "local", label: "El local", images: listPublicImages("gallery/local") },
    {
      id: "cortes",
      label: "Cortes y estilos",
      images: listPublicImages("gallery/cortes"),
    },
  ];

  return (
    <section id="galeria" className="section-y bg-coal">
      <div className="container-x">
        <SectionHeading
          eyebrow="Galería"
          title="El lugar y el trabajo"
          subtitle="Un vistazo al local y a los cortes que hacemos."
        />
        <GalleryTabs tabs={tabs} />
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Tab = { id: string; label: string; images: string[] };

export function GalleryTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const images = current.images;

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) =>
        i === null ? null : (i + dir + images.length) % images.length,
      ),
    [images.length],
  );

  // Teclado + bloqueo de scroll mientras el visor está abierto.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categorías de la galería"
        className="mb-8 flex gap-2 border-b border-white/10"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => {
              setActive(t.id);
              setLightbox(null);
            }}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
              t.id === active
                ? "border-gold text-gold-light"
                : "border-transparent text-bone-muted hover:text-bone",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {images.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 border-dashed py-20 text-center text-bone-muted">
          <Camera className="h-8 w-8 text-gold/60" />
          <p className="text-sm">Muy pronto vas a ver acá las fotos.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                onClick={() => setLightbox(i)}
                className="group relative block aspect-[4/5] w-full overflow-hidden rounded-sm bg-steel"
                aria-label={`Ver foto ${i + 1} de ${images.length}`}
              >
                <Image
                  src={src}
                  alt={`${current.label}, foto ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/25" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightbox !== null && images[lightbox] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotos"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
          onClick={close}
        >
          <button
            aria-label="Cerrar"
            onClick={close}
            className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-bone hover:text-gold-light"
          >
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-2 text-bone hover:text-gold-light"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                aria-label="Foto siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-2 text-bone hover:text-gold-light"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div
            className="relative h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={`${current.label}, foto ${lightbox + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

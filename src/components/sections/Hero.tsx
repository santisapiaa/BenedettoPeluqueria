import Image from "next/image";

import { findPublicImage } from "@/lib/public-files";
import { HeroContent } from "./HeroContent";

export function Hero() {
  // Para usar una foto de fondo: copiala como public/hero.jpg (o .webp/.png).
  const bg = findPublicImage("hero");

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      {bg ? (
        <Image
          src={bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_25%,rgba(184,153,90,0.10),transparent_60%)]"
        />
      )}
      {/* Oscurece la foto para que el texto siempre se lea bien */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-coal via-ink/70 to-ink/50"
      />
      <HeroContent />
    </section>
  );
}

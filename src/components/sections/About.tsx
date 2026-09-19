import Image from "next/image";

import { barbers } from "@/data/barbers";
import { siteConfig } from "@/lib/site";
import { findPublicImage } from "@/lib/public-files";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="historia" className="section-y bg-coal">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nuestra historia"
          title="Un oficio que pasa de padre a hijo"
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-lg leading-relaxed text-bone/90">
              Martín Madonia lleva años detrás del sillón y llegó a tener varias
              sucursales de Benedetto. Hoy concentra toda esa experiencia en un
              solo lugar: el de Cuenca, en Villa del Parque.
            </p>
            <p className="mt-5 leading-relaxed text-bone-muted">
              Junto a él trabaja su hijo Federico, de 22 años, que empezó a
              cortar hace unos tres años y suma mirada joven y técnicas
              actuales. Dos generaciones, una misma idea: el trabajo bien hecho
              no tiene apuro, y cada cliente merece que lo escuchen antes de
              cortar.
            </p>
            <p className="mt-5 leading-relaxed text-bone-muted">
              Desde {siteConfig.foundedYear} se armó algo más que una clientela:
              una comunidad de gente fiel que vuelve corte tras corte.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              {siteConfig.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl font-semibold text-gold">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-bone-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {barbers.map((b, i) => {
              // Foto opcional: public/team/martin.jpg, public/team/federico.jpg
              const photo = findPublicImage(`team/${b.id}`);
              return (
                <Reveal key={b.id} delay={0.1 * i}>
                  <article className="card h-full overflow-hidden hover:border-gold/40">
                    <div className="relative aspect-[4/5] bg-steel">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={b.name}
                          fill
                          sizes="(min-width: 640px) 25vw, 90vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-display text-5xl text-gold/40">
                          {b.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl">{b.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
                        {b.role}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-bone-muted">
                        {b.bio}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

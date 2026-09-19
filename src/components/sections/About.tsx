import Image from "next/image";

import { barbers } from "@/data/barbers";
import { siteConfig } from "@/lib/site";
import { findPublicImage } from "@/lib/public-files";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  // Foto de la historia: public/historia/martin-miami.jpg
  const martinPhoto = findPublicImage("historia/martin-miami");

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
              Martín Madonia se dedica a esto hace muchos años. De joven cortó
              el pelo en Miami y, al volver, pasó por distintas zonas con
              Benedetto hasta quedarse acá, en Cuenca, en Villa del Parque.
            </p>
            <p className="mt-5 leading-relaxed text-bone-muted">
              Hoy trabaja junto a su hijo Federico, de 22 años, que empezó a
              cortar hace unos tres años. Cada uno con su estilo, pero con la
              misma idea: escuchar bien lo que quiere cada cliente y hacer el
              corte sin apuro.
            </p>
            <p className="mt-5 leading-relaxed text-bone-muted">
              Es una peluquería de barrio, con buena música y charla. Desde{" "}
              {siteConfig.foundedYear} se armó una clientela fiel, gente que
              vuelve seguido y trae a los suyos.
            </p>

            {martinPhoto && (
              <figure className="mt-8 flex items-center gap-5">
                <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-sm border border-white/10 sm:h-52 sm:w-40">
                  <Image
                    src={martinPhoto}
                    alt="Martín Madonia de joven, cortando el pelo en Miami"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-sm leading-relaxed text-bone-muted">
                  Martín, de joven, en sus años cortando el pelo en Miami.
                </figcaption>
              </figure>
            )}

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
                          className="object-cover object-top"
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

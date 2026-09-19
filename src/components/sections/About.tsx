import { Award, Flame, Scissors, Users } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    icon: Scissors,
    title: "Oficio",
    text: "Técnica clásica aprendida y perfeccionada: tijera, máquina y navaja.",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    text: "Cada cliente es distinto. Escuchamos antes de cortar.",
  },
  {
    icon: Flame,
    title: "Actitud",
    text: "Ambiente urbano, música y buena charla. Un lugar con identidad.",
  },
  {
    icon: Award,
    title: "Clientes fieles",
    text: "Desde 2019, gente que vuelve y trae a los suyos.",
  },
];

export function About() {
  return (
    <section id="historia" className="section-y bg-coal">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nuestra historia"
          title="Un oficio con"
          accent="trayectoria"
          subtitle="Desde 2019, Benedetto es un lugar de barrio con oficio de barbería: buen corte, buen trato y una charla de por medio."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-lg leading-relaxed text-bone/90">
              Benedetto es un oficio que pasa de padre a hijo. Martín Madonia
              lleva años detrás del sillón y llegó a tener varias sucursales de
              Benedetto; hoy concentra toda esa experiencia en un solo lugar,
              el de Cuenca, en Villa del Parque.
            </p>
            <p className="mt-4 leading-relaxed text-bone-muted">
              Junto a él trabaja su hijo Federico, de 22 años, que empezó a
              cortar hace unos tres años y suma mirada joven y técnicas
              actuales. Dos generaciones, una misma idea: el trabajo bien hecho
              no tiene apuro, y cada cliente merece que lo escuchen antes de
              cortar.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 border-y border-gold/15 py-8">
              {siteConfig.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-gold-metal font-display text-4xl font-semibold sm:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-bone-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.08 * i}>
                <div className="metal-border group h-full rounded-sm bg-graphite p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-steel/60">
                  <p.icon className="h-7 w-7 text-copper-light transition-colors group-hover:text-gold-light" />
                  <h3 className="mt-4 font-display text-lg uppercase tracking-wider">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

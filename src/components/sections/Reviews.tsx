import { Star } from "lucide-react";

import { reviews } from "@/data/reviews";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function Reviews() {
  const hasReviews = reviews.length > 0;

  return (
    <section id="resenas" className="section-y bg-ink">
      <div className="container-x">
        <SectionHeading
          eyebrow="Opiniones"
          title="Lo que dicen nuestros clientes"
          subtitle={
            hasReviews
              ? "Reseñas reales de clientes en Google."
              : "Tu opinión nos ayuda a seguir mejorando y a que más gente nos conozca."
          }
        />

        {hasReviews && (
          <ul className="grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <li key={`${r.author}-${i}`}>
                <Reveal delay={0.08 * i} className="h-full">
                  <figure className="card flex h-full flex-col p-6">
                    <div
                      className="flex gap-0.5 text-gold"
                      role="img"
                      aria-label={`${r.rating} de 5 estrellas`}
                    >
                      {Array.from({ length: 5 }, (_, s) => (
                        <Star
                          key={s}
                          className="h-4 w-4"
                          fill={s < r.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 leading-relaxed text-bone/90">
                      “{r.text}”
                    </blockquote>
                    <figcaption className="mt-5 border-t border-white/10 pt-4 text-sm">
                      <span className="text-bone">{r.author}</span>
                      <span className="block text-xs text-bone-muted">
                        Reseña de Google{r.date ? ` · ${r.date}` : ""}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <Reveal className="mt-10 flex justify-center">
          <Button
            href={siteConfig.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant={hasReviews ? "outline" : "primary"}
          >
            <Star className="h-4 w-4" />
            {hasReviews ? "Ver todas las reseñas en Google" : "Ver y dejar reseñas en Google"}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

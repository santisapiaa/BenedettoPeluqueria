import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  /** Palabra o frase del título que se resalta en serif itálica dorada. */
  accent?: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center",
}: Props) {
  return (
    <Reveal
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <p className="mb-4 font-display text-xs uppercase tracking-[0.35em] text-copper-light">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-semibold uppercase leading-tight tracking-wide sm:text-5xl">
        {title}{" "}
        {accent && (
          <span className="text-gold-metal font-serif font-normal normal-case italic">
            {accent}
          </span>
        )}
      </h2>

      {/* Divisor ornamental: líneas metálicas + rombo */}
      <div
        className={cn(
          "mt-6 flex items-center gap-3",
          align === "center" && "justify-center",
        )}
        aria-hidden="true"
      >
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
      </div>

      {subtitle && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-relaxed text-bone-muted",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

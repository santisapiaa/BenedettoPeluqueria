import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: Props) {
  return (
    <Reveal
      className={cn(
        "mb-12 sm:mb-14",
        align === "center" && "text-center",
      )}
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h2>
      <div
        className={cn(
          "mt-5 h-px w-14 bg-gold",
          align === "center" && "mx-auto",
        )}
        aria-hidden="true"
      />
      {subtitle && (
        <p
          className={cn(
            "mt-5 max-w-2xl leading-relaxed text-bone-muted",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

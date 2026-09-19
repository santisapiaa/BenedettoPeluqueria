import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline";

type BaseProps = {
  variant?: Variant;
  className?: string;
};

type AsLink = BaseProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className"
  >;
type AsButton = BaseProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className"
  >;

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-sm px-7 py-3.5 " +
  "font-display text-sm font-medium uppercase tracking-[0.18em] transition-all duration-300 " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-metal text-ink shadow-[0_0_0_1px_rgba(232,205,133,0.4)] hover:shadow-[0_0_28px_rgba(201,162,75,0.35)]",
  outline:
    "border border-copper/70 text-copper-light hover:border-gold hover:text-gold-light hover:bg-gold/5",
};

/** Barrido de brillo metálico al hacer hover. */
function Shine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]"
    />
  );
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {variant === "primary" && <Shine />}
        <span className="relative flex items-center gap-2">{children}</span>
      </a>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    >
      {variant === "primary" && <Shine />}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}

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
  "inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-[0.78rem] font-medium " +
  "uppercase tracking-[0.16em] transition-colors duration-200 " +
  "disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-light",
  outline:
    "border border-white/25 text-bone hover:border-gold hover:text-gold-light",
};

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, ...rest } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes} />
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    />
  );
}

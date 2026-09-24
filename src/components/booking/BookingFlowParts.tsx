import { Check } from "lucide-react";

import { longDate } from "@/lib/date-format";
import { whatsappUrl } from "@/lib/links";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Subcomponentes de presentación del flujo de turnos (sin estado propio). */

const STEPS = ["Servicio", "Peluquero", "Día y horario"];

export function Stepper({
  current,
  onGo,
}: {
  current: number;
  onGo: (s: number) => void;
}) {
  return (
    <ol className="mb-8 flex items-center gap-2 sm:gap-4">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={!done}
              onClick={() => onGo(i)}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs",
                  active && "border-gold bg-gold text-ink",
                  done && "border-gold text-gold",
                  !active && !done && "border-white/20 text-bone-muted",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs uppercase tracking-[0.14em] sm:inline",
                  active ? "text-bone" : "text-bone-muted",
                )}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-white/10" />}
          </li>
        );
      })}
    </ol>
  );
}

export function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-full w-full rounded-sm border p-4 text-left transition-colors",
        selected
          ? "border-gold bg-gold/10"
          : "border-white/10 hover:border-gold/50 hover:bg-white/[0.02]",
      )}
    >
      {children}
    </button>
  );
}

export function SlotGroup({
  label,
  times,
  selected,
  onPick,
}: {
  label: string;
  times: string[];
  selected: string | null;
  onPick: (t: string) => void;
}) {
  if (times.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-bone-muted">{label}</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {times.map((t) => (
          <button
            key={t}
            aria-pressed={selected === t}
            onClick={() => onPick(t)}
            className={cn(
              "rounded-sm border py-2.5 text-sm transition-colors",
              selected === t
                ? "border-gold bg-gold text-ink"
                : "border-white/15 hover:border-gold/60 hover:text-gold-light",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function UnavailableNotice({
  reason,
  service,
  date,
}: {
  reason?: "not_configured" | "generic";
  service?: string;
  date: string;
}) {
  const message = `¡Hola! Quisiera consultar horarios${service ? ` para ${service}` : ""} el ${longDate(date)}.`;
  return (
    <div className="rounded-sm border border-white/10 p-5 text-sm">
      <p className="text-bone">
        {reason === "not_configured"
          ? "Los horarios en línea estarán disponibles muy pronto."
          : "No pudimos consultar los horarios en este momento."}
      </p>
      <p className="mt-1 text-bone-muted">Mientras tanto, consultanos por WhatsApp:</p>
      <Button
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        className="mt-4"
      >
        <WhatsAppIcon className="h-4 w-4" /> Consultar por WhatsApp
      </Button>
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-gold">{label}</dt>
      <dd className={cn("text-bone", className)}>{value}</dd>
    </div>
  );
}

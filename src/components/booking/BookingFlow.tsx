"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarPlus, Check, ChevronLeft, Loader2 } from "lucide-react";

import { barbers } from "@/data/barbers";
import { getService, services } from "@/data/services";
import { bookingSchema } from "@/lib/booking-schema";
import { openingHours, siteConfig, whatsappUrl } from "@/lib/site";
import {
  MAX_DAYS_AHEAD,
  TZ,
  addDays,
  dayOfWeek,
  nowInBA,
  toHHMM,
  toMinutes,
} from "@/lib/time";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useBooking } from "./BookingProvider";

type Step = 0 | 1 | 2 | 3 | 4; // 4 = confirmación
type SlotsState = {
  status: "idle" | "loading" | "ready" | "error";
  times: string[];
  error?: "not_configured" | "generic";
  demo?: boolean;
};
type Confirmation = {
  serviceName: string;
  barberName: string;
  price: number;
  duration: number;
  date: string;
  time: string;
  demo: boolean;
};

const STEPS = ["Servicio", "Peluquero", "Fecha y hora", "Tus datos"];

const utcFmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-AR", { ...opts, timeZone: "UTC" });

const longDate = (date: string) =>
  utcFmt({ weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${date}T12:00:00Z`),
  );

export function BookingFlow() {
  const booking = useBooking();

  const [step, setStep] = useState<Step>(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState("any");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const [days, setDays] = useState<string[]>([]);
  const [slots, setSlots] = useState<SlotsState>({ status: "idle", times: [] });
  const [refreshKey, setRefreshKey] = useState(0);

  const service = serviceId ? getService(serviceId) : undefined;
  const barber = barbers.find((b) => b.id === barberId);

  // Los días se calculan en el cliente: la página es estática y las fechas cambian.
  useEffect(() => {
    const today = nowInBA().date;
    const list: string[] = [];
    for (let i = 0; i <= MAX_DAYS_AHEAD; i++) {
      const d = addDays(today, i);
      if (openingHours[dayOfWeek(d)]) list.push(d);
    }
    setDays(list);
  }, []);

  // Servicio elegido desde la sección "Servicios": saltamos al paso del peluquero.
  useEffect(() => {
    if (!booking.serviceId) return;
    setServiceId(booking.serviceId);
    setDate(null);
    setTime(null);
    setConfirmation(null);
    setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.nonce]);

  // Horarios disponibles en tiempo real cada vez que cambia la elección.
  useEffect(() => {
    if (!date || !serviceId) return;
    const ctrl = new AbortController();
    setSlots({ status: "loading", times: [] });

    const qs = new URLSearchParams({ date, service: serviceId, barber: barberId });
    fetch(`/api/availability?${qs}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error ?? "generic");
        return json as { slots: { time: string }[]; demo?: boolean };
      })
      .then((json) =>
        setSlots({
          status: "ready",
          times: json.slots.map((s) => s.time),
          demo: json.demo,
        }),
      )
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setSlots({
          status: "error",
          times: [],
          error: e.message === "not_configured" ? "not_configured" : "generic",
        });
      });

    return () => ctrl.abort();
  }, [date, serviceId, barberId, refreshKey]);

  function pickService(id: string) {
    setServiceId(id);
    setDate(null);
    setTime(null);
    setStep(1);
  }

  function pickBarber(id: string) {
    setBarberId(id);
    setTime(null);
    setStep(2);
  }

  function reset() {
    setStep(0);
    setServiceId(null);
    setBarberId("any");
    setDate(null);
    setTime(null);
    setConfirmation(null);
    setSubmitError(null);
    setFieldErrors({});
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!serviceId || !date || !time) return;
    setSubmitError(null);

    const payload = { serviceId, barberId, date, time, ...form };
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] ??= issue.message;
      }
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok && json.booking) {
        setConfirmation({ ...json.booking, demo: Boolean(json.demo) });
        setStep(4);
      } else if (res.status === 409) {
        // Alguien se llevó el horario: volvemos a elegir con datos frescos.
        setTime(null);
        setRefreshKey((k) => k + 1);
        setStep(2);
        setSubmitError(json.message ?? "Ese horario acaba de ocuparse.");
      } else if (res.status === 422 && json.fields) {
        const errs: Record<string, string> = {};
        for (const [k, v] of Object.entries(json.fields as Record<string, string[]>)) {
          errs[k] = v[0];
        }
        setFieldErrors(errs);
      } else {
        setSubmitError(json.message ?? "No pudimos registrar el turno. Probá de nuevo.");
      }
    } catch {
      setSubmitError("Sin conexión. Revisá tu internet y probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const morning = slots.times.filter((t) => toMinutes(t) < 13 * 60);
  const afternoon = slots.times.filter((t) => toMinutes(t) >= 13 * 60);

  return (
    <div className="card p-5 sm:p-8">
      {step < 4 && <Stepper current={step} onGo={(s) => s < step && setStep(s as Step)} />}

      {step > 0 && step < 4 && (
        <button
          onClick={() => setStep((s) => (s - 1) as Step)}
          className="mb-6 inline-flex items-center gap-1 text-sm text-bone-muted transition-colors hover:text-gold-light"
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </button>
      )}

      {/* PASO 0: servicio */}
      {step === 0 && (
        <div>
          <h3 className="mb-5 font-display text-2xl">¿Qué servicio querés?</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.id}>
                <OptionButton selected={serviceId === s.id} onClick={() => pickService(s.id)}>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-gold">{formatPrice(s.price)}</span>
                  </span>
                  <span className="mt-1 block text-sm text-bone-muted">
                    {s.duration} min
                  </span>
                </OptionButton>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PASO 1: peluquero (opcional) */}
      {step === 1 && (
        <div>
          <h3 className="mb-1 font-display text-2xl">¿Con quién?</h3>
          <p className="mb-5 text-sm text-bone-muted">
            Es opcional: si no tenés preferencia, te asignamos a quien esté libre.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            <li>
              <OptionButton selected={barberId === "any"} onClick={() => pickBarber("any")}>
                <span className="font-medium">Sin preferencia</span>
                <span className="mt-1 block text-sm text-bone-muted">
                  Más horarios disponibles
                </span>
              </OptionButton>
            </li>
            {barbers.map((b) => (
              <li key={b.id}>
                <OptionButton selected={barberId === b.id} onClick={() => pickBarber(b.id)}>
                  <span className="font-medium">{b.name}</span>
                  <span className="mt-1 block text-sm text-bone-muted">{b.role}</span>
                </OptionButton>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PASO 2: fecha y hora */}
      {step === 2 && (
        <div>
          <h3 className="mb-5 font-display text-2xl">Elegí día y horario</h3>

          {submitError && (
            <p role="alert" className="mb-5 rounded-sm border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {submitError}
            </p>
          )}

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
            {days.map((d) => {
              const dt = new Date(`${d}T12:00:00Z`);
              return (
                <button
                  key={d}
                  aria-pressed={date === d}
                  onClick={() => {
                    setDate(d);
                    setTime(null);
                    setSubmitError(null);
                  }}
                  className={cn(
                    "flex w-16 shrink-0 flex-col items-center rounded-sm border px-2 py-3 transition-colors",
                    date === d
                      ? "border-gold bg-gold/10 text-gold-light"
                      : "border-white/10 hover:border-gold/50",
                  )}
                >
                  <span className="text-[0.65rem] uppercase tracking-widest text-bone-muted">
                    {utcFmt({ weekday: "short" }).format(dt).replace(".", "")}
                  </span>
                  <span className="font-display text-2xl">{dt.getUTCDate()}</span>
                  <span className="text-[0.65rem] uppercase text-bone-muted">
                    {utcFmt({ month: "short" }).format(dt).replace(".", "")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 min-h-32" aria-live="polite">
            {!date && (
              <p className="text-sm text-bone-muted">Elegí un día para ver los horarios.</p>
            )}

            {date && slots.status === "loading" && (
              <p className="flex items-center gap-2 text-sm text-bone-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Consultando horarios…
              </p>
            )}

            {date && slots.status === "error" && (
              <UnavailableNotice reason={slots.error} service={service?.name} date={date} />
            )}

            {date && slots.status === "ready" && (
              <>
                {slots.demo && (
                  <p className="mb-4 rounded-sm border border-gold/30 px-3 py-2 text-xs text-gold-light">
                    Modo demostración: los horarios no reflejan el calendario real.
                  </p>
                )}
                {slots.times.length === 0 ? (
                  <p className="text-sm text-bone-muted">
                    No quedan horarios este día. Probá con otra fecha
                    {barberId !== "any" ? " o sin preferencia de peluquero" : ""}.
                  </p>
                ) : (
                  <div className="space-y-5">
                    <SlotGroup label="Mañana" times={morning} selected={time} onPick={setTime} />
                    <SlotGroup label="Tarde" times={afternoon} selected={time} onPick={setTime} />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button disabled={!time} onClick={() => setStep(3)}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* PASO 3: datos del cliente */}
      {step === 3 && service && date && time && (
        <form onSubmit={onSubmit} noValidate>
          <h3 className="mb-5 font-display text-2xl">Tus datos</h3>

          <dl className="mb-6 grid gap-x-8 gap-y-2 rounded-sm border border-white/10 p-4 text-sm sm:grid-cols-2">
            <SummaryRow label="Servicio" value={`${service.name} · ${formatPrice(service.price)}`} />
            <SummaryRow label="Peluquero" value={barber?.name ?? "Sin preferencia"} />
            <SummaryRow label="Día" value={longDate(date)} className="capitalize" />
            <SummaryRow label="Hora" value={`${time} h`} />
          </dl>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre y apellido" error={fieldErrors.name} className="sm:col-span-2">
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Email" error={fieldErrors.email}>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Teléfono / WhatsApp" error={fieldErrors.phone}>
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Honeypot: invisible para personas */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          {submitError && (
            <p role="alert" className="mt-5 rounded-sm border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirmar turno
            </Button>
          </div>
        </form>
      )}

      {/* PASO 4: confirmación */}
      {step === 4 && confirmation && (
        <div className="py-4 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
            <Check className="h-7 w-7" />
          </span>
          <h3 className="mt-5 font-display text-3xl">¡Turno confirmado!</h3>
          {confirmation.demo && (
            <p className="mx-auto mt-3 max-w-md text-xs text-gold-light">
              Modo demostración: este turno no se guardó en ningún calendario.
            </p>
          )}
          <dl className="mx-auto mt-6 grid max-w-md gap-2 rounded-sm border border-white/10 p-5 text-left text-sm">
            <SummaryRow label="Servicio" value={`${confirmation.serviceName} · ${formatPrice(confirmation.price)}`} />
            <SummaryRow label="Peluquero" value={confirmation.barberName} />
            <SummaryRow label="Día" value={longDate(confirmation.date)} className="capitalize" />
            <SummaryRow label="Hora" value={`${confirmation.time} h`} />
            <SummaryRow
              label="Lugar"
              value={`${siteConfig.address.street}, ${siteConfig.address.city}`}
            />
          </dl>
          <p className="mx-auto mt-5 max-w-md text-sm text-bone-muted">
            Te esperamos. Si necesitás cancelar o cambiar el turno, avisanos por
            WhatsApp.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={calendarLink(confirmation)} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-4 w-4" /> Agregar a mi calendario
            </Button>
            <Button
              href={whatsappUrl(
                `Hola! Reservé un turno (${confirmation.serviceName}) el ${longDate(confirmation.date)} a las ${confirmation.time}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Avisar por WhatsApp
            </Button>
          </div>
          <button
            onClick={reset}
            className="mt-6 text-sm text-bone-muted underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            Reservar otro turno
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

const inputClass =
  "w-full rounded-sm border border-white/15 bg-coal px-4 py-3 text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

function Stepper({ current, onGo }: { current: Step; onGo: (s: number) => void }) {
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
                  "hidden text-xs uppercase tracking-[0.14em] md:inline",
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

function OptionButton({
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

function SlotGroup({
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

function UnavailableNotice({
  reason,
  service,
  date,
}: {
  reason?: "not_configured" | "generic";
  service?: string;
  date: string;
}) {
  const message = `Hola! Quisiera reservar un turno${service ? ` de ${service}` : ""} para el ${longDate(date)}.`;
  return (
    <div className="rounded-sm border border-white/10 p-5 text-sm">
      <p className="text-bone">
        {reason === "not_configured"
          ? "Las reservas online estarán disponibles muy pronto."
          : "No pudimos consultar los horarios en este momento."}
      </p>
      <p className="mt-1 text-bone-muted">Mientras tanto, reservá por WhatsApp:</p>
      <Button
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        className="mt-4"
      >
        Reservar por WhatsApp
      </Button>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-bone-muted">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-red-300">{error}</span>}
    </label>
  );
}

function SummaryRow({
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

/** Link "Agregar a Google Calendar" para el cliente. */
function calendarLink(c: Confirmation) {
  const stamp = (t: string) => `${c.date.replaceAll("-", "")}T${t.replace(":", "")}00`;
  const end = toHHMM(toMinutes(c.time) + c.duration);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${c.serviceName} en ${siteConfig.name}`,
    dates: `${stamp(c.time)}/${stamp(end)}`,
    ctz: TZ,
    location: `${siteConfig.address.street}, ${siteConfig.address.city}`,
    details: `Turno con ${c.barberName}.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

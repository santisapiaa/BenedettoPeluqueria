"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { track } from "@vercel/analytics";

import { barbers } from "@/data/barbers";
import { getService, services } from "@/data/services";
import { dayNumber, longDate, monthName, weekdayName } from "@/lib/date-format";
import { whatsappUrl } from "@/lib/links";
import { toMinutes } from "@/lib/time";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { useBooking } from "./BookingProvider";
import { useBookingDays } from "./useBookingDays";
import { useAvailability } from "./useAvailability";
import { buildBookingMessage } from "./booking-message";
import {
  OptionButton,
  SlotGroup,
  Stepper,
  SummaryRow,
  UnavailableNotice,
} from "./BookingFlowParts";

/**
 * La web muestra los horarios libres (leídos de Google Calendar) y el turno se
 * cierra por WhatsApp: no se guarda nada desde acá.
 */

export type BookingStep = 0 | 1 | 2;

export function BookingFlow() {
  const booking = useBooking();

  const [step, setStep] = useState<BookingStep>(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState("any");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const { days, closedHolidays } = useBookingDays();
  const slots = useAvailability(date, serviceId, barberId);

  const service = serviceId ? getService(serviceId) : undefined;
  const barber = barbers.find((b) => b.id === barberId);

  // Servicio elegido desde la sección "Servicios": saltamos al paso del peluquero.
  useEffect(() => {
    if (!booking.serviceId) return;
    setServiceId(booking.serviceId);
    setDate(null);
    setTime(null);
    setStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.nonce]);

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

  const morning = slots.times.filter((t) => toMinutes(t) < 13 * 60);
  const afternoon = slots.times.filter((t) => toMinutes(t) >= 13 * 60);

  const whatsappMessage = buildBookingMessage({ service, date, time, barber, name });

  // Abre WhatsApp con el pedido ya escrito. Solo falta que la persona toque "Enviar".
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setNameError(true);
      return;
    }
    // Métrica (solo cuenta pedidos; no envía datos personales).
    track("pedido_whatsapp", { servicio: service?.id ?? "", peluquero: barberId });
    window.open(whatsappUrl(whatsappMessage), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="card p-5 sm:p-8">
      <Stepper current={step} onGo={(s) => s < step && setStep(s as BookingStep)} />

      {step > 0 && (
        <button
          onClick={() => setStep((s) => (s - 1) as BookingStep)}
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
            Es opcional: si no tenés preferencia, ves los horarios de los dos.
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

      {/* PASO 2: día y horario → WhatsApp */}
      {step === 2 && (
        <div>
          <h3 className="mb-5 font-display text-2xl">Elegí día y horario</h3>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
            {days.map((d) => (
              <button
                key={d}
                aria-pressed={date === d}
                onClick={() => {
                  setDate(d);
                  setTime(null);
                }}
                className={cn(
                  "flex w-16 shrink-0 flex-col items-center rounded-sm border px-2 py-3 transition-colors",
                  date === d
                    ? "border-gold bg-gold/10 text-gold-light"
                    : "border-white/10 hover:border-gold/50",
                )}
              >
                <span className="text-[0.65rem] uppercase tracking-widest text-bone-muted">
                  {weekdayName(d, "short").replace(".", "")}
                </span>
                <span className="font-display text-2xl">{dayNumber(d)}</span>
                <span className="text-[0.65rem] uppercase text-bone-muted">
                  {monthName(d, "short").replace(".", "")}
                </span>
              </button>
            ))}
          </div>
          {closedHolidays.length > 0 && (
            <p className="mt-2 text-xs text-bone-muted">
              Cerrado por feriado:{" "}
              {closedHolidays.map((d) => longDate(d)).join(" · ")}.
            </p>
          )}

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

          {/* Resumen + pedido por WhatsApp */}
          {service && date && time && (
            <form
              onSubmit={onSubmit}
              noValidate
              className="mt-8 rounded-sm border border-gold/30 p-5"
            >
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <SummaryRow label="Servicio" value={`${service.name} · ${formatPrice(service.price)}`} />
                <SummaryRow label="Peluquero" value={barber?.name ?? "Sin preferencia"} />
                <SummaryRow label="Día" value={longDate(date)} className="capitalize" />
                <SummaryRow label="Horario" value={`${time} h`} />
              </dl>

              <label className="mt-6 block">
                <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-bone-muted">
                  Tu nombre
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(false);
                  }}
                  aria-invalid={nameError}
                  maxLength={60}
                  placeholder="Tu nombre"
                  className="w-full rounded-sm border border-white/15 bg-coal px-4 py-3 text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none aria-[invalid=true]:border-red-400"
                />
                {nameError && (
                  <span className="mt-1.5 block text-sm text-red-300">
                    Ingresá tu nombre para continuar.
                  </span>
                )}
              </label>

              <Button type="submit" className="mt-5 w-full">
                <WhatsAppIcon className="h-4 w-4" /> Ir a WhatsApp
              </Button>
              <p className="mt-3 text-center text-xs text-bone-muted">
                Se abre WhatsApp con tu pedido escrito: solo tocá &quot;Enviar&quot;. El turno queda
                reservado cuando te confirmemos.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

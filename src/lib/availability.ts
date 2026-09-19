import { barbers } from "@/data/barbers";
import { SLOT_MINUTES, openingHours } from "@/lib/site";
import {
  MAX_DAYS_AHEAD,
  MIN_NOTICE_MINUTES,
  TZ_OFFSET,
  addDays,
  dayOfWeek,
  isValidDate,
  nowInBA,
  toHHMM,
  toMinutes,
} from "@/lib/time";

/** Intervalo ocupado, en minutos desde la medianoche del día consultado. */
export type Busy = {
  start: number;
  end: number;
  /** null = ocupa a todos (evento de día completo o de color desconocido) */
  barberId: string | null;
};

export type Slot = { time: string; barberIds: string[] };

/** Forma mínima de un evento de Google Calendar (lo que necesitamos leer). */
export type CalEvent = {
  status?: string | null;
  transparency?: string | null;
  colorId?: string | null;
  start?: { date?: string | null; dateTime?: string | null } | null;
  end?: { date?: string | null; dateTime?: string | null } | null;
  extendedProperties?: { private?: Record<string, string> | null } | null;
};

/**
 * Convierte eventos de un calendario en intervalos ocupados del día `date`.
 *
 * `owner` es el id del peluquero si el calendario es SUYO (un calendario por
 * peluquero): todo lo que hay ahí lo ocupa a él. Si es null, el calendario es
 * compartido y el dueño de cada evento se deduce de:
 *   1. la marca barberId de los turnos creados desde la web,
 *   2. el color del evento (colorId) definido en data/barbers.ts,
 *   3. si no se puede deducir, ocupa a todos (lado seguro).
 */
export function eventsToBusy(
  events: CalEvent[],
  date: string,
  owner: string | null,
): Busy[] {
  const dayStart = Date.parse(`${date}T00:00:00${TZ_OFFSET}`);
  const byColor = new Map(
    barbers.filter((b) => b.colorId).map((b) => [b.colorId!, b.id]),
  );
  const busy: Busy[] = [];

  for (const e of events) {
    if (e.status === "cancelled") continue;
    // Eventos marcados como "Disponible" no bloquean el horario.
    if (e.transparency === "transparent") continue;

    const barberId =
      owner ??
      e.extendedProperties?.private?.barberId ??
      (e.colorId ? byColor.get(e.colorId) : undefined) ??
      null;

    if (e.start?.date) {
      // Evento de día completo (feriado, vacaciones…): ocupa todo el día.
      busy.push({ start: 0, end: 24 * 60, barberId });
      continue;
    }
    if (!e.start?.dateTime || !e.end?.dateTime) continue;

    busy.push({
      start: (Date.parse(e.start.dateTime) - dayStart) / 60000,
      end: (Date.parse(e.end.dateTime) - dayStart) / 60000,
      barberId,
    });
  }

  return busy;
}

type Input = {
  date: string;
  /** duración del servicio en minutos */
  duration: number;
  /** id del peluquero o "any" */
  barberId: string;
  busy: Busy[];
  now?: { date: string; minutes: number };
};

/** Devuelve el motivo por el que una fecha no se puede reservar, o null si sí. */
export function validateBookableDate(date: string): string | null {
  if (!isValidDate(date)) return "Fecha inválida.";
  const today = nowInBA().date;
  if (date < today) return "Esa fecha ya pasó.";
  if (date > addDays(today, MAX_DAYS_AHEAD)) {
    return `Solo se puede reservar con hasta ${MAX_DAYS_AHEAD} días de anticipación.`;
  }
  if (!openingHours[dayOfWeek(date)]) return "Ese día el local está cerrado.";
  return null;
}

/**
 * Calcula los horarios libres de un día.
 * Función pura: recibe los intervalos ocupados y no toca red ni Google.
 */
export function computeSlots({
  date,
  duration,
  barberId,
  busy,
  now = nowInBA(),
}: Input): Slot[] {
  const ranges = openingHours[dayOfWeek(date)] ?? [];
  const candidates =
    barberId === "any" ? barbers : barbers.filter((b) => b.id === barberId);
  const dow = dayOfWeek(date);
  const slots: Slot[] = [];

  for (const [from, to] of ranges) {
    const end = toMinutes(to);
    for (let start = toMinutes(from); start + duration <= end; start += SLOT_MINUTES) {
      // No ofrecer horarios pasados ni con menos de la anticipación mínima.
      if (date < now.date) continue;
      if (date === now.date && start < now.minutes + MIN_NOTICE_MINUTES) continue;

      const free = candidates.filter((b) => {
        if (
          b.lateStart?.days.includes(dow) &&
          start < toMinutes(b.lateStart.from)
        ) {
          return false;
        }
        return !busy.some(
          (x) =>
            x.start < start + duration &&
            x.end > start &&
            (x.barberId === null || x.barberId === b.id),
        );
      });

      if (free.length) {
        slots.push({ time: toHHMM(start), barberIds: free.map((b) => b.id) });
      }
    }
  }

  return slots;
}

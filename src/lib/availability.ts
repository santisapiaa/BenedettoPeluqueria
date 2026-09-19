import { barbers } from "@/data/barbers";
import { SLOT_MINUTES, openingHours } from "@/lib/site";
import {
  MAX_DAYS_AHEAD,
  MIN_NOTICE_MINUTES,
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

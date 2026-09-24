import { getHoliday } from "@/data/holidays";
import { openingRangesFor } from "@/lib/site";
import { addDays, dayOfWeek, nowInBA, toMinutes } from "@/lib/time";

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
/** Hasta cuántos días adelante se busca el próximo día de apertura. */
const MAX_LOOKAHEAD_DAYS = 15;

export type OpenStatus =
  | { open: true; closesAt: string }
  | {
      open: false;
      /** Nombre del feriado si hoy se está cerrado por feriado. */
      holiday?: string;
      next: { when: string; time: string } | null;
    };

/**
 * ¿Está abierto ahora? Usa el horario de atención de site.ts (hora de Buenos Aires)
 * y respeta los feriados. `when` es lo que sigue a "Abrimos": "hoy", "mañana" o "el martes".
 */
export function getOpenStatus(now = nowInBA()): OpenStatus {
  const holidayToday = getHoliday(now.date)?.name;

  for (let i = 0; i < MAX_LOOKAHEAD_DAYS; i++) {
    const date = addDays(now.date, i);
    if (getHoliday(date)) continue;
    const dow = dayOfWeek(date);

    for (const [from, to] of openingRangesFor(date)) {
      if (i === 0) {
        if (now.minutes >= toMinutes(from) && now.minutes < toMinutes(to)) {
          return { open: true, closesAt: to };
        }
        if (now.minutes < toMinutes(from)) {
          return { open: false, next: { when: "hoy", time: from } };
        }
      } else {
        return {
          open: false,
          holiday: holidayToday,
          next: { when: i === 1 ? "mañana" : `el ${DAY_NAMES[dow]}`, time: from },
        };
      }
    }
  }
  return { open: false, holiday: holidayToday, next: null };
}

import { openingHours } from "@/lib/site";
import { addDays, dayOfWeek, nowInBA, toMinutes } from "@/lib/time";

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; next: { when: string; time: string } | null };

/**
 * ¿Está abierto ahora? Usa el horario de atención de site.ts (hora de Buenos Aires).
 * `when` es lo que sigue a "Abrimos": "hoy", "mañana" o "el martes".
 */
export function getOpenStatus(now = nowInBA()): OpenStatus {
  for (let i = 0; i < 8; i++) {
    const date = addDays(now.date, i);
    const dow = dayOfWeek(date);

    for (const [from, to] of openingHours[dow] ?? []) {
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
          next: { when: i === 1 ? "mañana" : `el ${DAY_NAMES[dow]}`, time: from },
        };
      }
    }
  }
  return { open: false, next: null };
}

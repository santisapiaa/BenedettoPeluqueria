import { holidays, getHoliday, type Holiday } from "@/data/holidays";
import { openingHours } from "@/lib/site";
import { addDays, dayOfWeek } from "@/lib/time";

const utc = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-AR", { ...opts, timeZone: "UTC" });

const noon = (date: string) => new Date(`${date}T12:00:00Z`);
const weekday = (date: string) => utc({ weekday: "long" }).format(noon(date));
const month = (date: string) => utc({ month: "long" }).format(noon(date));
const day = (date: string) => noon(date).getUTCDate();

/**
 * Avisos automáticos de feriado: desde `daysAhead` días antes hasta el propio
 * feriado. Solo cuenta los feriados que caen en un día en que normalmente se
 * atiende (un feriado en lunes no genera aviso: ya se está cerrado).
 */
export function holidayNotices(today: string, daysAhead = 7): string[] {
  const limit = addDays(today, daysAhead);
  const relevant = holidays
    .filter(
      (h) =>
        h.date >= today &&
        h.date <= limit &&
        getHoliday(h.date) &&
        openingHours[dayOfWeek(h.date)],
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  // Agrupa feriados en días consecutivos (ej.: jueves 9 y viernes 10 de julio).
  const groups: Holiday[][] = [];
  for (const h of relevant) {
    const last = groups.at(-1);
    if (last && addDays(last.at(-1)!.date, 1) === h.date) last.push(h);
    else groups.push([h]);
  }

  return groups.map((g) => {
    const names = [...new Set(g.map((h) => h.name))].join(" y ");
    if (g.length === 1) {
      const d = g[0].date;
      return `El ${weekday(d)} ${day(d)} de ${month(d)} (${names}) estamos cerrados.`;
    }
    const sameMonth = g.every((h) => month(h.date) === month(g[0].date));
    const parts = g.map((h) =>
      sameMonth
        ? `el ${weekday(h.date)} ${day(h.date)}`
        : `el ${weekday(h.date)} ${day(h.date)} de ${month(h.date)}`,
    );
    const list = `${parts.slice(0, -1).join(", ")} y ${parts.at(-1)}`;
    return `Estamos cerrados ${list}${sameMonth ? ` de ${month(g[0].date)}` : ""} (${names}).`;
  });
}

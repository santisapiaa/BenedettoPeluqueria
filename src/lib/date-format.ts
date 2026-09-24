/**
 * Formato de fechas para mostrar al usuario. Siempre en UTC: las fechas del
 * negocio son strings "YYYY-MM-DD" sin hora, y hay que formatearlas sin que
 * el huso horario del navegador corra el día.
 */

const noon = (date: string) => new Date(`${date}T12:00:00Z`);

export function formatUTC(date: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("es-AR", { ...opts, timeZone: "UTC" }).format(noon(date));
}

/** "martes", "mar." según `style`. */
export function weekdayName(date: string, style: "long" | "short" = "long") {
  return formatUTC(date, { weekday: style });
}

/** "septiembre", "sep." según `style`. */
export function monthName(date: string, style: "long" | "short" = "long") {
  return formatUTC(date, { month: style });
}

/** Día del mes (1–31). */
export function dayNumber(date: string) {
  return noon(date).getUTCDate();
}

/** "martes 22 de septiembre". */
export function longDate(date: string) {
  return formatUTC(date, { weekday: "long", day: "numeric", month: "long" });
}

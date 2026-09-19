/** Utilidades de fecha/hora. Todo se maneja en hora de Buenos Aires. */

export const TZ = "America/Argentina/Buenos_Aires";
/** Argentina no usa horario de verano, así que el offset es fijo. */
export const TZ_OFFSET = "-03:00";

/** Anticipación mínima para reservar (evita turnos "para ya"). */
export const MIN_NOTICE_MINUTES = 60;
/** Cuántos días hacia adelante se puede reservar. */
export const MAX_DAYS_AHEAD = 21;

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(minutes: number) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/** Día de la semana de una fecha YYYY-MM-DD (0 = domingo … 6 = sábado). */
export function dayOfWeek(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}

/** Fecha y minutos-desde-medianoche actuales en Buenos Aires. */
export function nowInBA(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

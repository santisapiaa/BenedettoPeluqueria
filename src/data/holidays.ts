export type Holiday = {
  /** YYYY-MM-DD */
  date: string;
  /** Nombre corto, para mostrar en los avisos. */
  name: string;
};

/**
 * Feriados nacionales de Argentina (incluye puentes turísticos, que se tratan
 * como feriados). Por defecto Benedetto está CERRADO en todos ellos: el sitio
 * no ofrece turnos esos días y avisa la semana anterior.
 *
 * MANTENIMIENTO: revisar una vez por año (y cuando el Gobierno publique un
 * decreto con puentes o traslados). Fuente: https://api.argentinadatos.com/v1/feriados/AÑO
 * - 2026: listado completo.
 * - 2027: PROVISORIO (aún sin puentes ni traslados por decreto).
 */
export const holidays: Holiday[] = [
  // 2026
  { date: "2026-01-01", name: "Año Nuevo" },
  { date: "2026-02-16", name: "Carnaval" },
  { date: "2026-02-17", name: "Carnaval" },
  { date: "2026-03-23", name: "Puente turístico" },
  { date: "2026-03-24", name: "Día de la Memoria" },
  { date: "2026-04-02", name: "Día de Malvinas" },
  { date: "2026-04-03", name: "Viernes Santo" },
  { date: "2026-05-01", name: "Día del Trabajador" },
  { date: "2026-05-25", name: "Revolución de Mayo" },
  { date: "2026-06-15", name: "Día de Güemes" },
  { date: "2026-06-20", name: "Día de la Bandera" },
  { date: "2026-07-09", name: "Día de la Independencia" },
  { date: "2026-07-10", name: "Puente turístico" },
  { date: "2026-08-17", name: "Día de San Martín" },
  { date: "2026-10-12", name: "Día de la Diversidad Cultural" },
  { date: "2026-11-23", name: "Día de la Soberanía Nacional" },
  { date: "2026-12-07", name: "Puente turístico" },
  { date: "2026-12-08", name: "Inmaculada Concepción" },
  { date: "2026-12-25", name: "Navidad" },
  // 2027 (provisorio)
  { date: "2027-01-01", name: "Año Nuevo" },
  { date: "2027-02-08", name: "Carnaval" },
  { date: "2027-02-09", name: "Carnaval" },
  { date: "2027-03-24", name: "Día de la Memoria" },
  { date: "2027-03-26", name: "Viernes Santo" },
  { date: "2027-04-02", name: "Día de Malvinas" },
  { date: "2027-05-01", name: "Día del Trabajador" },
  { date: "2027-05-25", name: "Revolución de Mayo" },
  { date: "2027-06-17", name: "Día de Güemes" },
  { date: "2027-06-20", name: "Día de la Bandera" },
  { date: "2027-07-09", name: "Día de la Independencia" },
  { date: "2027-08-17", name: "Día de San Martín" },
  { date: "2027-10-12", name: "Día de la Diversidad Cultural" },
  { date: "2027-11-20", name: "Día de la Soberanía Nacional" },
  { date: "2027-12-08", name: "Inmaculada Concepción" },
  { date: "2027-12-25", name: "Navidad" },
];

/**
 * Feriados en los que SÍ se abre (excepciones). Cargar la fecha YYYY-MM-DD.
 * Ejemplo: ["2026-05-01"]
 */
export const openOnHolidays: string[] = [];

const byDate = new Map(holidays.map((h) => [h.date, h]));

/** Devuelve el feriado de esa fecha si Benedetto está cerrado ese día; si no, undefined. */
export function getHoliday(date: string): Holiday | undefined {
  if (openOnHolidays.includes(date)) return undefined;
  return byDate.get(date);
}

/**
 * Días con horario distinto al habitual (reemplaza el horario de ese día).
 * Clave = fecha YYYY-MM-DD. Cada tramo es [desde, hasta) en formato HH:mm.
 * Un array vacío = cerrado todo el día.
 *
 * Ejemplo:
 *   "2026-09-25": [["10:00", "16:00"]],  // corrido hasta las 16, sin tarde
 */
export const specialHours: Record<string, Array<[string, string]>> = {
  "2026-09-25": [["10:00", "16:00"]],
};

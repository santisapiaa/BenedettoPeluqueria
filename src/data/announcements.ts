export type Announcement = {
  /** Texto que ve el cliente. */
  message: string;
  /** Primer día en que se muestra (YYYY-MM-DD). Si falta, se muestra desde ya. */
  from?: string;
  /** Último día en que se muestra, inclusive (YYYY-MM-DD). Si falta, no vence. */
  until?: string;
};

/**
 * Avisos que aparecen en el inicio y sobre los turnos (feriados, vacaciones,
 * cambios de horario…). Se ocultan solos pasada la fecha `until`, sin tener
 * que volver a publicar.
 *
 * Ejemplo:
 *   { message: "El lunes 12 de octubre (feriado) estamos cerrados.", from: "2026-10-05", until: "2026-10-12" },
 */
export const announcements: Announcement[] = [];

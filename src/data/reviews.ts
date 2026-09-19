export type Review = {
  /** Nombre (o nombre y inicial) tal como figura en Google. */
  author: string;
  /** 1 a 5 */
  rating: number;
  /** Texto de la reseña, copiado tal cual de Google. */
  text: string;
  /** Opcional: "hace 2 meses", "Marzo 2026", etc. */
  date?: string;
};

/**
 * Reseñas destacadas. Van SOLO reseñas reales de Google, copiadas tal cual.
 * Mientras la lista esté vacía, la sección muestra únicamente el botón para
 * ver y dejar reseñas.
 */
export const reviews: Review[] = [];

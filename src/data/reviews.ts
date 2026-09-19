export type Review = {
  /** Nombre (o nombre y inicial) tal como figura en Google. */
  author: string;
  /** 1 a 5 */
  rating: number;
  /** Texto de la reseña, copiado tal cual de Google. */
  text: string;
  /** Opcional. Mejor no usar fechas relativas ("hace 3 meses"): se desactualizan. */
  date?: string;
};

/** Reseñas destacadas: SOLO reseñas reales de Google, copiadas tal cual. */
export const reviews: Review[] = [
  {
    author: "Matt",
    rating: 5,
    text: "Unos genios. El dueño Martin un genio cortando y mucho carisma!!",
  },
  {
    author: "Matias Ortiz",
    rating: 5,
    text: "Excelente servicio y atención, el chico de la caja es un genio y Martin y Fede 10 puntos como siempre.",
  },
  {
    author: "Mariano A",
    rating: 5,
    text: "Es genial! Te escucha que buscas. El lugar es hermoso y cumple todos los protocolos. Es muy recomendable. Esterilizo todo delante de mi! Eso hoy cuenta hoy en día.",
  },
];

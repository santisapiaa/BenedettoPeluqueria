export type Barber = {
  id: string;
  name: string;
  /** Texto corto para el paso "Elegí tu peluquero". */
  bio: string;
  /**
   * Días en que empieza más tarde que la apertura del local.
   * days: 0 = domingo … 6 = sábado.
   */
  lateStart?: { days: number[]; from: string };
};

export const barbers: Barber[] = [
  {
    id: "martin",
    name: "Martín Madonia",
    bio: "Cortes clásicos y trabajo a navaja.",
    // De martes a viernes entra a las 11:00 (el local abre a las 10:00).
    lateStart: { days: [2, 3, 4, 5], from: "11:00" },
  },
  {
    id: "federico",
    name: "Federico Madonia",
    bio: "Cortes a medida y atención personalizada.",
  },
];

/**
 * Alexander es colorista: maneja su propio calendario y sus propios precios,
 * por eso NO forma parte del flujo de reservas. Se muestra como "consultar".
 */
export const colorist = {
  name: "Alexander",
  role: "Colorista",
  days: "Martes y Sábados",
  description:
    "Color, mechas y cambios de look. Trabaja con su propia agenda y precios: consultale directamente.",
  whatsappMessage:
    "¡Hola! Quisiera consultar precios y turnos de color con Alexander.",
};

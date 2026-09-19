export type Service = {
  id: string;
  name: string;
  description: string;
  /** Precio en ARS. */
  price: number;
  /** Duración en minutos: define cuántos slots de 30' ocupa el turno. */
  duration: number;
};

export const services: Service[] = [
  {
    id: "corte",
    name: "Corte",
    description:
      "Corte a medida, clásico o moderno, con terminación prolija en el contorno.",
    price: 25000,
    duration: 30,
  },
  {
    id: "corte-barba",
    name: "Corte y Barba",
    description:
      "El combo completo: corte a elección y perfilado de barba con navaja.",
    price: 30000,
    duration: 30,
  },
  {
    id: "corte-mujer",
    name: "Corte Mujer",
    description:
      "Corte y armado pensados para tu estilo, con asesoramiento personalizado.",
    price: 30000,
    duration: 30,
  },
  {
    id: "barba",
    name: "Barba",
    description: "Diseño y perfilado de barba, con toalla caliente y navaja.",
    price: 10000,
    duration: 30,
  },
];

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

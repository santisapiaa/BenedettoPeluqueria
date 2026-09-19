const FOUNDED_YEAR = 2019;

/**
 * URL pública del sitio. Se usa `||` (no `??`) porque en Vercel una variable
 * vacía llega como "" y `new URL("")` rompe el build.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.startsWith("http") ? explicit : `https://${explicit}`;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Benedetto",
  tagline: "Peluquería & Barbería",
  description:
    "Peluquería y barbería en Villa del Parque desde 2019. Cortes, barba y atención personalizada. Reservá tu turno online en Benedetto.",
  url: resolveSiteUrl(),
  foundedYear: FOUNDED_YEAR,

  address: {
    street: "Cuenca 3527",
    city: "Villa del Parque, CABA",
    country: "AR",
  },
  phone: "11 2524-8201",
  // Formato internacional sin "+": 54 (AR) + 9 (móvil) + 11 (área) + número
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "5491125248201",
  whatsappMessage: "¡Hola Benedetto! Quisiera consultar por un turno.",

  instagram: {
    handle: "benedettopeluqueriaybarberia",
    url: "https://instagram.com/benedettopeluqueriaybarberia",
  },

  // Banda de la casa
  pelusones: {
    url: "https://www.pelusones.com",
    handle: "pelusones.ok",
    instagram: "https://www.instagram.com/pelusones.ok",
  },

  /** Reseñas de Google (link acortado): ver las opiniones. */
  reviewsUrl: "https://bit.ly/4xynH58",
  /**
   * Place ID de Google. Con él, el botón "Dejar mi reseña" abre directamente
   * el cuadro para escribir la opinión.
   */
  googlePlaceId: "ChIJbxSQs8K3vJURot01Veu3zwc",

  /** Horarios para mostrar en la sección de contacto. */
  hours: [
    { days: "Martes a Viernes", time: "10:00 – 13:00 y 16:00 – 20:00" },
    { days: "Sábados", time: "10:00 – 20:00" },
    { days: "Domingos y Lunes", time: "Cerrado" },
  ],

  stats: [
    { value: String(FOUNDED_YEAR), label: "Abiertos desde" },
    {
      value: `${new Date().getFullYear() - FOUNDED_YEAR}+`,
      label: "Años de oficio",
    },
  ],
} as const;

/**
 * Horario de atención estructurado (lo usará el motor de disponibilidad).
 * Clave = día de la semana (0 = domingo … 6 = sábado). Sin clave = cerrado.
 * Cada tramo es [desde, hasta) en formato HH:mm.
 */
export const openingHours: Record<number, Array<[string, string]>> = {
  2: [["10:00", "13:00"], ["16:00", "20:00"]],
  3: [["10:00", "13:00"], ["16:00", "20:00"]],
  4: [["10:00", "13:00"], ["16:00", "20:00"]],
  5: [["10:00", "13:00"], ["16:00", "20:00"]],
  6: [["10:00", "20:00"]],
};

/** Los turnos se otorgan cada 30 minutos. */
export const SLOT_MINUTES = 30;

export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#historia", label: "Historia" },
  { href: "#servicios", label: "Servicios" },
  { href: "#galeria", label: "Galería" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#ubicacion", label: "Ubicación" },
] as const;

/** Link que abre directo el cuadro "Escribir una reseña" en Google (o null si falta el Place ID). */
export function writeReviewUrl() {
  const id = siteConfig.googlePlaceId;
  return id ? `https://search.google.com/local/writereview?placeid=${id}` : null;
}

export function whatsappUrl(message: string = siteConfig.whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Abre Google Maps con la ruta hasta el local (usa el Place ID para ser exacto). */
export function directionsUrl() {
  const q = `${siteConfig.address.street}, ${siteConfig.address.city}, Argentina`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}&destination_place_id=${siteConfig.googlePlaceId}`;
}

/** Link para llamar desde el celular. */
export function phoneHref() {
  return `tel:+${siteConfig.whatsapp}`;
}

export function mapsEmbedUrl() {
  const q = `${siteConfig.address.street}, ${siteConfig.address.city}, Argentina`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

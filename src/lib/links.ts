/**
 * Constructores de links externos (WhatsApp, Maps, reseñas de Google, etc.).
 * Separado de site.ts para no mezclar los datos del negocio con la lógica
 * de armado de URLs.
 */
import { siteConfig } from "@/lib/site";

export function whatsappUrl(message: string = siteConfig.whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Link para llamar desde el celular. */
export function phoneHref() {
  return `tel:+${siteConfig.whatsapp}`;
}

export function mapsEmbedUrl() {
  const q = `${siteConfig.address.street}, ${siteConfig.address.city}, Argentina`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

/** Abre Google Maps con la ruta hasta el local (usa el Place ID para ser exacto). */
export function directionsUrl() {
  const q = `${siteConfig.address.street}, ${siteConfig.address.city}, Argentina`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}&destination_place_id=${siteConfig.googlePlaceId}`;
}

/** Link que abre directo el cuadro "Escribir una reseña" en Google (o null si falta el Place ID). */
export function writeReviewUrl() {
  const id = siteConfig.googlePlaceId;
  return id ? `https://search.google.com/local/writereview?placeid=${id}` : null;
}

import { google, type calendar_v3 } from "googleapis";

import { barbers, type Barber } from "@/data/barbers";
import { eventsToBusy, type Busy } from "@/lib/availability";
import { TZ_OFFSET, addDays } from "@/lib/time";

/**
 * live = Google Calendar configurado (producción real)
 * demo = sin Google Calendar, pero se permite probar la interfaz con horarios de ejemplo
 * off  = sin configurar: los horarios online quedan deshabilitados (se ofrece WhatsApp)
 */
export type BookingMode = "live" | "demo" | "off";

function credentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  // Acepta la clave con saltos de línea reales o con "\n" literales, con o sin comillas.
  const key = process.env.GOOGLE_PRIVATE_KEY?.trim()
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
  return { email, key };
}

/**
 * Cada peluquero puede tener su propio calendario:
 *   GOOGLE_CALENDAR_ID_MARTIN, GOOGLE_CALENDAR_ID_FEDERICO
 * o compartir uno solo (GOOGLE_CALENDAR_ID), distinguidos por color.
 * El calendario propio tiene prioridad sobre el compartido.
 */
function ownCalendarId(b: Barber) {
  return process.env[`GOOGLE_CALENDAR_ID_${b.id.toUpperCase()}`]?.trim() || undefined;
}

function calendarIdFor(b: Barber) {
  return ownCalendarId(b) ?? process.env.GOOGLE_CALENDAR_ID?.trim() ?? undefined;
}

export function isCalendarConfigured() {
  const { email, key } = credentials();
  return Boolean(email && key && barbers.every((b) => calendarIdFor(b)));
}

export function bookingMode(): BookingMode {
  if (isCalendarConfigured()) return "live";
  if (
    process.env.BOOKING_DEMO === "true" ||
    process.env.NODE_ENV === "development"
  ) {
    return "demo";
  }
  return "off";
}

let cached: calendar_v3.Calendar | null = null;

function getCalendar() {
  if (cached) return cached;
  const { email, key } = credentials();
  const auth = new google.auth.JWT({
    email,
    key,
    // Solo lectura: la web nunca crea ni modifica turnos.
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  cached = google.calendar({ version: "v3", auth });
  return cached;
}

/** Calendarios distintos a consultar, con quién es el dueño (null = compartido). */
function calendarSources() {
  const sources = new Map<
    string,
    { calendarId: string; owner: string | null; barberNames: string[] }
  >();
  for (const b of barbers) {
    const calendarId = calendarIdFor(b)!;
    const owner = ownCalendarId(b) ? b.id : null;
    const key = `${calendarId}|${owner}`;
    const entry = sources.get(key) ?? { calendarId, owner, barberNames: [] };
    entry.barberNames.push(b.name);
    sources.set(key, entry);
  }
  return [...sources.values()];
}

/** Chequeo para /api/booking-status: prueba cada calendario por separado. */
export async function checkCalendars() {
  return Promise.all(
    calendarSources().map(async (s) => {
      const label = s.barberNames.join(" y ");
      try {
        await getCalendar().events.list({
          calendarId: s.calendarId,
          maxResults: 1,
        });
        return { label, ok: true as const };
      } catch (err) {
        console.error(`[booking-status] ${label}`, err);
        return { label, ok: false as const, message: describeGoogleError(err) };
      }
    }),
  );
}

/** Trae los eventos del día de todos los calendarios y los convierte en intervalos ocupados. */
export async function fetchBusy(date: string): Promise<Busy[]> {
  const lists = await Promise.all(
    calendarSources().map(async (s) => {
      const res = await getCalendar().events.list({
        calendarId: s.calendarId,
        timeMin: `${date}T00:00:00${TZ_OFFSET}`,
        timeMax: `${addDays(date, 1)}T00:00:00${TZ_OFFSET}`,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
      });
      return eventsToBusy(res.data.items ?? [], date, s.owner);
    }),
  );
  return lists.flat();
}

/** Traduce errores de Google a un mensaje entendible para el diagnóstico. */
export function describeGoogleError(err: unknown): string {
  const e = err as {
    code?: number | string;
    message?: string;
    response?: { status?: number };
  };
  const status = Number(e?.response?.status ?? e?.code);
  const msg = e?.message ?? "";

  if (/DECODER|PEM|private key|unsupported/i.test(msg)) {
    return "La clave privada (GOOGLE_PRIVATE_KEY) está mal pegada o incompleta.";
  }
  if (/invalid_grant|invalid_client|unauthorized/i.test(msg) || status === 401) {
    return "Credenciales inválidas: revisá GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY.";
  }
  if (status === 404) {
    return "No se encontró el calendario: revisá el ID y que esté compartido con la cuenta de servicio.";
  }
  if (status === 403) {
    return "Sin permiso: activá Google Calendar API y compartí el calendario con la cuenta de servicio con permiso «Ver todos los detalles de los eventos».";
  }
  return "Error inesperado al conectar con Google Calendar.";
}

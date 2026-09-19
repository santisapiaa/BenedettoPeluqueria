import { google, type calendar_v3 } from "googleapis";

import { barbers, type Barber } from "@/data/barbers";
import type { Service } from "@/data/services";
import type { Busy } from "@/lib/availability";
import { formatPrice } from "@/lib/utils";
import { TZ, TZ_OFFSET, addDays, toHHMM, toMinutes } from "@/lib/time";

/**
 * live = Google Calendar configurado (producción real)
 * demo = sin Google Calendar, pero se permite probar la interfaz (no guarda nada)
 * off  = sin configurar: las reservas online quedan deshabilitadas
 */
export type BookingMode = "live" | "demo" | "off";

function env() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  // Acepta la clave con saltos de línea reales o con "\n" literales, con o sin comillas.
  const key = process.env.GOOGLE_PRIVATE_KEY?.trim()
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  return { email, key, calendarId };
}

export function isCalendarConfigured() {
  const { email, key, calendarId } = env();
  return Boolean(email && key && calendarId);
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
  const { email, key } = env();
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  cached = google.calendar({ version: "v3", auth });
  return cached;
}

function calendarId() {
  return env().calendarId!;
}

/** Chequeo liviano para /api/booking-status. */
export async function pingCalendar() {
  await getCalendar().events.list({ calendarId: calendarId(), maxResults: 1 });
}

/**
 * Trae los eventos del día y los convierte en intervalos ocupados.
 * El dueño de cada turno se deduce de (en este orden):
 *   1. la marca barberId que guardamos en los turnos creados desde la web,
 *   2. el color del evento (colorId) configurado en data/barbers.ts,
 *   3. si no se puede deducir, se asume que ocupa a todos (lado seguro).
 */
export async function fetchBusy(date: string): Promise<Busy[]> {
  const res = await getCalendar().events.list({
    calendarId: calendarId(),
    timeMin: `${date}T00:00:00${TZ_OFFSET}`,
    timeMax: `${addDays(date, 1)}T00:00:00${TZ_OFFSET}`,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
  });

  const dayStart = Date.parse(`${date}T00:00:00${TZ_OFFSET}`);
  const byColor = new Map(
    barbers.filter((b) => b.colorId).map((b) => [b.colorId!, b.id]),
  );
  const busy: Busy[] = [];

  for (const e of res.data.items ?? []) {
    if (e.status === "cancelled") continue;
    // Eventos marcados como "Disponible" no bloquean el horario.
    if (e.transparency === "transparent") continue;

    const barberId =
      e.extendedProperties?.private?.barberId ??
      (e.colorId ? byColor.get(e.colorId) : undefined) ??
      null;

    if (e.start?.date) {
      // Evento de día completo (feriado, vacaciones…): ocupa todo el día.
      busy.push({ start: 0, end: 24 * 60, barberId });
      continue;
    }
    if (!e.start?.dateTime || !e.end?.dateTime) continue;

    busy.push({
      start: (Date.parse(e.start.dateTime) - dayStart) / 60000,
      end: (Date.parse(e.end.dateTime) - dayStart) / 60000,
      barberId,
    });
  }

  return busy;
}

type CreateArgs = {
  date: string;
  time: string;
  service: Service;
  barber: Barber;
  customer: { name: string; email: string; phone: string };
};

export async function createBookingEvent({
  date,
  time,
  service,
  barber,
  customer,
}: CreateArgs) {
  const startMin = toMinutes(time);
  const end = toHHMM(startMin + service.duration);

  // Nota: las cuentas de servicio no pueden invitar asistentes sin delegación
  // de dominio, por eso los datos del cliente van en la descripción.
  const event: calendar_v3.Schema$Event = {
    summary: `${service.name} · ${customer.name}`,
    description: [
      `Servicio: ${service.name} (${formatPrice(service.price)})`,
      `Peluquero: ${barber.name}`,
      `Cliente: ${customer.name}`,
      `Teléfono: ${customer.phone}`,
      `Email: ${customer.email}`,
      "",
      "Reservado desde la web.",
    ].join("\n"),
    start: { dateTime: `${date}T${time}:00${TZ_OFFSET}`, timeZone: TZ },
    end: { dateTime: `${date}T${end}:00${TZ_OFFSET}`, timeZone: TZ },
    ...(barber.colorId ? { colorId: barber.colorId } : {}),
    extendedProperties: {
      private: { barberId: barber.id, serviceId: service.id, source: "web" },
    },
  };

  await getCalendar().events.insert({
    calendarId: calendarId(),
    requestBody: event,
  });
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
    return "No se encontró el calendario: revisá GOOGLE_CALENDAR_ID y que esté compartido con la cuenta de servicio.";
  }
  if (status === 403) {
    return "Sin permiso: activá Google Calendar API y compartí el calendario con la cuenta de servicio con permiso «Realizar cambios en los eventos».";
  }
  return "Error inesperado al conectar con Google Calendar.";
}

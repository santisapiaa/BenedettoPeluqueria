import { NextResponse } from "next/server";

import { bookingMode, checkCalendars } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

/**
 * GET /api/booking-status
 * Diagnóstico para verificar la conexión con Google Calendar tras configurar
 * las variables de entorno. No expone secretos.
 */
export async function GET() {
  const mode = bookingMode();

  if (mode !== "live") {
    return NextResponse.json({
      ok: false,
      mode,
      message:
        "Faltan variables de entorno: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY y el ID de calendario de cada peluquero (GOOGLE_CALENDAR_ID_MARTIN y GOOGLE_CALENDAR_ID_FEDERICO, o un GOOGLE_CALENDAR_ID compartido).",
    });
  }

  const calendars = await checkCalendars();
  const ok = calendars.every((c) => c.ok);
  return NextResponse.json({
    ok,
    mode,
    message: ok
      ? "Conexión con Google Calendar correcta."
      : "Hay calendarios con problemas: mirá el detalle.",
    calendars,
  });
}

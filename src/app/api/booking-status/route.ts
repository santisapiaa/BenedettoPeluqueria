import { NextResponse } from "next/server";

import {
  bookingMode,
  describeGoogleError,
  pingCalendar,
} from "@/lib/google-calendar";

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
        "Faltan variables de entorno de Google Calendar (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID).",
    });
  }

  try {
    await pingCalendar();
    return NextResponse.json({ ok: true, mode, message: "Conexión con Google Calendar correcta." });
  } catch (err) {
    console.error("[booking-status]", err);
    return NextResponse.json({ ok: false, mode, message: describeGoogleError(err) });
  }
}

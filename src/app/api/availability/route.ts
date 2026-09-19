import { NextResponse, type NextRequest } from "next/server";

import { barbers } from "@/data/barbers";
import { getService } from "@/data/services";
import { computeSlots, validateBookableDate } from "@/lib/availability";
import { bookingMode, fetchBusy } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

const noStore = { headers: { "Cache-Control": "no-store" } };

/** GET /api/availability?date=YYYY-MM-DD&service=<id>&barber=<id|any> */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const date = sp.get("date") ?? "";
  const service = getService(sp.get("service") ?? "");
  const barberId = sp.get("barber") ?? "any";

  if (!service) {
    return NextResponse.json({ error: "invalid_service" }, { status: 400, ...noStore });
  }
  if (barberId !== "any" && !barbers.some((b) => b.id === barberId)) {
    return NextResponse.json({ error: "invalid_barber" }, { status: 400, ...noStore });
  }
  const dateError = validateBookableDate(date);
  if (dateError) {
    return NextResponse.json(
      { error: "invalid_date", message: dateError },
      { status: 400, ...noStore },
    );
  }

  const mode = bookingMode();
  if (mode === "off") {
    return NextResponse.json({ error: "not_configured" }, { status: 503, ...noStore });
  }

  try {
    const busy = mode === "live" ? await fetchBusy(date) : [];
    const slots = computeSlots({ date, duration: service.duration, barberId, busy });
    return NextResponse.json(
      { slots: slots.map((s) => ({ time: s.time })), demo: mode === "demo" },
      noStore,
    );
  } catch (err) {
    console.error("[availability] error consultando Google Calendar", err);
    return NextResponse.json(
      { error: "calendar_unavailable" },
      { status: 502, ...noStore },
    );
  }
}

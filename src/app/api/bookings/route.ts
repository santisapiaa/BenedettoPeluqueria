import { NextResponse, type NextRequest } from "next/server";

import { barbers } from "@/data/barbers";
import { getService } from "@/data/services";
import { computeSlots, validateBookableDate } from "@/lib/availability";
import { bookingSchema } from "@/lib/booking-schema";
import {
  bookingMode,
  createBookingEvent,
  fetchBusy,
} from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

const noStore = { headers: { "Cache-Control": "no-store" } };

function fail(error: string, message: string, status: number, extra = {}) {
  return NextResponse.json({ error, message, ...extra }, { status, ...noStore });
}

/** POST /api/bookings: valida, vuelve a chequear disponibilidad y crea el evento. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return fail("invalid", "Revisá los datos ingresados.", 422, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }
  const data = parsed.data;

  // Honeypot: un bot completó el campo oculto. Simulamos éxito sin hacer nada.
  if (data.website) return NextResponse.json({ ok: true }, noStore);

  const service = getService(data.serviceId);
  if (!service) return fail("invalid_service", "Servicio inexistente.", 400);
  if (data.barberId !== "any" && !barbers.some((b) => b.id === data.barberId)) {
    return fail("invalid_barber", "Peluquero inexistente.", 400);
  }
  const dateError = validateBookableDate(data.date);
  if (dateError) return fail("invalid_date", dateError, 400);

  const mode = bookingMode();
  if (mode === "off") {
    return fail(
      "not_configured",
      "Las reservas online no están disponibles por el momento. Escribinos por WhatsApp.",
      503,
    );
  }

  try {
    // Revalidamos contra el calendario justo antes de guardar: el horario pudo
    // ocuparse mientras el cliente completaba el formulario.
    const busy = mode === "live" ? await fetchBusy(data.date) : [];
    const slot = computeSlots({
      date: data.date,
      duration: service.duration,
      barberId: data.barberId,
      busy,
    }).find((s) => s.time === data.time);

    if (!slot) {
      return fail(
        "slot_taken",
        "Ese horario acaba de ocuparse. Elegí otro, por favor.",
        409,
      );
    }

    const barber = barbers.find((b) => slot.barberIds.includes(b.id))!;

    if (mode === "live") {
      await createBookingEvent({
        date: data.date,
        time: data.time,
        service,
        barber,
        customer: { name: data.name, email: data.email, phone: data.phone },
      });
    }

    return NextResponse.json(
      {
        ok: true,
        demo: mode === "demo",
        booking: {
          serviceName: service.name,
          price: service.price,
          duration: service.duration,
          barberName: barber.name,
          date: data.date,
          time: data.time,
        },
      },
      noStore,
    );
  } catch (err) {
    console.error("[bookings] error creando el turno", err);
    return fail(
      "calendar_unavailable",
      "No pudimos registrar el turno. Probá de nuevo o escribinos por WhatsApp.",
      502,
    );
  }
}

import type { Barber } from "@/data/barbers";
import type { Service } from "@/data/services";
import { longDate } from "@/lib/date-format";

type Params = {
  service?: Service;
  date: string | null;
  time: string | null;
  barber?: Barber;
  name: string;
};

/** Mensaje prellenado para pedir el turno por WhatsApp (vacío si falta algún dato). */
export function buildBookingMessage({ service, date, time, barber, name }: Params): string {
  if (!service || !date || !time) return "";
  const barberFirstName = barber ? ` con ${barber.name.split(" ")[0]}` : "";
  return `Hola! Mi nombre es ${name.trim()}, quería un turno el día ${longDate(date)} a las ${time}${barberFirstName}`;
}

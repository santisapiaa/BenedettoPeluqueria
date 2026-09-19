import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Gallery } from "@/components/sections/Gallery";
import { Booking } from "@/components/sections/Booking";
import { Location } from "@/components/sections/Location";
import { BookingProvider } from "@/components/booking/BookingProvider";

export default function HomePage() {
  return (
    // El provider conecta "Reservar" en las tarjetas de servicios con el flujo de turnos.
    <BookingProvider>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Booking />
      <Location />
    </BookingProvider>
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type BookingContextValue = {
  /** Servicio elegido desde las tarjetas de "Servicios" (o null). */
  serviceId: string | null;
  /** Cambia con cada selección: permite reaccionar aunque se elija el mismo servicio. */
  nonce: number;
  selectService: (id: string) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ serviceId: string | null; nonce: number }>({
    serviceId: null,
    nonce: 0,
  });

  const selectService = useCallback(
    (id: string) => setState((s) => ({ serviceId: id, nonce: s.nonce + 1 })),
    [],
  );

  const value = useMemo(
    () => ({ ...state, selectService }),
    [state, selectService],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking debe usarse dentro de <BookingProvider>");
  return ctx;
}

import { useEffect, useState } from "react";

export type SlotsState = {
  status: "idle" | "loading" | "ready" | "error";
  times: string[];
  error?: "not_configured" | "generic";
  demo?: boolean;
};

/** Horarios libres de un día, consultados en tiempo real a /api/availability. */
export function useAvailability(
  date: string | null,
  serviceId: string | null,
  barberId: string,
) {
  const [slots, setSlots] = useState<SlotsState>({ status: "idle", times: [] });

  useEffect(() => {
    if (!date || !serviceId) return;
    const ctrl = new AbortController();
    setSlots({ status: "loading", times: [] });

    const qs = new URLSearchParams({ date, service: serviceId, barber: barberId });
    fetch(`/api/availability?${qs}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error ?? "generic");
        return json as { slots: { time: string }[]; demo?: boolean };
      })
      .then((json) =>
        setSlots({
          status: "ready",
          times: json.slots.map((s) => s.time),
          demo: json.demo,
        }),
      )
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setSlots({
          status: "error",
          times: [],
          error: e.message === "not_configured" ? "not_configured" : "generic",
        });
      });

    return () => ctrl.abort();
  }, [date, serviceId, barberId]);

  return slots;
}

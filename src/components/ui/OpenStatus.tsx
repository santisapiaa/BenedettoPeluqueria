"use client";

import { useEffect, useState } from "react";

import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";
import { cn } from "@/lib/utils";

/** "Abierto ahora · cierra a las 20:00" / "Cerrado · abrimos mañana a las 10:00" */
export function OpenStatus({ className }: { className?: string }) {
  // Se calcula en el cliente: la página es estática y la hora cambia.
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return <div className={cn("h-6", className)} aria-hidden="true" />;

  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]",
        status.open ? "text-emerald-300" : "text-bone-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full",
          status.open ? "bg-emerald-400" : "bg-bone-muted/60",
        )}
      />
      {status.open
        ? `Abierto ahora · cierra a las ${status.closesAt}`
        : status.next
          ? `Cerrado · abrimos ${status.next.when} a las ${status.next.time}`
          : "Cerrado"}
    </p>
  );
}

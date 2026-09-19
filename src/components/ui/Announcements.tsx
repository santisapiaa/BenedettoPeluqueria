"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { announcements, type Announcement } from "@/data/announcements";
import { nowInBA } from "@/lib/time";
import { cn } from "@/lib/utils";

/** Avisos vigentes según la fecha de hoy (Buenos Aires). No muestra nada si no hay. */
export function Announcements({ className }: { className?: string }) {
  const [active, setActive] = useState<Announcement[]>([]);

  useEffect(() => {
    const today = nowInBA().date;
    setActive(
      announcements.filter(
        (a) => (!a.from || a.from <= today) && (!a.until || today <= a.until),
      ),
    );
  }, []);

  if (active.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)} role="status">
      {active.map((a) => (
        <p
          key={a.message}
          className="flex items-start gap-3 rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-bone"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {a.message}
        </p>
      ))}
    </div>
  );
}

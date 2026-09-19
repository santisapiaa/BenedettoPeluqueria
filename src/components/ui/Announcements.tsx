"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { announcements } from "@/data/announcements";
import { holidayNotices } from "@/lib/holiday-notices";
import { nowInBA } from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * Avisos vigentes según la fecha de hoy (Buenos Aires): los que se cargan a mano
 * en data/announcements.ts y los de feriados, que salen solos.
 * No muestra nada si no hay.
 */
export function Announcements({ className }: { className?: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const today = nowInBA().date;
    const manual = announcements
      .filter((a) => (!a.from || a.from <= today) && (!a.until || today <= a.until))
      .map((a) => a.message);
    setMessages([...new Set([...holidayNotices(today), ...manual])]);
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)} role="status">
      {messages.map((message) => (
        <p
          key={message}
          className="flex items-start gap-3 rounded-sm border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-bone"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {message}
        </p>
      ))}
    </div>
  );
}

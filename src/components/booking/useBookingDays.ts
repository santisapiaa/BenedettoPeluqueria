import { useEffect, useState } from "react";

import { getHoliday } from "@/data/holidays";
import { isOpenDay } from "@/lib/site";
import { MAX_DAYS_AHEAD, addDays, nowInBA } from "@/lib/time";

/**
 * Próximos días reservables (dentro del horario de atención) y, aparte, los
 * que quedan afuera por ser feriado. Se calcula en el cliente: la página es
 * estática y las fechas cambian según el momento en que se abre.
 */
export function useBookingDays() {
  const [days, setDays] = useState<string[]>([]);
  const [closedHolidays, setClosedHolidays] = useState<string[]>([]);

  useEffect(() => {
    const today = nowInBA().date;
    const list: string[] = [];
    const closed: string[] = [];
    for (let i = 0; i <= MAX_DAYS_AHEAD; i++) {
      const d = addDays(today, i);
      if (!isOpenDay(d)) continue;
      // Los feriados no se ofrecen: se avisan debajo de los días.
      (getHoliday(d) ? closed : list).push(d);
    }
    setDays(list);
    setClosedHolidays(closed);
  }, []);

  return { days, closedHolidays };
}

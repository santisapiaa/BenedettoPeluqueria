"use client";

import { motion } from "framer-motion";

import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Announcements } from "@/components/ui/Announcements";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container-x relative z-10 pb-14 pt-36"
    >
      <motion.div variants={item} className="mb-6 max-w-xl space-y-4">
        <OpenStatus />
        <Announcements />
      </motion.div>

      <motion.p
        variants={item}
        className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-gold"
      >
        {siteConfig.tagline} · Villa del Parque · Desde {siteConfig.foundedYear}
      </motion.p>

      <motion.h1
        variants={item}
        className="max-w-4xl font-script text-[3.5rem] leading-[1.05] sm:text-8xl lg:text-9xl"
      >
        Dos generaciones.
        <br />
        Un mismo oficio.
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-7 max-w-xl text-base leading-relaxed text-bone-muted sm:text-lg"
      >
        Cortes y barba con atención personalizada, en el corazón de Villa del
        Parque. Reservá tu turno online en menos de un minuto.
      </motion.p>

      <motion.div
        variants={item}
        className="mt-10 flex flex-col gap-4 sm:flex-row"
      >
        <Button href="#turnos">Reservar turno</Button>
        <Button href="#galeria" variant="outline">
          Ver galería
        </Button>
      </motion.div>

      <motion.dl
        variants={item}
        className="mt-16 grid gap-6 border-t border-white/10 pt-8 text-sm sm:grid-cols-3"
      >
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-gold">
            Dirección
          </dt>
          <dd className="mt-2 text-bone/90">
            {siteConfig.address.street}, {siteConfig.address.city}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-gold">
            Martes a viernes
          </dt>
          <dd className="mt-2 text-bone/90">10 a 13 h · 16 a 20 h</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-gold">
            Sábados
          </dt>
          <dd className="mt-2 text-bone/90">10 a 20 h</dd>
        </div>
      </motion.dl>
    </motion.div>
  );
}

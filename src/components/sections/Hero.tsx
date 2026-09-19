"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="inicio"
      className="bg-grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
    >
      {/*
        Fondo inmersivo. Hoy es 100% CSS (luces cobre/oro sobre carbón).
        Para usar una foto real: agregá <Image fill priority className="object-cover opacity-30" />
        con /public/images/hero.jpg justo antes de las capas de degradé.
      */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[70vh] w-[70vh] rounded-full bg-copper/20 blur-[140px]" />
        <div className="absolute -right-1/4 bottom-0 h-[60vh] w-[60vh] rounded-full bg-gold/15 blur-[140px]" />
        <div className="bg-pinstripe absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-coal" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-x relative z-10 pb-16 pt-32 text-center"
      >
        <motion.p
          variants={item}
          className="mb-6 font-display text-xs uppercase tracking-[0.4em] text-copper-light sm:text-sm"
        >
          {siteConfig.tagline} · Villa del Parque · Desde {siteConfig.foundedYear}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl font-semibold uppercase leading-[1.05] tracking-wide sm:text-7xl lg:text-8xl"
        >
          Cortes con <br className="hidden sm:block" />
          <span className="text-gold-metal font-serif font-normal normal-case italic">
            carácter
          </span>
          , barba con{" "}
          <span className="text-gold-metal">estilo</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-bone-muted sm:text-lg"
        >
          Desde 2019 cuidando el look de Villa del Parque. Atención
          personalizada, navaja afilada y clientes que vuelven siempre.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="#turnos" className="w-full sm:w-auto">
            Reservar Turno
          </Button>
          <Button href="#galeria" variant="outline" className="w-full sm:w-auto">
            Ver Galería
          </Button>
        </motion.div>
      </motion.div>

      <a
        href="#historia"
        aria-label="Ir a la siguiente sección"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold/70 transition-colors hover:text-gold-light"
      >
        <ChevronDown className="h-7 w-7 animate-scroll-hint" />
      </a>
    </section>
  );
}

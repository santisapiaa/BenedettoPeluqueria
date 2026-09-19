"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Scissors, X } from "lucide-react";

import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body con el menú móvil abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-gold/15 bg-coal/85 py-3 backdrop-blur-md"
          : "bg-transparent py-5",
      )}
    >
      <nav
        aria-label="Principal"
        className="container-x flex items-center justify-between"
      >
        <a
          href="#inicio"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
            <Scissors className="h-4 w-4 -rotate-45" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold uppercase tracking-[0.22em] text-gold-metal">
              {siteConfig.name}
            </span>
            <span className="block pt-1 text-[0.6rem] uppercase tracking-[0.3em] text-bone-muted">
              {siteConfig.tagline}
            </span>
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative font-display text-sm uppercase tracking-[0.18em] text-bone/80 transition-colors hover:text-gold-light after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold-metal after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Button href="#turnos" className="!px-5 !py-2.5">
              Reservar Turno
            </Button>
          </li>
        </ul>

        {/* Toggle móvil */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 text-gold lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pt-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-gold/10 py-4 font-display text-2xl uppercase tracking-[0.15em] text-bone transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-8" onClick={() => setOpen(false)}>
                <Button href="#turnos" className="w-full">
                  Reservar Turno
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-coal/90 py-3 backdrop-blur-md"
          : "bg-transparent py-5",
      )}
    >
      <nav
        aria-label="Principal"
        className="container-x flex items-center justify-between"
      >
        <a
          href="#inicio"
          className="leading-none"
          onClick={() => setOpen(false)}
        >
          <span className="block font-display text-xl font-semibold uppercase tracking-[0.22em] text-bone">
            {siteConfig.name}
          </span>
          <span className="block pt-1.5 text-[0.62rem] uppercase tracking-[0.28em] text-gold">
            {siteConfig.tagline}
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.16em] text-bone/75 transition-colors hover:text-gold-light"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Button href="#turnos" className="!px-5 !py-2.5">
              Reservar turno
            </Button>
          </li>
        </ul>

        {/* Toggle móvil */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-bone lg:hidden"
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="container-x flex flex-col pt-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-4 font-display text-2xl text-bone transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-8" onClick={() => setOpen(false)}>
                <Button href="#turnos" className="w-full">
                  Reservar turno
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

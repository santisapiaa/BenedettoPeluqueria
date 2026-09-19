import { Scissors } from "lucide-react";

import { navLinks, siteConfig } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-ink">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Scissors className="h-5 w-5 -rotate-45 text-gold" />
            <span className="font-display text-xl font-semibold uppercase tracking-[0.22em] text-gold-metal">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-muted">
            {siteConfig.tagline}. Oficio, estilo y trayectoria en cada corte.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xs uppercase tracking-[0.3em] text-copper-light">
            Navegación
          </h3>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-bone-muted transition-colors hover:text-gold-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#turnos"
                className="text-bone-muted transition-colors hover:text-gold-light"
              >
                Reservar turno
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xs uppercase tracking-[0.3em] text-copper-light">
            Seguinos
          </h3>
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-bone-muted transition-colors hover:text-gold-light"
          >
            <InstagramIcon className="h-5 w-5" />@{siteConfig.instagram.handle}
          </a>
        </div>
      </div>

      <div className="border-t border-gold/10 py-5 text-center text-xs text-bone-muted">
        © {new Date().getFullYear()} {siteConfig.name} {siteConfig.tagline}.
        Todos los derechos reservados.
      </div>
    </footer>
  );
}

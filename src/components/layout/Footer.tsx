import Image from "next/image";

import { navLinks, siteConfig } from "@/lib/site";
import { InstagramIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <Image
            src="/brand/barber-rock.png"
            alt="Benedetto Peluquería · Ladies & Gents · Barber Rock"
            width={566}
            height={470}
            className="h-auto w-36"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-muted">
            {siteConfig.address.street}, {siteConfig.address.city}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">
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
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">
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

          <p className="mt-6 text-sm leading-relaxed text-bone-muted">
            ¿Te gusta el rock? Escuchá a{" "}
            <a
              href={siteConfig.pelusones.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold-light"
            >
              Pelusones
            </a>
            , la banda de la casa.
          </p>
          <a
            href={siteConfig.pelusones.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm text-bone-muted transition-colors hover:text-gold-light"
          >
            <InstagramIcon className="h-5 w-5" />@{siteConfig.pelusones.handle}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-bone-muted">
        © {new Date().getFullYear()} {siteConfig.name} {siteConfig.tagline}
      </div>
    </footer>
  );
}

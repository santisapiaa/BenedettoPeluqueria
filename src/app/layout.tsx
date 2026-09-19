import type { Metadata, Viewport } from "next";
import { Inter, Pinyon_Script, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Analytics } from "@vercel/analytics/next";
import { openingHours, siteConfig } from "@/lib/site";

// Serif clásica para títulos: sobria, con peso y tradición.
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Script caligráfica del logo: para el nombre y los títulos principales.
const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} Peluquería y Barbería | Villa del Parque`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} Peluquería y Barbería`,
    description: siteConfig.description,
    siteName: `${siteConfig.name} Peluquería y Barbería`,
    url: "/",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Peluquería y Barbería`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Datos estructurados para Google: horarios, dirección y redes del local.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: `${siteConfig.name} ${siteConfig.tagline}`,
  url: siteConfig.url,
  image: `${siteConfig.url}/opengraph-image.jpg`,
  telephone: `+${siteConfig.whatsapp}`,
  hasMap: `https://www.google.com/maps/place/?q=place_id:${siteConfig.googlePlaceId}`,
  sameAs: [siteConfig.instagram.url],
  openingHoursSpecification: Object.entries(openingHours).flatMap(([dow, ranges]) =>
    ranges.map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAYS[Number(dow)],
      opens,
      closes,
    })),
  ),
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: "CABA",
    addressCountry: siteConfig.address.country,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      className={`${display.variable} ${script.variable} ${sans.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}

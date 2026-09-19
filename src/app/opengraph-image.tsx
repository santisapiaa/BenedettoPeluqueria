import { ImageResponse } from "next/og";

import { brandFonts } from "@/lib/brand-font";
import { siteConfig } from "@/lib/site";

// Imagen que aparece al compartir el link (WhatsApp, Instagram, Facebook, etc.)
export const alt = "Benedetto Peluquería y Barbería · Villa del Parque";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(ellipse at 70% 20%, #262320 0%, #121212 60%)",
          padding: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(184,153,90,0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Pinyon Script",
              fontSize: 230,
              lineHeight: 1,
              color: "#ececec",
              paddingBottom: 10,
            }}
          >
            Benedetto
          </div>

          <div
            style={{
              display: "flex",
              width: 90,
              height: 1,
              background: "#b8995a",
              margin: "6px 0 26px",
            }}
          />

          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 30,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#b8995a",
            }}
          >
            Peluquería · Barbería
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontFamily: "Inter",
              fontSize: 26,
              color: "#a9a397",
            }}
          >
            {`${siteConfig.address.city} · Reservá tu turno online`}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: brandFonts() },
  );
}

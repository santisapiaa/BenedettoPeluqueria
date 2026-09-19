import { ImageResponse } from "next/og";

import { brandFonts } from "@/lib/brand-font";

// Ícono al guardar la página en la pantalla de inicio del iPhone.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121212",
          color: "#e9e9e9",
          fontFamily: "Pinyon Script",
          fontSize: 180,
          lineHeight: 1,
          paddingBottom: 12,
          paddingRight: 8,
        }}
      >
        B
      </div>
    ),
    { ...size, fonts: brandFonts() },
  );
}

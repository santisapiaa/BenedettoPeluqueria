import { ImageResponse } from "next/og";

import { brandFonts } from "@/lib/brand-font";

// Favicon: la "B" plateada sobre fondo negro, como el logo.
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 36,
          color: "#e9e9e9",
          fontFamily: "Pinyon Script",
          fontSize: 190,
          lineHeight: 1,
          paddingBottom: 14,
          paddingRight: 8,
        }}
      >
        B
      </div>
    ),
    { ...size, fonts: brandFonts() },
  );
}

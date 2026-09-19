import fs from "node:fs";
import path from "node:path";

/**
 * Fuentes (licencia OFL) para las imágenes generadas: favicon y vista previa al
 * compartir el link. Pinyon Script es la misma tipografía que usa la web en los
 * títulos; Inter se usa para el texto chico.
 */
const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), "src/assets/fonts", file));

export function brandFonts() {
  return [
    {
      name: "Pinyon Script",
      data: read("pinyon-script-latin-400-normal.woff"),
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: read("inter-latin-400-normal.woff"),
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

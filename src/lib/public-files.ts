import fs from "node:fs";
import path from "node:path";

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "avif"];
const IMAGE_RE = new RegExp(`\\.(${IMAGE_EXT.join("|")})$`, "i");

/**
 * Lista las imágenes de una carpeta dentro de /public (en build time).
 * Así alcanza con copiar fotos a la carpeta: no hay que tocar código.
 */
export function listPublicImages(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", dir))
      .filter((f) => IMAGE_RE.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => encodeURI(`/${dir}/${f}`));
  } catch {
    return [];
  }
}

/** Busca /public/<base>.(jpg|jpeg|png|webp|avif) y devuelve su URL, o null. */
export function findPublicImage(base: string): string | null {
  for (const ext of IMAGE_EXT) {
    if (fs.existsSync(path.join(process.cwd(), "public", `${base}.${ext}`))) {
      return encodeURI(`/${base}.${ext}`);
    }
  }
  return null;
}

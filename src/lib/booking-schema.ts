import { z } from "zod";

/** Esquema compartido: lo valida el formulario (cliente) y el endpoint (servidor). */
export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Elegí un servicio"),
  /** "any" = sin preferencia */
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horario inválido"),
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre")
    .max(80, "El nombre es demasiado largo"),
  email: z
    .string()
    .trim()
    .max(120)
    .email("Ingresá un email válido"),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    }, "Ingresá un teléfono válido"),
  /** Honeypot anti-bots: los humanos no lo ven ni lo completan. */
  website: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

# Benedetto Peluquería y Barbería

Landing page que muestra los horarios libres en tiempo real (leídos de Google Calendar, solo lectura) y cierra el turno por WhatsApp. Next.js (App Router) + Tailwind CSS + Framer Motion. Sin base de datos.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar variables
npm run dev
```

Abrí http://localhost:3000. Sin credenciales de Google, en desarrollo los horarios funcionan en **modo demo** (no leen ningún calendario).

## Dónde editar cada cosa

| Qué | Dónde |
|---|---|
| Dirección, teléfono, horarios, redes | `src/lib/site.ts` |
| Servicios, precios, duraciones | `src/data/services.ts` |
| Peluqueros, colores de calendario, colorista | `src/data/barbers.ts` |
| Avisos especiales (cierres, vacaciones) | `src/data/announcements.ts` |
| Feriados (cierre automático) y excepciones | `src/data/holidays.ts` |
| Reseñas destacadas | `src/data/reviews.ts` |
| Fotos del local | copiar a `public/gallery/local/` |
| Fotos de cortes | copiar a `public/gallery/cortes/` |
| Fotos del equipo | `public/team/martin.jpg`, `public/team/federico.jpg` |
| Foto de fondo del inicio | `public/hero.jpg` |

## Turnos

- `GET /api/availability`: horarios libres del día (consulta Google Calendar).
- `GET /api/booking-status`: diagnóstico de la conexión con Google.

El cliente elige servicio, peluquero y horario, y la web abre WhatsApp con el pedido escrito. Los peluqueros cargan el turno a mano en su calendario.

Configuración: [docs/GOOGLE_CALENDAR.md](docs/GOOGLE_CALENDAR.md).

## Avisos de feriados o cierres

Agregá una línea en `src/data/announcements.ts` con el mensaje y, opcionalmente, `from` y `until` (YYYY-MM-DD). Aparece en el inicio y sobre los turnos, y se oculta solo pasada la fecha `until`.

## Feriados

Los feriados nacionales (incluidos puentes) están cargados en `src/data/holidays.ts`. En esos días el sitio no ofrece turnos, muestra el cartel "Cerrado por feriado" y avisa 7 días antes (solo si cae en un día en que se atiende). Para abrir un feriado puntual, agregar su fecha a `openOnHolidays`. **Revisar el listado una vez por año** (2027 es provisorio).

## Extras

- Cartel "Abierto ahora / Cerrado": se calcula solo con los horarios de `src/lib/site.ts`.
- Métricas: Vercel Web Analytics (visitas) y el evento `pedido_whatsapp` (los eventos personalizados requieren plan Pro de Vercel).
- `docs/qr/`: QR y cartel imprimible para pedir reseñas en Google.
- Cuando haya dominio propio: cargar `NEXT_PUBLIC_SITE_URL` en Vercel y registrar el sitio en Google Search Console (el sitemap está en `/sitemap.xml`).

# Benedetto Peluquería y Barbería

Landing page con reserva de turnos online. Next.js (App Router) + Tailwind CSS + Framer Motion. Los turnos se guardan en Google Calendar (sin base de datos).

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar variables
npm run dev
```

Abrí http://localhost:3000. Sin credenciales de Google, en desarrollo las reservas funcionan en **modo demo** (no guardan nada).

## Dónde editar cada cosa

| Qué | Dónde |
|---|---|
| Dirección, teléfono, horarios, redes | `src/lib/site.ts` |
| Servicios, precios, duraciones | `src/data/services.ts` |
| Peluqueros, colores de calendario, colorista | `src/data/barbers.ts` |
| Fotos del local | copiar a `public/gallery/local/` |
| Fotos de cortes | copiar a `public/gallery/cortes/` |
| Fotos del equipo | `public/team/martin.jpg`, `public/team/federico.jpg` |
| Foto de fondo del inicio | `public/hero.jpg` |

## Turnos

- `GET /api/availability`: horarios libres (consulta Google Calendar).
- `POST /api/bookings`: revalida disponibilidad y crea el evento.
- `GET /api/booking-status`: diagnóstico de la conexión con Google.

Configuración paso a paso: [docs/GOOGLE_CALENDAR.md](docs/GOOGLE_CALENDAR.md).

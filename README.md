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
| Fotos del local | copiar a `public/gallery/local/` |
| Fotos de cortes | copiar a `public/gallery/cortes/` |
| Fotos del equipo | `public/team/martin.jpg`, `public/team/federico.jpg` |
| Foto de fondo del inicio | `public/hero.jpg` |

## Turnos

- `GET /api/availability`: horarios libres del día (consulta Google Calendar).
- `GET /api/booking-status`: diagnóstico de la conexión con Google.

El cliente elige servicio, peluquero y horario, y la web abre WhatsApp con el pedido escrito. Los peluqueros cargan el turno a mano en su calendario.

Configuración: [docs/GOOGLE_CALENDAR.md](docs/GOOGLE_CALENDAR.md).

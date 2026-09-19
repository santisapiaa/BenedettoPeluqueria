# Benedetto Peluquería y Barbería

Landing page con reserva de turnos online. Next.js (App Router) + Tailwind CSS + Framer Motion.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar variables
npm run dev
```

Abrí http://localhost:3000.

## Datos del negocio

- `src/lib/site.ts`: dirección, teléfono, horarios, redes.
- `src/data/services.ts`: servicios y precios.
- `src/data/barbers.ts`: equipo y colorista.

## Turnos

Los turnos se guardan directamente en Google Calendar (no usa base de datos). Ver `.env.example` para las variables necesarias.

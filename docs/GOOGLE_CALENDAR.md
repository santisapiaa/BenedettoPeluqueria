# Conectar Google Calendar (solo lectura)

La web **lee** los calendarios de Martín y Federico para mostrar qué horarios
están libres. **No crea ni modifica turnos**: el cliente elige un horario y
el pedido se cierra por WhatsApp; cada peluquero carga el turno a mano.

## Cómo funciona

- Cada peluquero tiene su propio calendario. Todo lo que hay cargado ahí
  ocupa ese horario para esa persona.
- Un evento de **día completo** (feriado, vacaciones) bloquea todo el día de
  ese calendario.
- Un evento marcado como **"Disponible"** (en vez de "Ocupado") se ignora.
- Los horarios se ofrecen cada 30 minutos, dentro del horario de atención y
  con al menos 1 hora de anticipación. Ver `src/lib/site.ts`.
- Los turnos que se cargan en el calendario desaparecen solos de la web.
  Los que se cancelan o borran vuelven a aparecer.

## Datos necesarios

| Dato | Variable de entorno |
|---|---|
| Email de la cuenta de servicio (robot) | `GOOGLE_SERVICE_ACCOUNT_EMAIL` |
| Clave privada del robot (JSON) | `GOOGLE_PRIVATE_KEY` |
| ID del calendario de Martín | `GOOGLE_CALENDAR_ID_MARTIN` |
| ID del calendario de Federico | `GOOGLE_CALENDAR_ID_FEDERICO` |

Alternativa con **un solo calendario compartido**: usar `GOOGLE_CALENDAR_ID` y
distinguir a cada peluquero por el color de los eventos (`colorId` en
`src/data/barbers.ts`).

> ⚠️ **La clave privada es como una contraseña.** No la subas a GitHub ni la
> mandes por mail o WhatsApp.

---

## 1. Crear el robot (cuenta de servicio) en Google Cloud

1. <https://console.cloud.google.com> → **Proyecto nuevo** (`Benedetto Turnos`).
2. ☰ → **APIs y servicios** → **Biblioteca** → **Google Calendar API** → **Habilitar**.
3. ☰ → **IAM y administración** → **Cuentas de servicio** → **Crear cuenta de
   servicio** (`turnos-web`) → **Crear y continuar** → sin roles → **Listo**.
4. Entrar a la cuenta creada → copiar su **email**.
5. Pestaña **Claves** → **Agregar clave** → **Crear clave nueva** → **JSON**.
   Se descarga un archivo con la clave.

## 2. Compartir cada calendario con el robot

En Google Calendar, con la cuenta de la peluquería, **por cada calendario**:

1. ⋮ junto al calendario → **Configuración y uso compartido**.
2. **Compartir con personas o grupos específicos** → **Agregar personas** →
   pegar el email del robot.
3. Permiso: **Ver todos los detalles de los eventos** (alcanza; no hace falta
   dar permiso de edición).
4. En **Integrar el calendario**, copiar el **ID de calendario**.

> 🔒 Verificá que en **"Permisos de acceso a eventos"** esté **desmarcado**
> "Poner a disposición del público". Si el calendario es público, cualquiera con
> el link puede ver los turnos con los nombres de los clientes.

## 3. Cargar las variables en Vercel

Proyecto → **Settings** → **Environment Variables** (marcar Production y
Preview). Después, **Deployments** → ⋯ → **Redeploy** (las variables nuevas
solo aplican a deploys nuevos).

`GOOGLE_PRIVATE_KEY`: pegar el valor de `private_key` del JSON. Sirve tanto
con saltos de línea reales como con `\n` literales.

## 4. Verificar

Abrir `https://TU-SITIO.vercel.app/api/booking-status`. Tiene que decir:

```json
{
  "ok": true,
  "mode": "live",
  "message": "Conexión con Google Calendar correcta.",
  "calendars": [
    { "label": "Martín Madonia", "ok": true },
    { "label": "Federico Madonia", "ok": true }
  ]
}
```

Si `ok` es `false`, el detalle dice qué calendario falla y por qué:

| Mensaje | Causa probable |
|---|---|
| Faltan variables de entorno… | Falta alguna variable, o falta el Redeploy |
| La clave privada está mal pegada o incompleta | Volver a copiar `private_key` completa |
| Credenciales inválidas | El email y la clave no son del **mismo** JSON |
| No se encontró el calendario | ID mal copiado, o no está compartido con el robot |
| Sin permiso | Falta habilitar Calendar API o compartir el calendario con el robot |

## 5. Limpieza

Borrar el archivo `.json` de **Descargas** y vaciar la **Papelera**. Si la
clave se filtra alguna vez: Cuentas de servicio → Claves → borrar la clave y
crear otra.

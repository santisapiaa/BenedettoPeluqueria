# Conectar Google Calendar (paso a paso)

Objetivo: que los turnos que se reservan en la web aparezcan solos en el
Google Calendar de la peluquería, y que la web sepa qué horarios ya están
ocupados.

**Tiempo estimado: 20–30 minutos.** Se hace una sola vez.

> 💡 **No hace falta usar la computadora de la peluquería para todo.** La
> Parte B (crear el "usuario robot") se puede hacer con **cualquier cuenta de
> Google**, por ejemplo la tuya. Del lado de la peluquería solo se necesita
> el **dueño del calendario** para dos cosas: copiar el ID (Parte A) y
> compartirlo con el robot (Parte C). Son 2–3 minutos.

Vas a necesitar tres datos al final:

| Dato | Para qué sirve | Ejemplo |
|---|---|---|
| Email de la cuenta de servicio | Es el "usuario robot" de la web | `turnos-web@benedetto-turnos.iam.gserviceaccount.com` |
| Clave privada | Es la "contraseña" de ese robot | un texto largo que empieza con `-----BEGIN PRIVATE KEY-----` |
| ID del calendario de **cada peluquero** | Indica en qué calendario se cargan los turnos de cada uno | `abc123...@group.calendar.google.com` |

> ⚠️ **La clave privada es como una contraseña.** No la mandes por WhatsApp
> ni por mail, no la subas a GitHub y borrá el archivo cuando termines
> (Parte F).

---

## Parte A — Elegir los calendarios

Importante: la web lee estos calendarios para saber qué horarios están
ocupados, así que **tienen que ser los mismos donde ya cargan los turnos a
mano**.

La web soporta dos formas de trabajo:

- **Un calendario por peluquero** (recomendado, es el caso de Benedetto):
  todo lo que está en el calendario de Martín lo ocupa a él, y lo mismo con
  Federico. Se cargan `GOOGLE_CALENDAR_ID_MARTIN` y `GOOGLE_CALENDAR_ID_FEDERICO`.
- **Un solo calendario compartido**, con el color de cada evento para saber de
  quién es. Se carga `GOOGLE_CALENDAR_ID` y los colores en `src/data/barbers.ts`.

**Repetí estos pasos por cada calendario** (uno para Martín, otro para Federico):

1. Entrá a <https://calendar.google.com> con la cuenta de la peluquería.
2. A la izquierda, en **"Mis calendarios"**, pasá el mouse por el calendario
   de esa persona → tocá los **tres puntitos ⋮** →
   **"Configuración y uso compartido"**.
3. Bajá hasta la sección **"Integrar el calendario"**.
4. Copiá el **"ID de calendario"** y anotalo indicando de quién es
   (por ejemplo: `Martín: abc123@group.calendar.google.com`).
   - Si es el calendario principal de la cuenta, el ID es el propio email.
5. Dejá esta pestaña abierta: la vas a necesitar en la Parte C.

---

## Parte B — Crear el "usuario robot" en Google Cloud

1. Entrá a <https://console.cloud.google.com> con tu cuenta de Google (no
   tiene que ser la de la peluquería).
   Si es la primera vez, aceptá los términos de servicio (no pide tarjeta
   para esto).
2. Arriba a la izquierda, tocá el selector de proyectos → **"Proyecto nuevo"**.
   - Nombre: `Benedetto Turnos` → **Crear**.
   - Esperá unos segundos y asegurate de que el proyecto nuevo quede
     seleccionado arriba.
3. **Activar la API de Calendar:** menú ☰ → **"APIs y servicios"** →
   **"Biblioteca"** → buscá **"Google Calendar API"** → **Habilitar**.
4. **Crear la cuenta de servicio:** menú ☰ → **"IAM y administración"** →
   **"Cuentas de servicio"** → **"Crear cuenta de servicio"**.
   - Nombre: `turnos-web` → **Crear y continuar**.
   - En "Otorgar acceso" **no elijas nada** → **Continuar** → **Listo**.
5. En la lista, tocá la cuenta que acabás de crear y **copiá su email**
   (termina en `.iam.gserviceaccount.com`). Guardalo en el Bloc de notas.
6. Andá a la pestaña **"Claves"** → **"Agregar clave"** →
   **"Crear clave nueva"** → tipo **JSON** → **Crear**.
   - Se descarga un archivo `.json` (queda en **Descargas**). Ese archivo
     contiene la clave privada.

---

## Parte C — Compartir los calendarios con el robot

**Repetilo para cada calendario** (el de Martín y el de Federico).

1. Volvé a la pestaña de Google Calendar (Parte A, paso 2).
2. En **"Compartir con personas o grupos específicos"** →
   **"Agregar personas y grupos"**.
3. Pegá el **email de la cuenta de servicio** (Parte B, paso 5).
4. En permisos elegí **"Realizar cambios en los eventos"**.
   (Si dejás "Ver todos los detalles del evento" no va a poder crear turnos.)
5. **Enviar**. Si Google pregunta algo sobre enviar invitación, aceptá.

---

## Parte D — Cargar los datos en Vercel

1. Abrí el archivo `.json` descargado con el **Bloc de notas** (clic derecho →
   Abrir con → Bloc de notas).
2. Entrá a <https://vercel.com> → tu proyecto → **Settings** →
   **Environment Variables**.
3. Creá estas variables (marcá Production y Preview; Development solo si
   corrés el sitio con `vercel dev`):

   | Nombre | Valor |
   |---|---|
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | el valor de `client_email` del JSON |
   | `GOOGLE_PRIVATE_KEY` | el valor de `private_key` del JSON (ver abajo) |
   | `GOOGLE_CALENDAR_ID_MARTIN` | el ID del calendario de Martín (Parte A) |
   | `GOOGLE_CALENDAR_ID_FEDERICO` | el ID del calendario de Federico (Parte A) |

   (Si usan **un solo calendario compartido**, creá en cambio una sola variable,
   `GOOGLE_CALENDAR_ID`.)

   **Cómo copiar `private_key`:** en el JSON aparece así:

   ```
   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n",
   ```

   Copiá **todo lo que está entre las comillas**, desde `-----BEGIN` hasta
   `-----END PRIVATE KEY-----\n` inclusive, **dejando los `\n` tal cual**
   (no los reemplaces ni los borres). Sin las comillas del principio y del
   final. En Vercel podés activar **"Sensitive"** para esa variable.

4. **Redeploy:** las variables nuevas solo aplican a deploys nuevos. Andá a
   **Deployments** → los tres puntitos del último deploy → **Redeploy**.

---

## Parte E — Verificar que funciona

1. Abrí en el navegador: `https://TU-SITIO.vercel.app/api/booking-status`
2. Tiene que decir:

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

3. Si dice `"ok": false`, el mensaje indica qué revisar. Con un calendario
   por peluquero, `calendars` dice **cuál** de los dos falla:

   | Mensaje | Causa probable |
   |---|---|
   | Faltan variables de entorno… | Falta alguna variable (email, clave o algún ID), o falta el Redeploy |
   | La clave privada está mal pegada o incompleta | Volver a copiar `private_key` completa (Parte D) |
   | Credenciales inválidas | El email no coincide con la clave: usar ambos del **mismo** JSON |
   | No se encontró el calendario | ID de calendario mal copiado, o no está compartido (Parte C) |
   | Sin permiso | Falta habilitar Calendar API (B3) o el permiso "Realizar cambios en los eventos" (C4) |

4. Hacé una reserva de prueba en la web: el evento tiene que aparecer en el
   calendario. **Después borralo** desde Google Calendar.

---

## Parte F — Limpieza (no te la saltees)

1. Borrá el archivo `.json` de **Descargas** y vaciá la **Papelera de reciclaje**.
2. No lo guardes en el escritorio, en Drive ni lo mandes por mail.
3. Si por error se filtra: en Google Cloud → Cuentas de servicio → Claves →
   **borrar la clave** y crear una nueva (Parte B, paso 6).

---

## Colores de los turnos

> Si cada peluquero tiene **su propio calendario**, no hace falta configurar
> colores: se sabe de quién es cada turno por el calendario donde está. Esta
> sección aplica solo al caso de **un calendario compartido**.

La web distingue los turnos de cada peluquero por el **color del evento**.
Google Calendar solo expone sus **11 colores estándar** (los personalizados
no se pueden identificar). Para pasarme los colores, decime cuál usa cada uno
por su nombre, tal como aparece al pasar el mouse en Google Calendar:

| Nombre | ID |   | Nombre | ID |
|---|---|---|---|---|
| Lavanda | 1 |   | Arándano | 9 |
| Salvia | 2 |   | Albahaca | 10 |
| Uva | 3 |   | Tomate | 11 |
| Flamenco | 4 |   | Grafito | 8 |
| Banana | 5 |   | Pavo real | 7 |
| Mandarina | 6 |   |   |   |

Los turnos que se creen desde la web salen con el color de cada peluquero.
Si un turno cargado a mano tiene un color desconocido, la web lo toma como
ocupado para **todos** (es lo más seguro, para no dar turnos duplicados).

También podés marcar en el calendario eventos de **día completo** (feriados,
vacaciones): la web los toma como "cerrado ese día".

---

## Limitaciones a tener en cuenta

- El cliente **no recibe un email automático** (Google no permite que un
  robot envíe invitaciones sin configuración de empresa). Ve la confirmación
  en pantalla, con botones para agregarlo a su calendario y avisar por
  WhatsApp. Más adelante se puede sumar envío de emails con un servicio como
  Resend.
- Para cancelar o mover un turno, se hace directamente en Google Calendar;
  el horario se libera solo.

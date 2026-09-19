# Conectar Google Calendar (paso a paso)

Objetivo: que los turnos que se reservan en la web aparezcan solos en el
Google Calendar de la peluquería, y que la web sepa qué horarios ya están
ocupados.

**Tiempo estimado: 20–30 minutos.** Se hace una sola vez, desde la
computadora de la peluquería, con la cuenta de Google de la peluquería.

Vas a necesitar tres datos al final:

| Dato | Para qué sirve | Ejemplo |
|---|---|---|
| Email de la cuenta de servicio | Es el "usuario robot" de la web | `turnos-web@benedetto-turnos.iam.gserviceaccount.com` |
| Clave privada | Es la "contraseña" de ese robot | un texto largo que empieza con `-----BEGIN PRIVATE KEY-----` |
| ID del calendario | Indica en qué calendario se cargan los turnos | `abc123...@group.calendar.google.com` |

> ⚠️ **La clave privada es como una contraseña.** No la mandes por WhatsApp
> ni por mail, no la subas a GitHub y borrá el archivo cuando termines
> (Parte F).

---

## Parte A — Elegir el calendario

Importante: la web lee este calendario para saber qué horarios están
ocupados, así que **tiene que ser el mismo calendario donde ya cargan los
turnos a mano** (los que diferencian por colores).

1. Entrá a <https://calendar.google.com> con la cuenta de la peluquería.
2. A la izquierda, en **"Mis calendarios"**, pasá el mouse por el calendario
   donde cargan los turnos → tocá los **tres puntitos ⋮** →
   **"Configuración y uso compartido"**.
   - Si no tienen ninguno específico y usan el calendario principal, también
     sirve. Si preferís separar, podés crear uno nuevo con
     **"Otros calendarios" → "+" → "Crear calendario nuevo"**.
3. Bajá hasta la sección **"Integrar el calendario"**.
4. Copiá el **"ID de calendario"** y guardalo en el Bloc de notas.
   - Si es el calendario principal, es tu propio email de Gmail.
5. Dejá esta pestaña abierta: la vas a necesitar en la Parte C.

---

## Parte B — Crear el "usuario robot" en Google Cloud

1. Entrá a <https://console.cloud.google.com> con **la misma cuenta**.
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

## Parte C — Compartir el calendario con el robot

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
3. Creá estas tres variables (marcá los tres entornos: Production, Preview y
   Development):

   | Nombre | Valor |
   |---|---|
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | el valor de `client_email` del JSON |
   | `GOOGLE_PRIVATE_KEY` | el valor de `private_key` del JSON (ver abajo) |
   | `GOOGLE_CALENDAR_ID` | el ID de la Parte A |

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
   { "ok": true, "mode": "live", "message": "Conexión con Google Calendar correcta." }
   ```

3. Si dice `"ok": false`, el mensaje indica qué revisar:

   | Mensaje | Causa probable |
   |---|---|
   | Faltan variables de entorno… | Falta crear alguna de las 3 variables, o falta el Redeploy |
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

# 🛠️ Guía del Desarrollador - CalenBook

¡Bienvenido al desarrollo de CalenBook! Esta guía te proporcionará todo lo necesario para configurar el entorno desde cero y entender el funcionamiento interno de la app.

## 🚀 Configuración Inicial

### 1. Requisitos Previos

- Node.js 18+ instalado.
- Una cuenta en [Supabase](https://supabase.com/).
- Una cuenta en [Google Cloud Console](https://console.cloud.google.com/).

### 2. Clonado e Instalación

```bash
git clone <tu-repositorio>
cd app-calendario
npm install
```

---

## ⚙️ Guía Paso a Paso: Variables de Env (.env)

El archivo `.env` debe ubicarse en `apps/web/.env`. A continuación, cómo obtener cada una de las llaves:

### A. Supabase (DB & Auth)

1. Ve a tu proyecto en **Supabase** y entra en **Project Settings** > **API**.
2. **URL**: Copia el valor de `Project URL` y pégalo en `NEXT_PUBLIC_SUPABASE_URL`.
3. **Anon Key**: Copia la llave `anon public` y pégala en `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Service Role Key**: Copia la llave `service_role secret` y pégala en `SUPABASE_SERVICE_ROLE_KEY`. **¡Nunca compartas esta última!**

#### 🐘 Configuración de la Base de Datos

Para que la aplicación funcione, debes ejecutar las migraciones en el SQL Editor de Supabase:

1. Copia el contenido de los archivos en `apps/supabase/migrations/` en orden.
2. **IMPORTANTE**: Ejecuta la siguiente sentencia para habilitar la sincronización de Google Calendar:

```sql
ALTER TABLE owners ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;
```

3. Asegúrate de configurar la URL del sitio en **Auth > URL Configuration** para que los redireccionamientos funcionen.

### B. Google Calendar API (OAuth)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un **Nuevo Proyecto**.
3. En el menú lateral, ve a **APIs & Services** > **Library** y busca "Google Calendar API". Haz clic en **Enable**.
4. Ve a **APIs & Services** > **OAuth Consent Screen**.
   - Elige **User Type: External**.
   - Completa el nombre de la app y tu correo.
   - En **Scopes**, añade: `.../auth/calendar.events` y `.../auth/calendar.readonly`.
5. Ve a **APIs & Services** > **Credentials**.
   - Haz clic en **Create Credentials** > **OAuth Client ID**.
   - Application Type: **Web Application**.
   - **Authorized Redirect URIs**: Añade `http://localhost:3000/api/auth/google/callback` (y tu URL de Vercel después).
6. Copia el **Client ID** y el **Client Secret** en sus respectivas variables.

### C. SMTP (Email)

Si usas Gmail:

1. Ve a tu Cuenta de Google > Seguridad.
2. Activa la **Verificación en dos pasos**.
3. Busca **Contraseñas de aplicación**.
4. Crea una nueva indicando "Correo" y "Otro (Nombre personalizado)".
5. Usa esa contraseña de 16 caracteres en `SMTP_PASS`.

---

## 🗄️ Estructura de Base de Datos (Supabase)

### Tablas Principales

- **`owners`**: Centraliza el perfil del proveedor y los tokens de Google.
- **`schedules`**: Define las agendas de disponibilidad (JSONB para los días de la semana).
- **`bookings`**: Registra las reservas de los clientes con su estado.

### Políticas RLS (Row Level Security)

Todo el sistema está blindado. Por ejemplo, en la tabla `bookings`:

- `SELECT`: El `owner` puede ver todas sus reservas. Los clientes solo pueden ver si un slot está ocupado.
- `INSERT`: Cualquiera puede insertar una reserva (vía formulario público).
- `DELETE/UPDATE`: Solo el `owner` autenticado puede modificar estados.

---

## 🛠️ Desarrollo Diario

- `npm run dev`: Inicia el entorno local.
- `npm run build`: Valida que el proyecto compile sin errores antes de subir a Vercel.

---

Desarrollado con estándares de Senior Engineer. ¡Happy coding! 🚀

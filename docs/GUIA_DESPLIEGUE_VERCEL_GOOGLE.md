# Guía de Despliegue (Vercel & Google) - CalenBook

Esta guía detalla los pasos para llevar CalenBook a producción, integrando **GitHub** para el flujo de CI/CD y configurando **Google Cloud** para uso público sin restricciones.

## 1. Preparación del Repositorio (GitHub)

Vercel utiliza Git para automatizar los despliegues. Sigue estos pasos para subir tu código:

1. Crea un nuevo repositorio en **GitHub**.
2. Inicializa Git localmente si no lo has hecho:
   ```bash
   git init
   git add .
   git commit -m "feat: Preparación para despliegue"
   ```
3. Conecta y sube tu código:
   ```bash
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git branch -M main
   git push -u origin main
   ```

## 2. Configuración en Vercel (CI/CD Automático)

Al conectar Vercel con GitHub, obtienes **CI/CD nativo**: cada vez que hagas `git push` a la rama `main`, Vercel compilará y desplegará la nueva versión automáticamente.

1. Ve a [vercel.com](https://vercel.com) e importa tu repositorio de GitHub.
2. **Framework Preset**: Selecciona **Next.js**.
3. **Root Directory**: Selecciona la carpeta `apps/web`.
4. **Environment Variables**: Añade todas las llaves necesarias en la sección "Settings > Environment Variables" de tu proyecto en Vercel:
   - `NEXT_PUBLIC_APP_URL`: Tu URL final de producción (ej. `https://mi-calendario.vercel.app`). **IMPORTANTE**: No debe terminar en `/`.
   - `NEXT_PUBLIC_OWNER_NAME`: El nombre que aparecerá en la cabecera y perfiles.
   - `NEXT_PUBLIC_TIMEZONE`: La zona horaria por defecto (ej. `America/Santiago`).
   - `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Llave pública anónima de Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: Llave secreta de rol de servicio (solo servidores).
   - `GOOGLE_CLIENT_ID`: ID de cliente de Google Cloud.
   - `GOOGLE_CLIENT_SECRET`: Secreto de cliente de Google Cloud.
   - `SMTP_HOST`: Servidor SMTP.
   - `SMTP_PORT`: Puerto (ej. `465`).
   - `SMTP_USER`: Tu correo emisor.
   - `SMTP_PASS`: Tu contraseña de aplicación.

## 3. Ajustes de Redirect URIs (CRÍTICO)

Para que OAuth y Supabase funcionen en producción, debes registrar tu dominio de Vercel:

### Google Cloud Console

Ruta: **APIs y servicios** -> **Credenciales** -> Editar tu **OAuth 2.0 Client ID**.

1. En **Authorized JavaScript origins**, añade tu URL de Vercel: `https://mi-app.vercel.app`.
2. En **Authorized redirect URIs**, añade: `https://mi-app.vercel.app/api/auth/google/callback`.

### Supabase

Ruta: **Authentication** -> **URL Configuration**.

1. **Site URL**: Pon tu dominio principal: `https://mi-app.vercel.app/`.
2. **Redirect URLs**: Añade el dominio con comodines: `https://mi-app.vercel.app/**` (Esto permite todas las sub-rutas de autenticación).

## 4. Pasar Google Cloud a Producción (INDISPENSABLE)

Para que cualquier usuario pueda conectar su calendario y los permisos no caduquen cada 7 días:

1. Entra a [Google Cloud Console](https://console.cloud.google.com/).
2. Ve a **APIs & Services** > **OAuth consent screen**.
3. En la sección **Publishing status**, haz clic en el botón **PUBLISH APP**.
4. Confirma la publicación.
5. **Advertencia de Verificación**: Ignora esto (haz clic en "Configuración avanzada" e "Ir a CalenBook (no seguro)" la primera vez). No necesitas verificarla oficialmente para uso personal/pequeño.

## 5. Flujo de Trabajo CI/CD

A partir de ahora, cualquier cambio que quieras realizar solo requiere:

1. Hacer cambios en el código.
2. `git add .`
3. `git commit -m "descripcion del cambio"`
4. `git push origin main`

**Vercel detectará el cambio y actualizará tu sitio en segundos.** 🚀🧿

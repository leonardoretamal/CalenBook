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
4. **Environment Variables**: Añade todas las llaves necesarias (ver [GUIA_DESARROLLADOR.md](GUIA_DESARROLLADOR.md)):
   - `NEXT_PUBLIC_APP_URL`: Tu URL final (ej. `https://mi-calendario.vercel.app`).
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.

## 3. Ajustes de Redirect URIs (CRÍTICO)

Para que OAuth y Supabase funcionen en producción, debes registrar tu dominio de Vercel:

### Google Cloud Console

1. En **Authorized JavaScript origins**, añade tu URL de Vercel.
2. En **Authorized redirect URIs**, añade: `https://mi-app.vercel.app/api/auth/google/callback`.

### Supabase

1. En **Authentication > URL Configuration**, establece **Site URL** con tu dominio de Vercel.
2. En **Redirect URLs**, añade: `https://mi-app.vercel.app/**`.

## 4. Pasar Google Cloud a Producción (INDISPENSABLE)

Para que cualquier usuario pueda conectar su calendario y los permisos no caduquen cada 7 días, debes publicar la aplicación en Google Cloud:

1. Entra a [Google Cloud Console](https://console.cloud.google.com/).
2. Ve a **APIs & Services** > **OAuth consent screen**.
3. En la sección **Publishing status**, haz clic en el botón **PUBLISH APP**.
4. Confirma la publicación.
5. **Advertencia de Verificación**: Google te dirá que la app no está verificada. Ignora esto a menos que planees tener miles de usuarios. Tus usuarios solo deberán hacer clic en "Configuración avanzada" e "Ir a CalenBook (no seguro)" la primera vez que se conecten.

## 5. Flujo de Trabajo CI/CD

A partir de ahora, cualquier cambio que quieras realizar solo requiere:

1. Hacer cambios en el código.
2. `git add .`
3. `git commit -m "descripcion del cambio"`
4. `git push origin main`

**Vercel detectará el cambio y actualizará tu sitio en segundos.** 🚀🧿

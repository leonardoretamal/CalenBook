# 📖 Guía Técnica de Arquitectura - CalenBook

Este documento centraliza toda la información técnica necesaria para configurar, desarrollar y escalar CalenBook.

## 🏗️ Arquitectura del Sistema

CalenBook utiliza una arquitectura monorepo simplificada basada en Turborepo para gestionar la aplicación web y los paquetes compartidos.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Vercel     │────▶│   Supabase   │────▶│ Google Calendar  │
│  (Frontend)  │     │  (DB + Auth) │     │      API         │
└─────────────┘     └──────────────┘     └─────────────────┘
```

### Capas del Proyecto

- **Presentación**: Next.js 16.1.6 App Router con componentes de Shadcn/UI y Tailwind CSS.
- **Lógica de Negocio**: Server Actions en `apps/web/src/app` y servicios compartidos en `packages/shared`.
- **Persistencia**: Supabase (PostgreSQL) con políticas de seguridad RLS (Row Level Security).
- **Notificaciones**: Sistema de correos integrado vía **Nodemailer/SMTP**.

## ⚙️ Configuración del Entorno (.env)

El archivo `.env` en `apps/web/` es la única fuente de verdad para la aplicación web. Para una guía detallada sobre cómo obtener cada credencial, consulta la [Guía del Desarrollador](GUIA_DESARROLLADOR.md).

### Resumen de Variables

- **Supabase**: URL, Anon Key y Service Role Key (para operaciones administrativas).
- **Google OAuth**: Client ID y Secret para la sincronización de calendarios.
- **SMTP**: Host, puerto, usuario y contraseña de aplicación para el envío de correos.

## 🗄️ Diseño de Base de Datos

### Tablas Principales

- `owners`: Almacena el perfil del proveedor, preferencias y tokens de Google.
- `schedules`: Define las agendas de disponibilidad con lógica de franjas horarias.
- `bookings`: Registra las citas de los clientes, estados de confirmación y sincronización.

### Seguridad RLS

Cada tabla cuenta con políticas estrictas que garantizan que el dueño (`owner_id`) solo pueda acceder a su propia información, mientras que las consultas públicas están limitadas a lo estrictamente necesario para el flujo de reserva.

## 🛠️ Comandos de Desarrollo

- `npm run dev`: Inicia el entorno de desarrollo local.
- `npm run build`: Genera la compilación para producción.
- `npm run lint`: Ejecuta el análisis de calidad de código.

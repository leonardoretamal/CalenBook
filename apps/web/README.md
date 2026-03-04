# 🧿 CalenBook

[**Español**](#español) | [**English**](#english)

---

<a name="español"></a>

## 🇪🇸 Español

**CalenBook** es una plataforma de gestión de reservas profesionales diseñada para simplificar la programación de citas entre proveedores de servicios y sus clientes. Construida con un enfoque en la velocidad, la seguridad y la experiencia de usuario.

### ✨ Características Principales

- **Dashboard de Control**: Estadísticas en tiempo real de reservas confirmadas, pendientes y actividad reciente.
- **Gestión de Agendas Flexibles**: Configuración de múltiples horarios, duraciones de slots y márgenes de tiempo.
- **Calendario Interactivo**: Interfaz fluida para que los clientes reserven en segundos.
- **Sincronización con Google Calendar**: Conexión nativa vía OAuth para sincronizar citas automáticamente.
- **Validación por Email**: Flujo de confirmación integrado vía **Nodemailer/SMTP** para evitar spam.

### 🛠️ Stack Tecnológico

- **Core**: Next.js 16.1.6 (App Router)
- **Base de Datos & Auth**: Supabase (PostgreSQL + RLS)
- **Calendario**: FullCalendar + Google Calendar API
- **Estilos**: Tailwind CSS + Shadcn/UI
- **Validación & Estado**: Zod + Zustand

### 🚀 Inicio Rápido

1. **Instalar dependencias**: `npm install`
2. **Configurar entorno**: Renombrar `.env.example` en `apps/web/` a `.env` y completar las llaves (ver [GUIA_DESARROLLADOR.md](docs/GUIA_DESARROLLADOR.md)).
3. **Ejecutar**: `npm run dev`
4. **Despliegue**: Seguir la [Guía de Despliegue (Vercel & Google)](docs/GUIA_DESPLIEGUE_VERCEL.md).

---

<a name="english"></a>

<h2>🇺🇸 English</h2>

**CalenBook** is a professional booking management platform designed to streamline appointment scheduling between service providers and their clients. Built with a focus on speed, security, and user experience.

<h3>✨ Key Features</h3>

- **Control Dashboard**: Real-time statistics for confirmed and pending bookings, and recent activity.
- **Flexible Schedule Management**: Configure multiple schedules, slot durations, and time buffers.
- **Interactive Calendar**: Smooth interface for clients to book in seconds.
- **Google Calendar Sync**: Native OAuth connection to automatically sync appointments.
- **Email Validation**: Integrated confirmation flow via **Nodemailer/SMTP** to prevent spam.

<h3>🛠️ Tech Stack</h3>

- **Core**: Next.js 16.1.6 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Calendar**: FullCalendar + Google Calendar API
- **Styling**: Tailwind CSS + Shadcn/UI
- **Validation & State**: Zod + Zustand

<h3>🚀 Quick Start</h3>

1. **Install dependencies**: `npm install`
2. **Configure environment**: Rename `.env.example` to `.env` in `apps/web/` and fill in the keys (see [GUIA_DESARROLLADOR.md](docs/GUIA_DESARROLLADOR.md)).
3. **Run**: `npm run dev`

---

Desarrollado con ❤️ para profesionales independientes. / Developed with ❤️ for independent professionals.

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Lock, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />

      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">CalenBook</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Propietarios
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next.js App Router Edition
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl bg-clip-text text-transparent bg-linear-to-br from-white to-white/40 mb-6">
          La forma elegante de gestionar tu tiempo.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Un sistema de reservas profesional, sincronizado con tu Google
          Calendar y construido sobre infraestructura sólida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="rounded-full px-8 gap-2 group">
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a
            href="https://github.com/tu-usuario/calenbook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 glass hover:bg-white/5"
            >
              Ver en GitHub
            </Button>
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-24">
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sincronización Total</h3>
            <p className="text-muted-foreground text-sm">
              Tus reservas se reflejan instantáneamente en Google Calendar y
              viceversa.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Zonas Horarias</h3>
            <p className="text-muted-foreground text-sm">
              Cálculo automático de zonas horarias para tus clientes
              internacionales.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aislado Seguro</h3>
            <p className="text-muted-foreground text-sm">
              Protegido a nivel de base de datos con Row Level Security de
              Supabase.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

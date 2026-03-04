import { checkAuth } from '@/lib/auth';
import { LoginForm } from './login-form';

export default async function LoginPage() {
  // If user is already logged in, redirect them away from the login page
  await checkAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
            CalenBook
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistema Profesional de Reservas
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-8">
          Solo para propietarios. Si eres un cliente, contáctate directamente
          con la persona que te envió el enlace para reservar.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { login, signup } from '../actions';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const initialLoginState: { error: string | null; success: boolean } = {
  error: null,
  success: false,
};
const initialSignupState: {
  error: string | null;
  success: boolean;
  message?: string;
} = { error: null, success: false };

export function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginState, loginAction, isLoginPending] = useActionState(
    login,
    initialLoginState
  );
  const [signupState, signupAction, isSignupPending] = useActionState(
    signup,
    initialSignupState
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if coming from verification failure or success
    const urlError = searchParams.get('error');
    if (urlError) {
      toast.error(
        'Ocurrió un error al verificar tu cuenta. Por favor, intenta de nuevo.'
      );
    }

    const verified = searchParams.get('verified');
    if (verified) {
      toast.success('¡Email verificado con éxito! Ahora puedes ingresar.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (loginState?.error) {
      toast.error(
        loginState.error === 'Invalid login credentials'
          ? 'Credenciales incorrectas'
          : loginState.error
      );
    } else if (loginState?.success) {
      toast.success('Sesión iniciada exitosamente');
      // Adding a small delay to let the toast appear before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  }, [loginState, router]);

  useEffect(() => {
    if (signupState?.error) {
      toast.error(signupState.error);
    } else if (signupState?.success) {
      toast.success(signupState.message || 'Cuenta creada exitosamente');
    }
  }, [signupState]);

  const toggleMode = () => setIsRegistering(!isRegistering);

  const isPending = isLoginPending || isSignupPending;
  const activeError = isRegistering ? signupState?.error : loginState?.error;

  if (signupState?.success || searchParams.get('verified')) {
    const isVerified = searchParams.get('verified');
    return (
      <Card className="glass border-primary/10 shadow-xl text-center py-10">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">
            {isVerified ? '¡Email Verificado!' : '¡Cuenta Creada!'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {isVerified
              ? 'Tu cuenta ha sido activada correctamente. Ya puedes acceder al sistema.'
              : signupState.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <Button
            variant="default"
            className="w-full cursor-pointer"
            onClick={() => {
              if (isVerified) {
                // Clear the params and show login
                router.replace('/auth/login');
                setIsRegistering(false);
              } else {
                window.location.reload();
              }
            }}
          >
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-primary/10 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {isRegistering ? 'Crear tu cuenta Owner' : 'Bienvenido de nuevo'}
        </CardTitle>
        <CardDescription>
          {isRegistering
            ? 'Crea tu cuenta administradora para empezar'
            : 'Ingresa tus credenciales para administrar tus agendas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={isRegistering ? signupAction : loginAction}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                required
                className="bg-background"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                {!isRegistering && (
                  <a
                    href="#"
                    className="text-xs text-primary underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                )}
              </div>
              <PasswordInput
                id="password"
                name="password"
                required
                minLength={8}
                className="bg-background"
                disabled={isPending}
              />
              {isRegistering && (
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 8 caracteres
                </p>
              )}
            </div>
          </div>

          {isRegistering && (
            <div className="flex items-start space-x-2 py-2">
              <input
                type="checkbox"
                id="privacy"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="privacy"
                className="text-sm text-muted-foreground leading-tight"
              >
                Acepto los{' '}
                <Link
                  href="/privacidad"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                >
                  Términos y Condiciones de Privacidad
                </Link>
                .
              </label>
            </div>
          )}

          {activeError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>
                {activeError === 'Invalid login credentials'
                  ? 'Credenciales incorrectas'
                  : activeError}
              </span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
            size="lg"
            onClick={() => {
              if (!isRegistering) {
                toast.info('Iniciando sesión... Por favor espera.');
              }
            }}
          >
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                {isRegistering ? 'Creando cuenta...' : 'Autenticando...'}
              </>
            ) : isRegistering ? (
              'Crear mi cuenta'
            ) : (
              'Ingresar al Dashboard'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 pt-4">
        <Button
          variant="link"
          className="text-sm text-muted-foreground cursor-pointer"
          onClick={toggleMode}
          disabled={isPending}
        >
          {isRegistering
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿Es tu primera vez? Crea tu cuenta'}
        </Button>
      </CardFooter>
    </Card>
  );
}

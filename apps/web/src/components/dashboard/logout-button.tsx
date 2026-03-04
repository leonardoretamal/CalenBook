'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/app/auth/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';

export function LogoutButton({
  userName,
  variant = 'header',
}: {
  userName: string;
  variant?: 'header' | 'sidebar';
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // wait a moment for the animation to show and be readable
    setTimeout(async () => {
      await logout();
    }, 2000);
  };

  if (variant === 'sidebar') {
    return (
      <>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer group"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Cerrar sesión</span>
        </Button>

        <AnimatePresence>
          {isLoggingOut && <LogoutOverlay userName={userName} />}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        onClick={handleLogout}
        title="Cerrar sesión"
      >
        <LogOut className="h-5 w-5" />
        <span className="sr-only">Cerrar sesión</span>
      </Button>

      <AnimatePresence>
        {isLoggingOut && <LogoutOverlay userName={userName} />}
      </AnimatePresence>
    </>
  );
}

function LogoutOverlay({ userName }: { userName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center space-y-4"
      >
        <Spinner className="h-12 w-12 text-primary" />
        <h2 className="text-3xl font-bold tracking-tight text-center">
          Adiós, {userName}
        </h2>
        <p className="text-muted-foreground">
          Cierre de sesión seguro en progreso...
        </p>
      </motion.div>
    </motion.div>
  );
}

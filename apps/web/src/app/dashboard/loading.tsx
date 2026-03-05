import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0">
          <Spinner className="h-16 w-16 text-primary" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight animate-pulse">
          Cargando...
        </h2>
        <p className="text-muted-foreground text-sm">
          Estamos preparando tus reservas y agendas.
        </p>
      </div>
    </div>
  );
}

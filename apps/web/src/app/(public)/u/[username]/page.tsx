import { getOwnerProfileAndSchedules } from '@/lib/services/public-profile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { schedules, error } = await getOwnerProfileAndSchedules(username);

  if (error || !schedules || schedules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
        <Card className="max-w-md w-full text-center p-8">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h1 className="text-2xl font-bold">Agenda no disponible</h1>
          <p className="text-muted-foreground mt-2">
            Este usuario no tiene agendas públicas configuradas en este momento.
          </p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // If there's only one schedule, redirect directly to it to avoid history layering
  if (schedules.length === 1) {
    redirect(`/u/${username}/${schedules[0].id}`);
  }

  // If there are multiple, show a list (though you asked to go direct,
  // we'll keep this as a fallback or also redirect to the first one if preferred)
  // For now, let's always redirect to the first one as you requested "direct" access
  redirect(`/u/${username}/${schedules[0].id}`);
}

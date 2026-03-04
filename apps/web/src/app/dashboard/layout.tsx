import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen w-full bg-muted/40 text-foreground overflow-hidden">
      <DashboardSidebar
        userName={user?.user_metadata?.full_name?.split(' ')[0] || 'Admin'}
      />
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        <DashboardHeader
          userEmail={user?.email}
          fullName={user?.user_metadata?.full_name?.split(' ')[0]}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

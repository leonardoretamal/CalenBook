'use client';

import { Menu, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';
import { useSidebarStore } from '@/lib/store/sidebar-store';
import { CalendarDays } from 'lucide-react';
import { LogoutButton } from './logout-button';

export function DashboardHeader({
  userEmail,
  fullName,
}: {
  userEmail: string | undefined;
  fullName: string | undefined;
}) {
  const { toggle } = useSidebarStore();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-15 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex cursor-pointer"
        onClick={toggle}
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <div className="flex h-14 items-center border-b px-6">
            <a
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-primary"
            >
              <CalendarDays className="h-6 w-6" />
              <span className="">CalenBook</span>
            </a>
          </div>
          <div className="flex-1 mt-4 px-4 overflow-y-auto">
            <SidebarNav />
          </div>
          <div className="p-4 border-t border-border/50">
            <LogoutButton userName={fullName || 'Admin'} variant="sidebar" />
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Aquí podría ir un buscador si es necesario */}
      </div>

      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-medium text-sm">{fullName || 'Admin'}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
            {userEmail?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { SidebarNav } from './sidebar-nav';
import { useSidebarStore } from '@/lib/store/sidebar-store';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

import { LogoutButton } from './logout-button';

export function DashboardSidebar({ userName }: { userName: string }) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={cn(
        'hidden md:block border-r bg-background transition-all duration-300 ease-in-out',
        isOpen ? 'w-[280px]' : 'w-0 border-r-0 overflow-hidden'
      )}
    >
      <div className="flex h-full max-h-screen flex-col gap-2 min-w-[280px]">
        <div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
          <a
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-primary"
          >
            <CalendarDays className="h-6 w-6" />
            <span className="">CalenBook</span>
          </a>
        </div>
        <div className="flex-1 mt-4 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="p-4 border-t border-border/50">
          <LogoutButton userName={userName} variant="sidebar" />
        </div>
      </div>
    </div>
  );
}

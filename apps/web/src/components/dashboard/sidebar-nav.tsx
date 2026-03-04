'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Clock, Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/dashboard',
      label: 'Inicio',
      icon: Home,
      active: pathname === '/dashboard',
    },
    {
      href: '/dashboard/bookings',
      label: 'Reservas',
      icon: CalendarDays,
      active:
        pathname === '/dashboard/bookings' ||
        pathname.startsWith('/dashboard/bookings/'),
    },
    {
      href: '/dashboard/availability',
      label: 'Disponibilidad',
      icon: Clock,
      active: pathname === '/dashboard/availability',
    },
    {
      href: '/dashboard/settings',
      label: 'Ajustes',
      icon: Settings,
      active: pathname === '/dashboard/settings',
    },
  ];

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer',
            route.active
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

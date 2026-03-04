'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Slot {
  time: string;
  status: 'free' | 'busy' | 'pending';
  bookingId?: string;
  guestName?: string;
  guestEmail?: string;
}

interface UnifiedCalendarGridProps {
  slots: Slot[];
  selectedSlot: string | null;
  onSelectSlot: (time: string) => void;
  isOwner?: boolean;
  onManageBooking?: (bookingId: string) => void;
  onCreateBooking?: (time: string) => void;
}

export function UnifiedCalendarGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  isOwner = false,
  onManageBooking,
  onCreateBooking,
}: UnifiedCalendarGridProps) {
  if (slots.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
        <p className="text-sm px-4">
          No hay horarios disponibles para este día.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {slots.map((slot) => {
        const isBusy = slot.status === 'busy';
        const isPending = slot.status === 'pending';
        const isUnavailable = isBusy || isPending;
        const isSelected = selectedSlot === slot.time;

        if (isUnavailable) {
          return (
            <div
              key={slot.time}
              className={cn(
                'relative group flex flex-col items-start p-2 rounded-md border text-xs transition-all',
                isOwner
                  ? isPending
                    ? 'bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/60 cursor-pointer'
                    : 'bg-green-500/10 border-green-500/30 hover:border-green-500/60 cursor-pointer'
                  : 'bg-muted/50 border-muted text-muted-foreground opacity-60'
              )}
              onClick={() =>
                isOwner && slot.bookingId && onManageBooking?.(slot.bookingId)
              }
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold">{slot.time}</span>
                {isOwner && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[9px] px-1 h-4 leading-none flex items-center',
                      isPending
                        ? 'text-yellow-600 border-yellow-600/50'
                        : 'text-green-600 border-green-600/50'
                    )}
                  >
                    {isPending ? 'Pendiente' : 'Confirmado'}
                  </Badge>
                )}
              </div>
              {isOwner && (
                <div className="truncate w-full text-muted-foreground">
                  {slot.guestName || 'Reservado'}
                </div>
              )}
              {!isOwner && <span className="text-[10px]">No disponible</span>}
            </div>
          );
        }

        return (
          <Button
            key={slot.time}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'h-auto flex flex-col items-center py-2 transition-all cursor-pointer shadow-sm',
              isSelected
                ? 'bg-white text-black font-bold border-white hover:bg-white hover:text-black'
                : ''
            )}
            onClick={() => {
              if (isOwner && onCreateBooking) {
                onCreateBooking(slot.time);
              } else {
                onSelectSlot(slot.time);
              }
            }}
          >
            <span className="text-sm font-bold">{slot.time}</span>
            <span className="text-[10px] opacity-70">Disponible</span>
          </Button>
        );
      })}
    </div>
  );
}

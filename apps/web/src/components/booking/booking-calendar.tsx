'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Loader2, ChevronRight } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { es as dateFnsEs } from 'date-fns/locale';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

import { UnifiedCalendarGrid } from './calendar-grid';

export interface Slot {
  time: string;
  status: 'free' | 'busy';
  bookingId?: string;
  guestName?: string;
  guestEmail?: string;
}

export function BookingCalendar({
  scheduleId,
  username,
  isOwner = false,
  onManageBooking,
  onCreateBooking,
}: {
  scheduleId: string;
  username: string;
  isOwner?: boolean;
  onManageBooking?: (bookingId: string) => void;
  onCreateBooking?: (dateStr: string, slot: string) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMonthLoading, setIsMonthLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const slotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleModalClosed = () => setSelectedSlot(null);
    window.addEventListener('booking-modal-closed', handleModalClosed);
    return () =>
      window.removeEventListener('booking-modal-closed', handleModalClosed);
  }, []);

  const fetchMonthAvailability = useCallback(
    async (targetMonth: Date) => {
      setIsMonthLoading(true);
      try {
        const res = await fetch(
          `/api/availability?scheduleId=${scheduleId}&date=${targetMonth.toISOString()}&mode=month`
        );
        const data = await res.json();
        setMonthAvailability(data.days || {});
      } catch (error) {
        console.error('Error fetching month availability:', error);
      } finally {
        setIsMonthLoading(false);
      }
    },
    [scheduleId]
  );

  const fetchSlots = useCallback(
    async (selectedDate: Date) => {
      setIsLoading(true);
      setSelectedSlot(null);
      try {
        const res = await fetch(
          `/api/availability?scheduleId=${scheduleId}&date=${selectedDate.toISOString()}`
        );
        const data = await res.json();
        setSlots(data.slots || []);
        setDuration(data.duration || null);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [scheduleId]
  );

  useEffect(() => {
    fetchMonthAvailability(month);
  }, [month, fetchMonthAvailability]);

  useEffect(() => {
    if (date) {
      fetchSlots(date);
    }
  }, [date, fetchSlots]);

  const handleManageBooking = (bookingId: string) => {
    if (onManageBooking) {
      onManageBooking(bookingId);
      return;
    }
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('manage-booking', {
        detail: { bookingId },
      });
      window.dispatchEvent(event);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDayCellClassNames = (arg: any) => {
    const dateStr = format(arg.date, 'yyyy-MM-dd');
    const status = monthAvailability[dateStr];
    const isPast = arg.date < startOfDay(new Date());

    const classes = ['transition-all', 'cursor-pointer'];

    if (!isOwner && isPast) {
      classes.push(
        'opacity-40',
        'grayscale',
        'pointer-events-none',
        'bg-muted/20'
      );
      return classes;
    }

    if (status === 'unavailable') {
      if (!isOwner) {
        classes.push(
          'opacity-40',
          'grayscale',
          'pointer-events-none',
          'bg-muted/20'
        );
      } else {
        classes.push('opacity-60', 'bg-muted/30');
      }
      return classes;
    }

    if (status === 'full') {
      classes.push('day-full');
      return classes;
    }

    if (status === 'available') {
      classes.push('day-available');
      return classes;
    }

    return classes;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateClick = (arg: any) => {
    const isPast = arg.date < startOfDay(new Date());
    const dateStr = format(arg.date, 'yyyy-MM-dd');

    if (!isOwner && isPast) return;
    if (!isOwner && monthAvailability[dateStr] === 'unavailable') return;

    setDate(arg.date);
    setTimeout(() => {
      slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDatesSet = (arg: any) => {
    // Current viewed month might not completely match the exact visible range depending on the week padding.
    // Taking the middle visible date is a safe way to identify the current viewed month
    const midDate = new Date(
      arg.view.currentStart.getTime() +
        (arg.view.currentEnd.getTime() - arg.view.currentStart.getTime()) / 2
    );
    if (format(midDate, 'yyyy-MM') !== format(month, 'yyyy-MM')) {
      setMonth(midDate);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col xl:flex-row gap-4 w-full">
        <Card className="p-3 md:p-6 flex-1 border-none shadow-none bg-background/50 backdrop-blur-sm relative overflow-hidden">
          <style>{`
            .fc {
                --fc-border-color: rgba(255, 255, 255, 0.1);
                --fc-today-bg-color: rgba(var(--primary), 0.1);
            }
            .fc-toolbar-title {
                font-size: 1.5rem !important;
                font-weight: 700;
                text-transform: capitalize;
            }
            .fc-col-header-cell {
                padding: 10px 0 !important;
                font-weight: 600;
                color: hsl(var(--muted-foreground));
                background-color: transparent !important;
                text-transform: uppercase;
                font-size: 0.875rem;
                border: none !important;
            }
            .fc-scrollgrid {
                border: none !important;
            }
            .fc-theme-standard td, .fc-theme-standard th {
                border-color: rgba(150, 150, 150, 0.1) !important;
            }
            .fc-theme-standard th {
                background-color: transparent !important;
            }
            .fc-daygrid-day-frame {
                min-height: 48px;
                padding: 2px;
            }
            .fc-daygrid-day-top {
                justify-content: center;
                padding-top: 4px;
                font-size: 0.9rem;
            }
            @media (min-width: 768px) {
                .fc-daygrid-day-frame {
                    min-height: 100px;
                    padding: 4px;
                }
                .fc-daygrid-day-top {
                    padding-top: 8px;
                    font-size: 1.1rem;
                }
            }
            /* Available day - soft green */
            .fc-daygrid-day.day-available {
                background-color: rgba(34, 197, 94, 0.15) !important;
            }
            /* Full day - orange */
            .fc-daygrid-day.day-full {
                background-color: rgba(249, 115, 22, 0.1) !important;
            }
            /* Disabled / out-of-range days - hide completely */
            .fc-day-disabled {
                background-color: transparent !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            /* Selected day - soft white */
            .fc-daygrid-day.selected-day .fc-daygrid-day-frame {
                background-color: rgba(255, 255, 255, 0.15) !important;
                border-radius: 8px;
            }
            .fc-daygrid-day.selected-day .fc-daygrid-day-top {
                color: white !important;
                font-weight: bold;
            }
            .fc-daygrid-day.selected-day .fc-day-number {
                color: white !important;
                font-weight: bold;
            }
          `}</style>

          <div className="w-full">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locales={[esLocale]}
              locale="es"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: '',
              }}
              height="auto"
              validRange={{
                start: new Date(),
                end: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  7
                ),
              }}
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              dayCellClassNames={(arg) => {
                const baseClasses = getDayCellClassNames(arg);
                if (
                  date &&
                  format(arg.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                ) {
                  baseClasses.push('selected-day');
                }
                return baseClasses;
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-1 bg-green-400/60 rounded-full" />
              <span className="text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-1 bg-orange-500 rounded-full" />
              <span className="text-muted-foreground">Agotado / Lleno</span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-50">
              <div className="w-4 h-1 bg-muted-foreground/30 rounded-full" />
              <span className="text-muted-foreground">No laborable</span>
            </div>
          </div>
        </Card>

        <div
          ref={slotsRef}
          className="flex flex-col gap-4 w-full xl:w-[450px] shrink-0 scroll-mt-16 xl:self-start"
        >
          <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
            <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
              <Clock className="h-6 w-6" />
              {date
                ? format(date, "EEEE, d 'de' MMMM", { locale: dateFnsEs })
                : 'Selecciona una fecha'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading
                ? 'Cargando horarios...'
                : `${slots.filter((s) => s.status === 'free').length} espacios disponibles`}
            </p>
          </div>

          <ScrollArea className="flex-1 pr-4 -mr-4">
            {isLoading || isMonthLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                <p className="text-sm font-medium">
                  Buscando horarios libres...
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {duration && slots.length > 0 && (
                  <div className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider font-semibold border-b pb-2 mx-8">
                    Sesiones de {duration} min
                  </div>
                )}
                <UnifiedCalendarGrid
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  isOwner={isOwner}
                  onManageBooking={handleManageBooking}
                  onCreateBooking={(time) => {
                    if (onCreateBooking && date) {
                      setSelectedSlot(time);
                      onCreateBooking(format(date, 'yyyy-MM-dd'), time);
                    }
                  }}
                />
              </div>
            )}
          </ScrollArea>

          {selectedSlot && !isOwner && (
            <Button
              className="w-full group cursor-pointer h-12 text-base shadow-lg shadow-primary/20"
              size="lg"
              asChild
            >
              <Link
                href={`/u/${username}/${scheduleId}/book?date=${date?.toISOString()}&slot=${selectedSlot}`}
              >
                Confirmar Reserva
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

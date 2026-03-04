import { createClient } from '@/lib/supabase/server';
import {
  addMinutes,
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
} from 'date-fns';

export async function getAvailableSlots(
  scheduleId: string,
  date: Date,
  isOwner: boolean = false
) {
  const supabase = await createClient();

  // 1. Get the schedule
  const { data: schedule, error: sError } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (sError || !schedule)
    return { slots: [], duration: 0, error: 'Schedule not found' };

  // 2. Check if the day is enabled in weekly_schedule
  const dayIndex = date.getDay().toString();
  const dayName = format(date, 'eeee').toLowerCase();

  let dayConfig = schedule.weekly_schedule[dayIndex];

  if (!dayConfig) {
    // Legacy support fallback
    const legacyConfig = schedule.weekly_schedule[dayName];
    if (legacyConfig && legacyConfig.enabled) {
      dayConfig = legacyConfig.slots;
    }
  }

  if (!dayConfig) {
    // Legacy support or fallback to 'unavailable'
    return {
      slots: [],
      duration: schedule.slot_duration_minutes,
      error: 'El dueño no atiende este día',
    };
  }

  // 3. Generate all possible slots for the day
  const potentialSlots: string[] = [];
  const duration = schedule.slot_duration_minutes;

  const now = new Date();
  const isToday = format(date, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

  dayConfig.forEach((range: { start: string; end: string }) => {
    let current = parseISO(`${format(date, 'yyyy-MM-dd')}T${range.start}`);
    const end = parseISO(`${format(date, 'yyyy-MM-dd')}T${range.end}`);

    while (addMinutes(current, duration) <= end) {
      if (!isToday || current > now) {
        potentialSlots.push(format(current, 'HH:mm'));
      }
      current = addMinutes(current, duration);
    }
  });

  // 4. Get bookings for the day
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, start_time, guest_name, guest_email, status')
    .eq('schedule_id', scheduleId)
    .gte('start_time', startOfDay(date).toISOString())
    .lte('start_time', endOfDay(date).toISOString())
    .neq('status', 'cancelled');

  const bookedSlotsMap = new Map(
    bookings?.map((b) => [
      format(parseISO(b.start_time), 'HH:mm'),
      {
        id: b.id,
        guestName: isOwner ? b.guest_name : null,
        guestEmail: isOwner ? b.guest_email : null,
        status: b.status,
      },
    ]) || []
  );

  const slots = potentialSlots.map((time) => {
    const booking = bookedSlotsMap.get(time);

    // Map database status to UI slot status
    let status: 'free' | 'busy' | 'pending' = 'free';
    if (booking) {
      status = booking.status === 'pending' ? 'pending' : 'busy';
    }

    return {
      time,
      status,
      bookingId: booking?.id,
      guestName: booking?.guestName,
      guestEmail: booking?.guestEmail,
    };
  });

  return { slots, duration, error: null };
}

export async function getMonthAvailability(scheduleId: string, month: Date) {
  const supabase = await createClient();

  // 1. Get the schedule
  const { data: schedule, error: sError } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', scheduleId)
    .single();

  if (sError || !schedule) return { days: {}, error: 'Schedule not found' };

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  // 2. Get all bookings for the month at once
  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time')
    .eq('schedule_id', scheduleId)
    .gte('start_time', start.toISOString())
    .lte('start_time', end.toISOString())
    .neq('status', 'cancelled');

  const bookingCountsByDay = new Map<string, number>();
  bookings?.forEach((b) => {
    const dayKey = format(parseISO(b.start_time), 'yyyy-MM-dd');
    bookingCountsByDay.set(dayKey, (bookingCountsByDay.get(dayKey) || 0) + 1);
  });

  const availability: Record<string, 'available' | 'full' | 'unavailable'> = {};
  const today = startOfDay(new Date());

  days.forEach((day) => {
    const dayKey = format(day, 'yyyy-MM-dd');

    // Past days are unavailable
    if (isBefore(day, today)) {
      availability[dayKey] = 'unavailable';
      return;
    }

    const dayIndex = day.getDay().toString();
    const dayName = format(day, 'eeee').toLowerCase();
    let dayConfig = schedule.weekly_schedule[dayIndex];

    if (!dayConfig) {
      const legacyConfig = schedule.weekly_schedule[dayName];
      if (legacyConfig && legacyConfig.enabled) {
        dayConfig = legacyConfig.slots;
      }
    }

    if (!dayConfig) {
      availability[dayKey] = 'unavailable';
      return;
    }

    let potentialSlotsCount = 0;
    const duration = schedule.slot_duration_minutes;
    dayConfig.forEach((range: { start: string; end: string }) => {
      let current = parseISO(`${dayKey}T${range.start}`);
      const rangeEnd = parseISO(`${dayKey}T${range.end}`);
      while (addMinutes(current, duration) <= rangeEnd) {
        potentialSlotsCount++;
        current = addMinutes(current, duration);
      }
    });

    const bookedCount = bookingCountsByDay.get(dayKey) || 0;

    if (potentialSlotsCount === 0) {
      availability[dayKey] = 'unavailable';
    } else if (bookedCount >= potentialSlotsCount) {
      availability[dayKey] = 'full';
    } else {
      availability[dayKey] = 'available';
    }
  });

  return { days: availability, error: null };
}

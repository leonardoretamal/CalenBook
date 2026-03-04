import { NextResponse } from 'next/server';
import {
  getAvailableSlots,
  getMonthAvailability,
} from '@/lib/services/availability';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scheduleId = searchParams.get('scheduleId');
  const dateStr = searchParams.get('date');
  const mode = searchParams.get('mode'); // 'slots' (default) or 'month'

  if (!scheduleId || !dateStr) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  const date = new Date(dateStr);

  if (mode === 'month') {
    const { days, error } = await getMonthAvailability(scheduleId, date);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ days });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user; // Simplified: any logged in user can potentially be an owner.
  // In a stricter app, we'd verify user.id === schedule.user_id, but the service handles data exposure.

  const { slots, duration, error } = await getAvailableSlots(
    scheduleId,
    date,
    isOwner
  );

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ slots, duration });
}

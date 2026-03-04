import { createClient } from '@/lib/supabase/server';
import { BookingsClient } from './components/bookings-client';

export default async function BookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch bookings with schedule name
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, schedules(name)')
    .eq('owner_id', user?.id)
    .neq('status', 'cancelled')
    .order('start_time', { ascending: false });

  // Fetch schedules for the manual booking modal and calendar view
  const { data: schedules } = await supabase
    .from('schedules')
    .select('id, name')
    .eq('owner_id', user?.id)
    .eq('is_active', true);

  return (
    <BookingsClient
      initialBookings={bookings || []}
      schedules={schedules || []}
      user={user}
    />
  );
}

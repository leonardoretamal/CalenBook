'use server';

import { createClient } from '@/lib/supabase/server';
import { addMinutes, parseISO } from 'date-fns';

export async function createBooking(formData: {
  scheduleId: string;
  username: string;
  date: string;
  slot: string;
  guestName: string;
  guestEmail: string;
  notes?: string;
  isManual?: boolean;
}) {
  const supabase = await createClient();

  // 1. Get schedule to know duration and owner_id
  const { data: schedule } = await supabase
    .from('schedules')
    .select('owner_id, slot_duration_minutes, name')
    .eq('id', formData.scheduleId)
    .single();

  if (!schedule) {
    return { error: 'No se encontró la agenda' };
  }

  // 2. Calculate start and end time
  const startTime = parseISO(
    `${formData.date.split('T')[0]}T${formData.slot}:00`
  );
  const endTime = addMinutes(startTime, schedule.slot_duration_minutes);

  // Check if owner
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === schedule.owner_id;

  // Manual bookings from dashboard are confirmed immediately
  // Public bookings are ALWAYS pending (even if tested by owner)
  const isActuallyManual = formData.isManual && isOwner;

  const insertData = {
    schedule_id: formData.scheduleId,
    owner_id: schedule.owner_id,
    guest_name: formData.guestName,
    guest_email: formData.guestEmail,
    notes: formData.notes || null,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: isActuallyManual ? 'confirmed' : 'pending',
  };

  // 3. Insert booking
  let dbResult;
  if (isActuallyManual && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient: createSupabaseClient } =
      await import('@supabase/supabase-js');
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    dbResult = await adminSupabase
      .from('bookings')
      .insert(insertData)
      .select()
      .single();
  } else {
    dbResult = await supabase
      .from('bookings')
      .insert(insertData)
      .select()
      .single();
  }

  const { data, error } = dbResult;

  if (error) {
    console.error('Booking error:', error);
    if (error.code === '23P01') {
      return {
        error: 'Este horario ya no está disponible. Por favor elige otro.',
      };
    }
    return {
      error: `Error DB: ${error.message || error.details || error.code || 'Desconocido'}`,
    };
  }

  // 4. Sync with Google Calendar (ONLY if isActuallyManual)
  // Public flow must confirm via email first (even for owners testing)
  if (isActuallyManual) {
    try {
      const { createGoogleCalendarEvent } =
        await import('@/lib/services/google-calendar');
      await createGoogleCalendarEvent({
        ownerId: schedule.owner_id,
        summary: `Reserva Manual: ${formData.guestName} - ${schedule.name}`,
        description: `Reserva manual creada desde el dashboard.\nCliente: ${formData.guestName}\nEmail: ${formData.guestEmail}${formData.notes ? `\n\nNotas:\n${formData.notes}` : ''}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        guestEmail: formData.guestEmail,
      });
    } catch (gError) {
      console.error('Google Calendar Sync failed (non-blocking):', gError);
    }
  }

  // 5. Send Email (Invitation/Confirmation)
  try {
    const { sendBookingConfirmationEmail } =
      await import('@/lib/services/email');
    const emailResult = await sendBookingConfirmationEmail({
      guestEmail: formData.guestEmail,
      guestName: formData.guestName,
      startTime: startTime.toLocaleString('es-CL'),
      scheduleName: schedule.name,
      bookingId: data.id,
    });

    if (!emailResult.success) {
      console.error('Email send failed:', emailResult.error);
    }
  } catch (eError) {
    console.error('Email notification failed (non-blocking):', eError);
  }

  return { success: true, bookingId: data.id };
}

export async function confirmBooking(bookingId: string) {
  // Use admin client since the guest clicking the email link is NOT authenticated
  // The regular supabase client would be blocked by RLS
  const { createClient: createSupabaseClient } =
    await import('@supabase/supabase-js');

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY not set');
    return { error: 'Error de configuración del servidor.' };
  }

  const adminSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 1. Get booking data
  const { data: booking, error: fetchError } = await adminSupabase
    .from('bookings')
    .select('*, schedules(name, owner_id)')
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) {
    console.error('Error fetching booking for confirmation:', fetchError);
    return { error: 'No se encontró la reserva.' };
  }

  if (booking.status === 'confirmed') {
    return { success: true, message: 'La reserva ya estaba confirmada.' };
  }

  // 2. Update status to confirmed
  const { error: updateError } = await adminSupabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId);

  if (updateError) {
    console.error('Error updating booking status:', updateError);
    return { error: 'No se pudo confirmar la reserva.' };
  }

  // 3. Sync with Google Calendar (using admin client to read owner's refresh token)
  try {
    const { createGoogleCalendarEvent } =
      await import('@/lib/services/google-calendar');
    const eventId = await createGoogleCalendarEvent({
      ownerId: booking.owner_id,
      summary: `Reserva: ${booking.guest_name} - ${booking.schedules.name}`,
      description: `Reserva confirmada vía email.\nCliente: ${booking.guest_name}\nEmail: ${booking.guest_email}`,
      startTime: booking.start_time,
      endTime: booking.end_time,
      guestEmail: booking.guest_email,
      supabaseClient: adminSupabase,
    });

    if (eventId) {
      await adminSupabase
        .from('bookings')
        .update({ calendar_event_id: eventId })
        .eq('id', bookingId);
    }
  } catch (gError) {
    console.error('Confirm Google Sync failed:', gError);
  }

  return { success: true };
}

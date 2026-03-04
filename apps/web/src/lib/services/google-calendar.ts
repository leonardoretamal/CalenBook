import { createClient } from '@/lib/supabase/server';
import { google } from 'googleapis';

/**
 * Gets a fresh access token using the stored refresh token for the owner
 */
async function getAccessToken(ownerId: string, supabaseClient?: any) {
  const supabase = supabaseClient || (await createClient());

  const { data: owner } = await supabase
    .from('owners')
    .select('google_refresh_token')
    .eq('id', ownerId)
    .single();

  if (!owner?.google_refresh_token) {
    console.log(
      'No se encontró refresh token de Google para el owner:',
      ownerId
    );
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: owner.google_refresh_token,
  });

  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error al refrescar el access token de Google:', error);
    return null;
  }
}

export async function createGoogleCalendarEvent({
  ownerId,
  summary,
  description,
  startTime,
  endTime,
  guestEmail,
  supabaseClient,
}: {
  ownerId: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  guestEmail: string;
  supabaseClient?: any;
}) {
  console.log('🗓️ [Google Calendar] Iniciando creación de evento...');
  console.log('🗓️ [Google Calendar] Owner:', ownerId);
  console.log('🗓️ [Google Calendar] Horario:', startTime, '->', endTime);

  const token = await getAccessToken(ownerId, supabaseClient);

  if (!token) {
    console.warn('🗓️ [Google Calendar] ❌ No hay token disponible. Omitiendo.');
    return null;
  }

  console.log('🗓️ [Google Calendar] ✅ Token obtenido, creando evento...');

  const eventBody = {
    summary,
    description,
    start: { dateTime: startTime, timeZone: 'America/Santiago' },
    end: { dateTime: endTime, timeZone: 'America/Santiago' },
    attendees: [{ email: guestEmail }],
    reminders: { useDefault: true },
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        '🗓️ [Google Calendar] ❌ Error API:',
        JSON.stringify(errorData, null, 2)
      );
      return null;
    }

    const data = await response.json();
    console.log(
      '🗓️ [Google Calendar] ✅ Evento creado:',
      data.id,
      '| Link:',
      data.htmlLink
    );
    return data.id;
  } catch (error) {
    console.error('🗓️ [Google Calendar] ❌ Error inesperado:', error);
    return null;
  }
}

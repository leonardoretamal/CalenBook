import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const ownerId = searchParams.get('state'); // El user_id que pasamos en el state

  if (!code || !ownerId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=Google OAuth failed`
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      // Si no hay refresh_token, es porque ya lo teníamos y el usuario no 're-consintió'
      // Ocurre menos si usamos prompt: 'consent'
      console.warn('No se recibió refresh_token de Google');
    }

    // Guardar el refresh token en la tabla 'owners'
    const supabase = await createClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (tokens.refresh_token) {
      updateData.google_refresh_token = tokens.refresh_token;
    }

    const { error } = await supabase
      .from('owners')
      .update(updateData)
      .eq('id', ownerId);

    if (error) {
      console.error('Error al guardar token de Google:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=Database update failed`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=Google Calendar conectado`
    );
  } catch (error) {
    console.error('Error en Google OAuth Callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=Unexpected error`
    );
  }
}

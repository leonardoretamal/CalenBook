'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateProfileName(fullName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'No autorizado' };
  }

  // 0. Uniqueness check (slugified comparison)
  const newSlug = fullName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const { data: owners } = await supabase
    .from('owners')
    .select('full_name')
    .neq('id', user.id);

  if (owners) {
    const isDuplicate = owners.some((o) => {
      const existingSlug = o.full_name
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return existingSlug === newSlug;
    });

    if (isDuplicate) {
      return {
        success: false,
        error: 'Este nombre ya está en uso por otro usuario (slug colisión).',
      };
    }
  }

  // Update in auth.users (raw_user_meta_data)
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (authError) {
    console.error('Error updating auth user metadata:', authError);
    return { success: false, error: 'No se pudo actualizar el metadata' };
  }

  // Also update in the owners table
  const { error: dbError } = await supabase
    .from('owners')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (dbError) {
    console.error('Error updating owners table:', dbError);
    return {
      success: false,
      error: 'No se pudo actualizar el nombre en la base de datos',
    };
  }

  return { success: true };
}

export async function disconnectGoogleCalendar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'No autorizado' };
  }

  // Set the refresh token and credentials to null
  const { error } = await supabase
    .from('owners')
    .update({
      google_refresh_token: null,
      google_calendar_id: null,
      google_sync_enabled: false,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error disconnecting Google account:', error);
    return {
      success: false,
      error: 'Error al desconectar la cuenta de Google',
    };
  }

  return { success: true };
}

export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword?: string;
  newPassword?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, error: 'No autorizado' };
  }

  if (!currentPassword || !newPassword) {
    return { success: false, error: 'Faltan parámetros' };
  }

  // 1. Verify current password by trying to log in with it
  // (Supabase doesn't have a direct "verify password" for logged in users,
  // we must re-authenticate them, then restore their session if needed,
  // but since signInWithPassword updates the session, it works).
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      error: 'La contraseña actual ingresada es incorrecta',
    };
  }

  // 2. If valid, update to the new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error('Error updating password:', updateError);
    return {
      success: false,
      error: 'Error al actualizar la contraseña',
    };
  }

  return { success: true };
}

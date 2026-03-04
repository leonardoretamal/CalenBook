'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(
  prevState: { error: string | null },
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}

export async function signup(
  prevState: { error: string | null; success: boolean; message?: string },
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  // Si requiere confirmación de email (porque está activo en Supabase)
  // session será null a pesar de que no hay error.
  if (data.user && !data.session) {
    return {
      error: null,
      success: true,
      message: 'Cuenta creada. Revisa tu correo electrónico para confirmar.',
    };
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

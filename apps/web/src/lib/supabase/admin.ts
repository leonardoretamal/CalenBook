import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente admin que ignora toda política RLS.
 * ⚠️ NUNCA USAR EN COMPONENTES DEL CLIENTE (navegador).
 * Solo se usa en Server Actions seguros o en lógicas muy específicas
 * de orquestación donde el acceso seguro está garantizado.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

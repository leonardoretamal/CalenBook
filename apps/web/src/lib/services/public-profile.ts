import { createClient } from '@/lib/supabase/server';

export async function getOwnerProfileAndSchedules(slug: string) {
  const supabase = await createClient();

  // For now, we find by ID if the slug looks like a UUID,
  // or we try to find by full_name slug in user_metadata.
  // Ideally, a 'profiles' table would have a 'username' column.

  // Simplified query for now: search in auth users via a RPC or just assume the 'slug' is the user_id for testing
  // OR search in schedules metadata since we don't have a formal username field yet.

  // BEST APPROACH: Let's create a temporary search by ID.
  // If the user wants specific slugs, we'll need a profile table soon.

  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      slug
    );

  let userId: string | null = null;

  if (isUUID) {
    userId = slug;
  } else {
    // Strategy: Search for owner whose slugified full_name matches the provided slug
    // We fetch all and filter in JS for now as SQLite/PG slugify logic in SQL is complex
    const { data: owners } = await supabase
      .from('owners')
      .select('id, full_name');

    if (owners) {
      const matchedOwner = owners.find((o) => {
        const ownerSlug = o.full_name
          .toLowerCase()
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with -
          .replace(/-+/g, '-') // Collapse multiple -
          .replace(/^-|-$/g, ''); // Trim -
        return ownerSlug === slug.toLowerCase();
      });

      if (matchedOwner) {
        userId = matchedOwner.id;
      }
    }
  }

  if (!userId) {
    return { error: 'No se encontró al propietario', schedules: null };
  }

  const { data: schedules, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('owner_id', userId)
    .eq('is_active', true);

  if (error || !schedules || schedules.length === 0) {
    return { error: 'No se encontraron agendas activas', schedules: null };
  }

  return { schedules, error: null };
}

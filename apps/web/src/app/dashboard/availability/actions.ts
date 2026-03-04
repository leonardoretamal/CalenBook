'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  createScheduleSchema,
  type CreateScheduleDTO,
} from '@calenbook/shared';

// Get user's schedules
export async function getSchedules() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }

  return data;
}

// Create new schedule
export async function createSchedule(data: CreateScheduleDTO) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autorizado' };

  // Validate backend
  const parsed = createScheduleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Datos inválidos' };
  }

  // Deactivate other schedules if this one is active
  if (data.is_active) {
    await supabase
      .from('schedules')
      .update({ is_active: false })
      .eq('owner_id', user.id);
  }

  const { error } = await supabase.from('schedules').insert([
    {
      owner_id: user.id,
      name: data.name,
      is_active: data.is_active,
      weekly_schedule: data.weekly_schedule, // as JSONB
      slot_duration_minutes: data.slot_duration_minutes,
    },
  ]);

  if (error) {
    console.error('Error creating schedule:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/availability');
  return { success: true };
}

// Update schedule
export async function updateSchedule(
  scheduleId: string,
  data: CreateScheduleDTO
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autorizado' };

  // Validate backend
  const parsed = createScheduleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Datos inválidos' };
  }

  // Deactivate other schedules if this one is active
  if (data.is_active) {
    await supabase
      .from('schedules')
      .update({ is_active: false })
      .eq('owner_id', user.id)
      .neq('id', scheduleId);
  }

  const { error } = await supabase
    .from('schedules')
    .update({
      name: data.name,
      is_active: data.is_active,
      weekly_schedule: data.weekly_schedule, // as JSONB
      slot_duration_minutes: data.slot_duration_minutes,
    })
    .eq('id', scheduleId)
    .eq('owner_id', user.id);

  if (error) {
    console.error('Error updating schedule:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/availability');
  return { success: true };
}

// Set active schedule
export async function setActiveSchedule(scheduleId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autorizado' };

  // Deactivate all
  await supabase
    .from('schedules')
    .update({ is_active: false })
    .eq('owner_id', user.id);

  // Activate target
  const { error } = await supabase
    .from('schedules')
    .update({ is_active: true })
    .eq('id', scheduleId)
    .eq('owner_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/availability');
  return { success: true };
}

export async function deleteSchedule(scheduleId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'No autorizado' };

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', scheduleId)
    .eq('owner_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/availability');
  return { success: true };
}

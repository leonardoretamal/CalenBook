-- 006_create_rls_policies.sql
-- Habilita Row Level Security y crea políticas estrictas para todas las tablas.

-- 1. Habilitar RLS en todas las tablas
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Políticas para OWNERS
-- ----------------------------------------------------

-- Los dueños pueden ver su propio perfil
CREATE POLICY "Owners can view own profile"
ON owners FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Los dueños pueden actualizar su propio perfil
CREATE POLICY "Owners can update own profile"
ON owners FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- No hay política de INSERT porque lo maneja el trigger del Paso 4 (SECURITY DEFINER)
-- No hay política de DELETE porque se borra en cascada desde auth.users

-- ----------------------------------------------------
-- Políticas para SCHEDULES
-- ----------------------------------------------------

-- Todo el mundo (público) puede ver agendas activas
CREATE POLICY "Public can view active schedules"
ON schedules FOR SELECT
TO public
USING (is_active = true);

-- Los dueños pueden ver TODAS sus agendas (incluso inactivas)
CREATE POLICY "Owners can view all their schedules"
ON schedules FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- Los dueños pueden insertar agendas
CREATE POLICY "Owners can insert schedules"
ON schedules FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Los dueños pueden actualizar sus agendas
CREATE POLICY "Owners can update their schedules"
ON schedules FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Los dueños pueden eliminar sus agendas
CREATE POLICY "Owners can delete their schedules"
ON schedules FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- ----------------------------------------------------
-- Políticas para BOOKINGS
-- ----------------------------------------------------

-- Solo los dueños pueden ver las reservas a nivel de tabla
-- (La disponibilidad pública se calcula vía la función get_bookings_for_date)
CREATE POLICY "Owners can view their bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- El público puede insertar reservas TODO el tiempo, SI:
-- 1. El estado es "pending"
-- 2. El owner_id corresponde al schedule, y el schedule está activo
CREATE POLICY "Public can insert pending bookings"
ON bookings FOR INSERT
TO public
WITH CHECK (
    status = 'pending' AND 
    owner_id = (SELECT owner_id FROM schedules WHERE id = schedule_id AND is_active = true)
);

-- Los dueños pueden actualizar sus reservas (confirmar, cancelar, agregar notas)
CREATE POLICY "Owners can update their bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Los dueños pueden eliminar reservas
CREATE POLICY "Owners can delete their bookings"
ON bookings FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

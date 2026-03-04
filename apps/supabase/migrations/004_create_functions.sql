-- 004_create_functions.sql
-- Database functions for availability queries

-- Returns non-cancelled bookings for a schedule on a specific date
-- Used to calculate available slots on the frontend
CREATE OR REPLACE FUNCTION get_bookings_for_date(
    p_schedule_id UUID,
    p_date DATE
)
RETURNS TABLE (
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT b.start_time, b.end_time
    FROM bookings b
    WHERE b.schedule_id = p_schedule_id
      AND b.status != 'cancelled'
      AND b.start_time >= p_date::TIMESTAMPTZ
      AND b.start_time < (p_date + INTERVAL '1 day')::TIMESTAMPTZ
    ORDER BY b.start_time;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_bookings_for_date IS 'Returns non-cancelled bookings for a schedule on a specific date. Used to calculate available slots.';

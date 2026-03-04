-- 003_create_bookings.sql
-- Creates the bookings table with overlap prevention via exclusion constraint

CREATE TABLE bookings (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id       UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    owner_id          UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    guest_name        TEXT NOT NULL,
    guest_email       TEXT NOT NULL,
    start_time        TIMESTAMPTZ NOT NULL,
    end_time          TIMESTAMPTZ NOT NULL,
    status            TEXT NOT NULL DEFAULT 'pending',
    calendar_event_id TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Constraints
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_guest_name
    CHECK (LENGTH(TRIM(guest_name)) > 0 AND LENGTH(TRIM(guest_name)) <= 100);

ALTER TABLE bookings ADD CONSTRAINT chk_bookings_guest_email
    CHECK (guest_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');

ALTER TABLE bookings ADD CONSTRAINT chk_bookings_time_order
    CHECK (end_time > start_time);

ALTER TABLE bookings ADD CONSTRAINT chk_bookings_status
    CHECK (status IN ('pending', 'confirmed', 'cancelled'));

ALTER TABLE bookings ADD CONSTRAINT chk_bookings_notes_length
    CHECK (notes IS NULL OR LENGTH(notes) <= 500);

-- Prevent overlapping bookings at database level
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings ADD CONSTRAINT excl_bookings_no_overlap
    EXCLUDE USING GIST (
        schedule_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    )
    WHERE (status != 'cancelled');

-- Indexes
CREATE INDEX idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status) WHERE status != 'cancelled';

-- Composite index for owner dashboard (most common query)
CREATE INDEX idx_bookings_owner_upcoming
    ON bookings(owner_id, start_time)
    WHERE status != 'cancelled';

-- Auto-update updated_at
CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE bookings IS 'Appointments booked by public users';
COMMENT ON COLUMN bookings.owner_id IS 'Denormalized from schedules for direct RLS and faster queries';
COMMENT ON COLUMN bookings.calendar_event_id IS 'Google Calendar event ID, set after sync';

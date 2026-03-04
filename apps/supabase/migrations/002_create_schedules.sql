-- 002_create_schedules.sql
-- Creates the schedules table for owner availability configuration

CREATE TABLE schedules (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id              UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    name                  TEXT NOT NULL,
    slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
    buffer_minutes        INTEGER NOT NULL DEFAULT 0,
    max_advance_days      INTEGER NOT NULL DEFAULT 30,
    weekly_schedule       JSONB NOT NULL DEFAULT '{}',
    is_active             BOOLEAN NOT NULL DEFAULT true,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Constraints
ALTER TABLE schedules ADD CONSTRAINT chk_schedules_name
    CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE schedules ADD CONSTRAINT chk_schedules_slot_duration
    CHECK (slot_duration_minutes BETWEEN 5 AND 480);

ALTER TABLE schedules ADD CONSTRAINT chk_schedules_buffer
    CHECK (buffer_minutes BETWEEN 0 AND 120);

ALTER TABLE schedules ADD CONSTRAINT chk_schedules_max_advance
    CHECK (max_advance_days BETWEEN 1 AND 365);

-- Only one active schedule per owner (partial unique index)
CREATE UNIQUE INDEX idx_schedules_active_owner
    ON schedules(owner_id)
    WHERE is_active = true;

-- Index for owner lookup
CREATE INDEX idx_schedules_owner_id ON schedules(owner_id);

-- Auto-update updated_at
CREATE TRIGGER trg_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE schedules IS 'Availability configuration for each owner';
COMMENT ON COLUMN schedules.weekly_schedule IS 'JSONB: { "1": [{"start":"09:00","end":"12:00"}], ... } where keys are DayOfWeek (0=Sunday)';
COMMENT ON COLUMN schedules.slot_duration_minutes IS 'Duration of each bookable slot in minutes';
COMMENT ON COLUMN schedules.buffer_minutes IS 'Buffer time between consecutive bookings';

-- 001_create_extensions_and_owners.sql
-- Creates base extensions and the owners table linked to Supabase Auth

-- Extension for cryptographically secure UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Owners table (synced with Supabase Auth)
CREATE TABLE owners (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT NOT NULL UNIQUE,
    full_name   TEXT NOT NULL,
    timezone    TEXT NOT NULL DEFAULT 'America/Santiago',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Constraint: valid email format
ALTER TABLE owners ADD CONSTRAINT chk_owners_email
    CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$');

-- Constraint: non-empty name
ALTER TABLE owners ADD CONSTRAINT chk_owners_full_name
    CHECK (LENGTH(TRIM(full_name)) > 0);

-- Constraint: non-empty timezone
ALTER TABLE owners ADD CONSTRAINT chk_owners_timezone
    CHECK (LENGTH(timezone) > 0);

-- Index for email lookup
CREATE INDEX idx_owners_email ON owners(email);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_owners_updated_at
    BEFORE UPDATE ON owners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE owners IS 'Owners who configure their availability for bookings';
COMMENT ON COLUMN owners.id IS 'References auth.users(id) from Supabase Auth';
COMMENT ON COLUMN owners.timezone IS 'IANA timezone identifier (e.g., America/Santiago)';

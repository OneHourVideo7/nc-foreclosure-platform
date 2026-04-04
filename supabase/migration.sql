-- NC Foreclosure Platform — Supabase Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Drop existing table if you want a fresh start
-- DROP TABLE IF EXISTS properties CASCADE;

CREATE TABLE IF NOT EXISTS properties (
  id              BIGSERIAL PRIMARY KEY,
  county          TEXT NOT NULL,
  address         TEXT NOT NULL,
  parcel_id       TEXT,
  sale_date       TIMESTAMPTZ,
  opening_bid     NUMERIC(12,2),
  current_bid     NUMERIC(12,2),
  close_date      TIMESTAMPTZ,
  property_type   TEXT,
  court_file      TEXT,
  our_file        TEXT,
  sale_status     TEXT,
  source          TEXT NOT NULL DEFAULT 'Kania Law Firm',
  owner_name      TEXT,
  state           TEXT NOT NULL DEFAULT 'NC',

  -- Enrichment fields (populated via Regrid / NC OneMap)
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  assessed_value  NUMERIC(12,2),
  acreage         NUMERIC(10,4),
  year_built      INTEGER,
  zoning          TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_properties_county ON properties (county);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties (property_type);
CREATE INDEX IF NOT EXISTS idx_properties_source ON properties (source);
CREATE INDEX IF NOT EXISTS idx_properties_state ON properties (state);
CREATE INDEX IF NOT EXISTS idx_properties_sale_date ON properties (sale_date);
CREATE INDEX IF NOT EXISTS idx_properties_address_trgm ON properties USING gin (address gin_trgm_ops);

-- Full-text search helper
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(address, '') || ' ' || coalesce(county, '') || ' ' || coalesce(parcel_id, '') || ' ' || coalesce(owner_name, ''))
  ) STORED;
CREATE INDEX IF NOT EXISTS idx_properties_fts ON properties USING gin (fts);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_properties_updated_at ON properties;
CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row-Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key)
DROP POLICY IF EXISTS "Public read access" ON properties;
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);

-- Only service_role can insert/update/delete
DROP POLICY IF EXISTS "Service role full access" ON properties;
CREATE POLICY "Service role full access" ON properties
  FOR ALL USING (auth.role() = 'service_role');

-- Scrape runs tracking table
CREATE TABLE IF NOT EXISTS scrape_runs (
  id          BIGSERIAL PRIMARY KEY,
  source      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  record_count INTEGER DEFAULT 0,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error       TEXT,
  metadata    JSONB
);

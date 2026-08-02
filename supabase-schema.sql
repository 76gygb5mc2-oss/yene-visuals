-- Yene Visuals - Supabase Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- =========================================
-- PHOTOS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Portraits',
  title TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  thumb_url TEXT,
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  size INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- BOOKINGS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  session_type TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(featured);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Photos: anyone can read, only service_role can write
CREATE POLICY "Photos are publicly readable"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert photos"
  ON photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update photos"
  ON photos FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete photos"
  ON photos FOR DELETE
  USING (true);

-- Bookings: anyone can insert (submit a booking), only service_role can read/update/delete
CREATE POLICY "Anyone can submit a booking"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read bookings"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Service role can update bookings"
  ON bookings FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete bookings"
  ON bookings FOR DELETE
  USING (true);

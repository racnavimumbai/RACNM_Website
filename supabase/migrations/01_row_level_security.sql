-- =====================================================================
-- ROTARACT CLUB OF NAVI MUMBAI (RCNM)
-- DATABASE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
-- Execute this migration in your Supabase SQL Editor to enforce strict
-- access control and prevent anonymous tampering or unauthorized reads.
-- =====================================================================

-- 1. Enable Row Level Security (RLS) on all production tables
ALTER TABLE IF EXISTS initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS editorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS join_applications ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 2. PUBLIC READ POLICIES (Anonymous / Public Visitors)
-- ---------------------------------------------------------------------

-- Initiatives: Anyone can view initiatives
DROP POLICY IF EXISTS "Public can view initiatives" ON initiatives;
CREATE POLICY "Public can view initiatives"
  ON initiatives
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Events: Public can view published events
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Gallery: Anyone can view gallery photos
DROP POLICY IF EXISTS "Public can view gallery photos" ON gallery_photos;
CREATE POLICY "Public can view gallery photos"
  ON gallery_photos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Editorials: Public can view published editorial bulletins
DROP POLICY IF EXISTS "Public can view published editorials" ON editorials;
CREATE POLICY "Public can view published editorials"
  ON editorials
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Board Members: Anyone can view leadership directory
DROP POLICY IF EXISTS "Public can view board members" ON board_members;
CREATE POLICY "Public can view board members"
  ON board_members
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------
-- 3. JOIN APPLICATIONS POLICIES
-- ---------------------------------------------------------------------

-- Public can submit new membership applications with 'pending' status
DROP POLICY IF EXISTS "Public can submit join application" ON join_applications;
CREATE POLICY "Public can submit join application"
  ON join_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' OR status IS NULL);

-- Anonymous users CANNOT read or delete applications (protects PII)
-- Only authenticated administrators can view or manage submitted applications
DROP POLICY IF EXISTS "Admins can view and manage applications" ON join_applications;
CREATE POLICY "Admins can view and manage applications"
  ON join_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 4. ADMINISTRATIVE POLICIES (Authenticated Admins Full CRUD)
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can manage initiatives" ON initiatives;
CREATE POLICY "Admins can manage initiatives"
  ON initiatives
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery_photos;
CREATE POLICY "Admins can manage gallery"
  ON gallery_photos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage editorials" ON editorials;
CREATE POLICY "Admins can manage editorials"
  ON editorials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage board members" ON board_members;
CREATE POLICY "Admins can manage board members"
  ON board_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

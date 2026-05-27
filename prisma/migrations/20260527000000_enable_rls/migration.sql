-- Enable Row Level Security on all tables
-- Prisma uses the postgres role (superuser) which bypasses RLS — app is unaffected.
-- These policies block direct PostgREST / anon-key access from the outside.

ALTER TABLE "Funeral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Guestbook" ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────
-- Funeral policies
-- ──────────────────────────────────────────────

-- Public: read only published funerals
CREATE POLICY "public_read_published_funerals"
  ON "Funeral"
  FOR SELECT
  TO anon, authenticated
  USING ("isPublished" = true);

-- No INSERT / UPDATE / DELETE via anon key — admin uses Prisma (postgres role)

-- ──────────────────────────────────────────────
-- Guestbook policies
-- ──────────────────────────────────────────────

-- Public: read approved guestbook entries
CREATE POLICY "public_read_approved_guestbook"
  ON "Guestbook"
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Public: insert new guestbook entries (app-layer rate limiting still applies)
CREATE POLICY "public_insert_guestbook"
  ON "Guestbook"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No UPDATE / DELETE via anon key

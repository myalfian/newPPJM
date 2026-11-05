-- Migration: 20261105_user_registrations.sql
-- Pending user registration requests processed by Super Admin

CREATE TABLE IF NOT EXISTS public.user_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  requested_role text NOT NULL DEFAULT 'santri',
  alamat text,
  alasan text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: guests can insert, only authenticated users can read
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guests can insert registration requests" ON public.user_registrations;
CREATE POLICY "Guests can insert registration requests" ON public.user_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view registrations" ON public.user_registrations;
CREATE POLICY "Authenticated users can view registrations" ON public.user_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_registrations_updated_at ON public.user_registrations;
CREATE TRIGGER update_user_registrations_updated_at
  BEFORE UPDATE ON public.user_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for super admin review queue
CREATE INDEX IF NOT EXISTS idx_user_registrations_status_created
  ON public.user_registrations(status, created_at DESC);

-- Index for lookup by email
CREATE INDEX IF NOT EXISTS idx_user_registrations_email
  ON public.user_registrations(email);

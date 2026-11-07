-- Migration: 20261109_slider_settings_and_audit.sql
-- Description: Hardening site_settings for global slider settings, RLS restriction for super_admin, and audit logging.

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Insert initial default for slider_settings if missing
INSERT INTO public.site_settings (key, value, description)
VALUES (
  'slider_settings',
  '{"autoplayInterval": 5.0, "transitionSpeed": 500, "transitionEffect": "slide", "isAutoplayEnabled": true, "pauseOnHover": true}'::jsonb,
  'Pengaturan kecepatan, durasi transisi, dan autoplay slider global website PPJM'
)
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description;

-- 3. RLS Policies: Public read, Super Admin only write
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Super Admin write site_settings" ON public.site_settings;
CREATE POLICY "Super Admin write site_settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
  );

-- 4. Audit logging trigger for site_settings
CREATE OR REPLACE FUNCTION public.log_site_settings_mutation()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_user_email text;
  v_user_role text;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NOT NULL THEN
    SELECT email, role INTO v_user_email, v_user_role
    FROM public.profiles
    WHERE id = v_user_id;
  END IF;

  INSERT INTO public.audit_logs (
    user_id,
    user_email,
    user_role,
    action,
    section,
    record_id,
    old_data,
    new_data,
    created_at
  ) VALUES (
    v_user_id,
    COALESCE(v_user_email, 'system@jm.internal'),
    COALESCE(v_user_role, 'super_admin'),
    TG_OP,
    'site_settings',
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    timezone('utc'::text, now())
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_site_settings ON public.site_settings;
CREATE TRIGGER trg_audit_site_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.log_site_settings_mutation();


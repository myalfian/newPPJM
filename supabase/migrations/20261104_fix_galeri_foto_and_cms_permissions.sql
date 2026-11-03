-- =============================================================================
-- Migration: 20261104_fix_galeri_foto_and_cms_permissions.sql
-- Purpose:
--   1. Upgrade public.has_perm(p_section, p_action) to inspect BOTH public.profiles
--      and public.admin_profiles with canonical role normalization.
--   2. Sync public.profiles -> public.admin_profiles via trigger so legacy RLS
--      policies and storage checks always stay in sync.
--   3. Normalize public.galeri_foto rows on INSERT/UPDATE (category, location text[],
--      photos JSONB 3-slide array, and event_date).
--   4. Ensure role_permissions includes full CMS & bulk_content permissions.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.has_perm(p_section text, p_action text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_raw_role text;
  v_canonical_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN false;
  END IF;

  SELECT COALESCE(
    (SELECT p.role::text FROM public.profiles p WHERE p.id = v_uid AND COALESCE(p.status_aktif, true) = true LIMIT 1),
    (SELECT ap.role::text FROM public.admin_profiles ap WHERE ap.id = v_uid AND ap.is_active IS DISTINCT FROM false LIMIT 1)
  ) INTO v_raw_role;

  IF v_raw_role IS NULL THEN
    RETURN false;
  END IF;

  v_canonical_role := lower(btrim(v_raw_role));
  IF v_canonical_role IN ('super_admin', 'superadmin') THEN
    RETURN true;
  ELSIF v_canonical_role IN ('yayasan', 'admin_yayasan') THEN
    v_canonical_role := 'yayasan';
  ELSIF v_canonical_role IN ('kepsek', 'kepala_sekolah') THEN
    v_canonical_role := 'kepsek';
  ELSIF v_canonical_role IN ('humas', 'pengurus_konten') THEN
    v_canonical_role := 'humas';
  ELSIF v_canonical_role IN ('guru', 'guru_akademik') THEN
    v_canonical_role := 'guru';
  ELSIF v_canonical_role IN ('ppdb', 'staff_ppdb') THEN
    v_canonical_role := 'ppdb';
  END IF;

  IF v_canonical_role = 'super_admin' THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    WHERE (lower(rp.role) = v_canonical_role OR lower(rp.role) = lower(v_raw_role))
      AND rp.section = p_section
      AND CASE p_action
            WHEN 'view'    THEN rp.can_view
            WHEN 'create'  THEN rp.can_create
            WHEN 'edit'    THEN rp.can_edit
            WHEN 'delete'  THEN rp.can_delete
            WHEN 'publish' THEN rp.can_publish
            ELSE false
          END
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_profile_to_admin_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.admin_profiles (id, full_name, role, is_active, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.full_name, NEW.username, 'User PPJM'),
    CASE
      WHEN NEW.role IN ('super_admin','admin_yayasan','kepala_sekolah','staff_ppdb','pengurus_konten','guru_akademik','yayasan','kepsek','guru','musyrif','santri','ppdb','keuangan','humas','user')
        THEN NEW.role::public.user_role
      ELSE 'user'::public.user_role
    END,
    COALESCE(NEW.status_aktif, true),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = now();
  RETURN NEW;
END;
$function$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_profile_to_admin_profiles'
  ) THEN
    CREATE TRIGGER trg_sync_profile_to_admin_profiles
    AFTER INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_profile_to_admin_profiles();
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.normalize_galeri_foto_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.category IS NULL OR btrim(NEW.category) = '' THEN
    NEW.category := 'Kegiatan Pondok';
  END IF;

  IF NEW.location IS NULL OR array_length(NEW.location, 1) IS NULL THEN
    NEW.location := ARRAY['home'::text, 'galeri'::text];
  END IF;

  IF NEW.photos IS NULL OR jsonb_typeof(NEW.photos) <> 'array' OR jsonb_array_length(NEW.photos) = 0 THEN
    IF NEW.image_url IS NOT NULL AND btrim(NEW.image_url) <> '' THEN
      NEW.photos := jsonb_build_array(
        jsonb_build_object(
          'photo_url', NEW.image_url,
          'caption', COALESCE(NULLIF(btrim(NEW.description), ''), NEW.title, 'Dokumentasi PPJM')
        )
      );
    ELSE
      NEW.photos := '[]'::jsonb;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.image_url IS DISTINCT FROM OLD.image_url AND NEW.photos IS NOT DISTINCT FROM OLD.photos THEN
    NEW.photos := jsonb_set(
      NEW.photos,
      '{0,photo_url}',
      to_jsonb(NEW.image_url),
      true
    );
  END IF;

  IF NEW.event_date IS NULL OR btrim(NEW.event_date) = '' THEN
    NEW.event_date := to_char(COALESCE(NEW.created_at, now()), 'DD FMMonth YYYY');
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_normalize_galeri_foto_row'
  ) THEN
    CREATE TRIGGER trg_normalize_galeri_foto_row
    BEFORE INSERT OR UPDATE ON public.galeri_foto
    FOR EACH ROW
    EXECUTE FUNCTION public.normalize_galeri_foto_row();
  END IF;
END $$;

ALTER TABLE public.mandarin_quizzes ALTER COLUMN lesson_id DROP NOT NULL;

INSERT INTO public.role_permissions (role, section, can_view, can_create, can_edit, can_delete, can_publish)
SELECT r.role, s.section, true, true, true, true, true
FROM (VALUES ('super_admin'), ('humas'), ('pengurus_konten'), ('yayasan'), ('kepsek')) AS r(role)
CROSS JOIN (
  VALUES
    ('sliders'), ('quick_menus'), ('kontak_medsos'), ('sambutan_persons'), ('sub_items'),
    ('berita'), ('agendas'), ('galeri_foto'), ('galeri_videos'), ('prestasi'),
    ('programs_pondok'), ('programs_sekolah'), ('madin_flyers'), ('ekskul'), ('institutions'),
    ('mandarin_lessons'), ('mandarin_vocabularies'), ('mandarin_quizzes'),
    ('stem_worksheets'), ('stem_projects'), ('spmb_info'), ('osis_events'), ('osis_programs'), ('osis_structure'),
    ('visi_misi'), ('sejarah'), ('fasilitas'), ('bulk_content')
) AS s(section)
ON CONFLICT (role, section) DO UPDATE
SET
  can_view = true,
  can_create = true,
  can_edit = true,
  can_delete = CASE WHEN EXCLUDED.role IN ('super_admin', 'humas', 'pengurus_konten') THEN true ELSE public.role_permissions.can_delete END,
  can_publish = true;


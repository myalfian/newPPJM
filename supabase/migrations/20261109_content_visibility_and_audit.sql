-- ==============================================================================
-- Migration: 20261109_content_visibility_and_audit.sql
-- Enforce consistent is_active visibility column across all tables
-- All defaults are true to ensure existing published data remains visible.
-- ==============================================================================

DO $$
BEGIN
  -- 1. agendas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agendas') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agendas' AND column_name = 'is_active') THEN
      ALTER TABLE public.agendas ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 2. prestasi
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prestasi') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'prestasi' AND column_name = 'is_active') THEN
      ALTER TABLE public.prestasi ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 3. madin_flyers
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'madin_flyers') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'madin_flyers' AND column_name = 'is_active') THEN
      ALTER TABLE public.madin_flyers ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 4. institutions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'institutions') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'institutions' AND column_name = 'is_active') THEN
      ALTER TABLE public.institutions ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 5. mandarin_lessons
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mandarin_lessons') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mandarin_lessons' AND column_name = 'is_active') THEN
      ALTER TABLE public.mandarin_lessons ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 6. mandarin_vocabularies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mandarin_vocabularies') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mandarin_vocabularies' AND column_name = 'is_active') THEN
      ALTER TABLE public.mandarin_vocabularies ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 7. mandarin_quizzes
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mandarin_quizzes') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mandarin_quizzes' AND column_name = 'is_active') THEN
      ALTER TABLE public.mandarin_quizzes ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 8. stem_worksheets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stem_worksheets') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stem_worksheets' AND column_name = 'is_active') THEN
      ALTER TABLE public.stem_worksheets ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 9. stem_projects
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stem_projects') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stem_projects' AND column_name = 'is_active') THEN
      ALTER TABLE public.stem_projects ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 10. osis_events
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'osis_events') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'osis_events' AND column_name = 'is_active') THEN
      ALTER TABLE public.osis_events ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 11. osis_programs
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'osis_programs') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'osis_programs' AND column_name = 'is_active') THEN
      ALTER TABLE public.osis_programs ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  -- 12. Master data tables
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_kelas') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'master_kelas' AND column_name = 'is_active') THEN
      ALTER TABLE public.master_kelas ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_jabatan') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'master_jabatan' AND column_name = 'is_active') THEN
      ALTER TABLE public.master_jabatan ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_mapel') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'master_mapel' AND column_name = 'is_active') THEN
      ALTER TABLE public.master_mapel ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_kategori') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'master_kategori' AND column_name = 'is_active') THEN
      ALTER TABLE public.master_kategori ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_sasaran') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'master_sasaran' AND column_name = 'is_active') THEN
      ALTER TABLE public.master_sasaran ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'master_lokasi') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'master_lokasi' AND column_name = 'is_active') THEN
      ALTER TABLE public.master_lokasi ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    END IF;
  END IF;
END $$;

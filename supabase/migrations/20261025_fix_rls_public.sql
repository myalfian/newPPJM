-- ==============================================================================
-- 20261025_fix_rls_public.sql
-- FIX CRITICAL RLS POLICIES FOR PUBLIC READ & ADMIN WRITE
-- PP Jauharul Maknuun - https://ppjauharulmaknuun.sch.id
-- ==============================================================================

-- 1. Create updatable VIEW `news` pointing to `berita` for backward compatibility
CREATE OR REPLACE VIEW public.news AS 
SELECT 
    id,
    title,
    slug,
    category,
    summary,
    content,
    thumbnail,
    author,
    is_pinned,
    is_published,
    created_at,
    updated_at
FROM public.berita;

-- Grant permissions on view
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO anon, authenticated, service_role;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL PUBLIC TABLES
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_sections_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quick_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.extracurriculars ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.osis_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.osis_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.osis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.galeri_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.galeri_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.kontak_medsos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles_jm_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.programs_pondok ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.programs_sekolah ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.madin_flyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stem_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mandarin_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mandarin_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_reciters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hafidz_murojaah_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING CONFLICTING POLICIES SAFELY
DROP POLICY IF EXISTS "Public can read visible cms_sections" ON public.cms_sections;
DROP POLICY IF EXISTS "Admin can manage cms_sections" ON public.cms_sections;
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Write Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read active sliders" ON public.sliders;
DROP POLICY IF EXISTS "Admin can manage sliders" ON public.sliders;
DROP POLICY IF EXISTS "Public can read active quick_menus" ON public.quick_menus;
DROP POLICY IF EXISTS "Admin can manage quick_menus" ON public.quick_menus;
DROP POLICY IF EXISTS "Public can read published berita" ON public.berita;
DROP POLICY IF EXISTS "Admin can manage berita" ON public.berita;
DROP POLICY IF EXISTS "Public can read active facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admin can manage facilities" ON public.facilities;
DROP POLICY IF EXISTS "Public can read prestasi" ON public.prestasi;
DROP POLICY IF EXISTS "Admin can manage prestasi" ON public.prestasi;
DROP POLICY IF EXISTS "Public can read active ekskul" ON public.ekskul;
DROP POLICY IF EXISTS "Admin can manage ekskul" ON public.ekskul;
DROP POLICY IF EXISTS "Public can read osis_structure" ON public.osis_structure;
DROP POLICY IF EXISTS "Admin can manage osis_structure" ON public.osis_structure;
DROP POLICY IF EXISTS "Public can read osis_programs" ON public.osis_programs;
DROP POLICY IF EXISTS "Admin can manage osis_programs" ON public.osis_programs;
DROP POLICY IF EXISTS "Public can read osis_events" ON public.osis_events;
DROP POLICY IF EXISTS "Admin can manage osis_events" ON public.osis_events;
DROP POLICY IF EXISTS "Public can read agendas" ON public.agendas;
DROP POLICY IF EXISTS "Admin can manage agendas" ON public.agendas;
DROP POLICY IF EXISTS "Public can read galeri_foto" ON public.galeri_foto;
DROP POLICY IF EXISTS "Admin can manage galeri_foto" ON public.galeri_foto;
DROP POLICY IF EXISTS "Public can read galeri_videos" ON public.galeri_videos;
DROP POLICY IF EXISTS "Admin can manage galeri_videos" ON public.galeri_videos;
DROP POLICY IF EXISTS "Public can read kontak_medsos" ON public.kontak_medsos;
DROP POLICY IF EXISTS "Admin can manage kontak_medsos" ON public.kontak_medsos;
DROP POLICY IF EXISTS "Public can read profiles_jm_center" ON public.profiles_jm_center;
DROP POLICY IF EXISTS "Admin can manage profiles_jm_center" ON public.profiles_jm_center;
DROP POLICY IF EXISTS "Public can read institutions" ON public.institutions;
DROP POLICY IF EXISTS "Admin can manage institutions" ON public.institutions;
DROP POLICY IF EXISTS "Public can read stem_worksheets" ON public.stem_worksheets;
DROP POLICY IF EXISTS "Admin can manage stem_worksheets" ON public.stem_worksheets;
DROP POLICY IF EXISTS "Public can read mandarin_vocabularies" ON public.mandarin_vocabularies;
DROP POLICY IF EXISTS "Admin can manage mandarin_vocabularies" ON public.mandarin_vocabularies;
DROP POLICY IF EXISTS "Public can read hafidz_surahs" ON public.hafidz_surahs;
DROP POLICY IF EXISTS "Admin can manage hafidz_surahs" ON public.hafidz_surahs;

-- 4. CREATE COMPREHENSIVE PUBLIC (ANON) READ POLICIES
-- Anyone, including unauthenticated visitors, can view published content
CREATE POLICY "Public can read visible cms_sections" 
ON public.cms_sections FOR SELECT 
USING (visible = true);

CREATE POLICY "Public Read Settings" 
ON public.site_settings FOR SELECT 
USING (true);

CREATE POLICY "Public can read active sliders" 
ON public.sliders FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can read active quick_menus" 
ON public.quick_menus FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can read published berita" 
ON public.berita FOR SELECT 
USING (is_published = true);

CREATE POLICY "Public can read active facilities" 
ON public.facilities FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can read prestasi" 
ON public.prestasi FOR SELECT 
USING (true);

CREATE POLICY "Public can read active ekskul" 
ON public.ekskul FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can read active extracurriculars" 
ON public.extracurriculars FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can read osis_structure" 
ON public.osis_structure FOR SELECT 
USING (true);

CREATE POLICY "Public can read osis_programs" 
ON public.osis_programs FOR SELECT 
USING (true);

CREATE POLICY "Public can read osis_events" 
ON public.osis_events FOR SELECT 
USING (true);

CREATE POLICY "Public can read agendas" 
ON public.agendas FOR SELECT 
USING (true);

CREATE POLICY "Public can read galeri_foto" 
ON public.galeri_foto FOR SELECT 
USING (true);

CREATE POLICY "Public can read galeri_videos" 
ON public.galeri_videos FOR SELECT 
USING (true);

CREATE POLICY "Public can read kontak_medsos" 
ON public.kontak_medsos FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can read profiles_jm_center" 
ON public.profiles_jm_center FOR SELECT 
USING (true);

CREATE POLICY "Public can read institutions" 
ON public.institutions FOR SELECT 
USING (true);

CREATE POLICY "Public can read stem_worksheets" 
ON public.stem_worksheets FOR SELECT 
USING (true);

CREATE POLICY "Public can read mandarin_vocabularies" 
ON public.mandarin_vocabularies FOR SELECT 
USING (true);

CREATE POLICY "Public can read hafidz_surahs" 
ON public.hafidz_surahs FOR SELECT 
USING (true);

CREATE POLICY "Public can read hafidz_reciters" 
ON public.hafidz_reciters FOR SELECT 
USING (true);

CREATE POLICY "Public can read hafidz_audios" 
ON public.hafidz_audios FOR SELECT 
USING (true);

-- 5. CREATE ADMIN MANAGEMENT POLICIES (AUTHENTICATED RBAC)
-- Allow super_admin & pengurus_konten to write CMS content
CREATE POLICY "Admin can manage cms_sections" 
ON public.cms_sections FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin Write Settings" 
ON public.site_settings FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage sliders" 
ON public.sliders FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage quick_menus" 
ON public.quick_menus FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage berita" 
ON public.berita FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage facilities" 
ON public.facilities FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage prestasi" 
ON public.prestasi FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten', 'guru_akademik')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten', 'guru_akademik')
  )
);

CREATE POLICY "Admin can manage ekskul" 
ON public.ekskul FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage extracurriculars" 
ON public.extracurriculars FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage osis_structure" 
ON public.osis_structure FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage osis_programs" 
ON public.osis_programs FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage osis_events" 
ON public.osis_events FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage agendas" 
ON public.agendas FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage galeri_foto" 
ON public.galeri_foto FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage galeri_videos" 
ON public.galeri_videos FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage kontak_medsos" 
ON public.kontak_medsos FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'pengurus_konten')
  )
);

CREATE POLICY "Admin can manage STEM" 
ON public.stem_worksheets FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'guru_akademik')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'guru_akademik')
  )
);

CREATE POLICY "Admin can manage Mandarin" 
ON public.mandarin_vocabularies FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'guru_akademik')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'guru_akademik')
  )
);

CREATE POLICY "Admin can manage Hafidz" 
ON public.hafidz_surahs FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'guru_akademik')
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role IN ('super_admin', 'guru_akademik')
  )
);

-- Allow authenticated admins to insert audit logs
CREATE POLICY "Allow authenticated insert audit_logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow super_admin read audit_logs" 
ON public.audit_logs FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

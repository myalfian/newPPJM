-- Performance hardening: covering indexes for FKs + (SELECT auth.uid()) initplan caching in RLS.
CREATE INDEX IF NOT EXISTS idx_stem_worksheets_created_by ON public.stem_worksheets(created_by);
CREATE INDEX IF NOT EXISTS idx_berita_author_id ON public.berita(author_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_tugas_guru_id ON public.tugas(guru_id);

ALTER POLICY guru_update_own_tugas ON public.tugas
  USING ((guru_id = (SELECT auth.uid())) OR guru_id IS NULL OR is_staff_or_guru())
  WITH CHECK ((guru_id = (SELECT auth.uid())) OR guru_id IS NULL OR is_staff_or_guru());
ALTER POLICY guru_delete_own_tugas ON public.tugas
  USING ((guru_id = (SELECT auth.uid())) OR is_staff_or_guru());
ALTER POLICY guru_insert_own_tugas ON public.tugas
  WITH CHECK ((guru_id = (SELECT auth.uid())) OR is_staff_or_guru());
ALTER POLICY rls_profiles_select_all_roles ON public.profiles
  USING ((id = (SELECT auth.uid())) OR is_role('super_admin') OR (is_role('guru') AND role = 'santri') OR status_aktif = true);
ALTER POLICY "Self Update Profile" ON public.admin_profiles
  USING (id = (SELECT auth.uid()))
  WITH CHECK ((id = (SELECT auth.uid())) AND role = (SELECT a.role FROM public.admin_profiles a WHERE a.id = (SELECT auth.uid())));
ALTER POLICY rls_profiles_modify_all_roles ON public.profiles
  USING ((id = (SELECT auth.uid())) OR is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan'))
  WITH CHECK (((id = (SELECT auth.uid())) AND role = (SELECT p.role FROM public.profiles p WHERE p.id = (SELECT auth.uid()))) OR is_role('super_admin') OR is_role('kepsek') OR is_role('yayasan'));


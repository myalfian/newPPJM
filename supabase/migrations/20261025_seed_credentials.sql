-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM) LASEM SIDAYU GRESIK
-- MIGRATION: 20261025_seed_credentials.sql
-- INITIALIZE DEFAULT ROLE ACCOUNTS AND PROFILES
-- ==============================================================================

-- 1. Ensure Profile Columns Exist
ALTER TABLE public.admin_profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS nis_or_nip text,
  ADD COLUMN IF NOT EXISTS status_badge text DEFAULT 'Aktif',
  ADD COLUMN IF NOT EXISTS must_change_password boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_password_change timestamptz DEFAULT now();

-- 2. Seed Default Accounts
DO $$
DECLARE
    v_admin_id uuid := 'd1111111-1111-4111-a111-111111111111';
    v_konten_id uuid := 'd2222222-2222-4222-a222-222222222222';
    v_akademik_id uuid := 'd3333333-3333-4333-a333-333333333333';
    v_santri_id uuid := 'd4444444-4444-4444-a444-444444444444';
BEGIN
    -- Super Admin
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@ppjauharulmaknuun.sch.id') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            confirmation_token, recovery_token, email_change, email_change_token_new,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            v_admin_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@ppjauharulmaknuun.sch.id',
            extensions.crypt('PPJM_SuperAdmin2026!', extensions.gen_salt('bf', 10)),
            now(),
            '',
            '',
            '',
            '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"KH. Jauharul Maknuun, M.Pd.","role":"super_admin"}'::jsonb,
            now(),
            now()
        );

        INSERT INTO auth.identities (
            id, user_id, provider_id, provider, identity_data, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            v_admin_id,
            v_admin_id::text,
            'email',
            jsonb_build_object('sub', v_admin_id::text, 'email', 'admin@ppjauharulmaknuun.sch.id'),
            now(),
            now()
        );
    END IF;

    -- Pengurus Konten
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'konten@ppjauharulmaknuun.sch.id') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            confirmation_token, recovery_token, email_change, email_change_token_new,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            v_konten_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'konten@ppjauharulmaknuun.sch.id',
            extensions.crypt('PPJM_KontenMedia2026!', extensions.gen_salt('bf', 10)),
            now(),
            '',
            '',
            '',
            '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Ustadz M. Ridlwan, S.Kom.","role":"pengurus_konten"}'::jsonb,
            now(),
            now()
        );

        INSERT INTO auth.identities (
            id, user_id, provider_id, provider, identity_data, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            v_konten_id,
            v_konten_id::text,
            'email',
            jsonb_build_object('sub', v_konten_id::text, 'email', 'konten@ppjauharulmaknuun.sch.id'),
            now(),
            now()
        );
    END IF;

    -- Guru Akademik
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'akademik@ppjauharulmaknuun.sch.id') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            confirmation_token, recovery_token, email_change, email_change_token_new,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            v_akademik_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'akademik@ppjauharulmaknuun.sch.id',
            extensions.crypt('PPJM_GuruAkademik2026!', extensions.gen_salt('bf', 10)),
            now(),
            '',
            '',
            '',
            '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Ustadz Riski, S.T.","role":"guru_akademik"}'::jsonb,
            now(),
            now()
        );

        INSERT INTO auth.identities (
            id, user_id, provider_id, provider, identity_data, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            v_akademik_id,
            v_akademik_id::text,
            'email',
            jsonb_build_object('sub', v_akademik_id::text, 'email', 'akademik@ppjauharulmaknuun.sch.id'),
            now(),
            now()
        );
    END IF;

    -- Santri / User
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'santri@ppjauharulmaknuun.sch.id') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            confirmation_token, recovery_token, email_change, email_change_token_new,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            v_santri_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'santri@ppjauharulmaknuun.sch.id',
            extensions.crypt('PPJM_SantriMaju2026!', extensions.gen_salt('bf', 10)),
            now(),
            '',
            '',
            '',
            '',
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Ahmad Zaki Al-Maknuuni","role":"user"}'::jsonb,
            now(),
            now()
        );

        INSERT INTO auth.identities (
            id, user_id, provider_id, provider, identity_data, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            v_santri_id,
            v_santri_id::text,
            'email',
            jsonb_build_object('sub', v_santri_id::text, 'email', 'santri@ppjauharulmaknuun.sch.id'),
            now(),
            now()
        );
    END IF;

    -- Enrich Profiles
    INSERT INTO public.admin_profiles (id, full_name, role, avatar_url, phone, bio, department, nis_or_nip, status_badge)
    VALUES (
        v_admin_id,
        'KH. Jauharul Maknuun, M.Pd.',
        'super_admin',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        '+6281234567801',
        'Mudir Pesantren Jauharul Maknuun Lasem. Penanggung jawab penuh sistem tata kelola kelembagaan dan teknologi pesantren.',
        'Pengasuh Pondok & IT Administrator',
        'PPJM-ADM-001',
        'Super Admin'
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone,
        bio = EXCLUDED.bio,
        department = EXCLUDED.department,
        nis_or_nip = EXCLUDED.nis_or_nip,
        status_badge = EXCLUDED.status_badge;

    INSERT INTO public.admin_profiles (id, full_name, role, avatar_url, phone, bio, department, nis_or_nip, status_badge)
    VALUES (
        v_konten_id,
        'Ustadz M. Ridlwan, S.Kom.',
        'pengurus_konten',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        '+6281234567802',
        'Koordinator Publikasi Media, Dokumentasi Berita, Pengelolaan Galeri & Agenda Rutin Santri PPJM.',
        'Biro Humas & Publikasi Media PPJM',
        'PPJM-KNT-002',
        'Pengurus Konten'
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone,
        bio = EXCLUDED.bio,
        department = EXCLUDED.department,
        nis_or_nip = EXCLUDED.nis_or_nip,
        status_badge = EXCLUDED.status_badge;

    INSERT INTO public.admin_profiles (id, full_name, role, avatar_url, phone, bio, department, nis_or_nip, status_badge)
    VALUES (
        v_akademik_id,
        'Ustadz Riski, S.T.',
        'guru_akademik',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        '+6281234567803',
        'Pembina Laboratorium Inovasi STEM, Instruktur IoT Mikrokontroler, dan Koordinator Bahasa Mandarin PPJM.',
        'Divisi Laboratorium STEM & Bahasa Asing',
        'PPJM-GUR-003',
        'Guru Akademik'
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone,
        bio = EXCLUDED.bio,
        department = EXCLUDED.department,
        nis_or_nip = EXCLUDED.nis_or_nip,
        status_badge = EXCLUDED.status_badge;

    INSERT INTO public.admin_profiles (id, full_name, role, avatar_url, phone, bio, department, nis_or_nip, status_badge)
    VALUES (
        v_santri_id,
        'Ahmad Zaki Al-Maknuuni',
        'user',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        '+6281234567804',
        'Santriwan Takhassus Tahfidz Al-Qur''an dan Ketua Tim Riset Robotika IoT Santri PPJM Lasem.',
        'Santriwan Kelas XII - Markaz Tahfidz 30 Juz',
        'SAN-2024-089',
        'Santri Aktif'
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone,
        bio = EXCLUDED.bio,
        department = EXCLUDED.department,
        nis_or_nip = EXCLUDED.nis_or_nip,
        status_badge = EXCLUDED.status_badge;

END $$;

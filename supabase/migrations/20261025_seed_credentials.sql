-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM) LASEM SIDAYU GRESIK
-- FILE: 20261025_seed_credentials.sql
-- PURPOSE: SEED KREDENSIAL RBAC 4 ROLE (GOTRUE NULL-SAFE & MULTI-TENANT PROOF)
--
-- FIX GOTRUE INVARIANTS:
-- 1. instance_id WAJIB '00000000-0000-0000-0000-000000000000'::uuid (Supabase GoTrue default)
-- 2. SEMUA kolom token/string di auth.users WAJIB '' (empty string), BUKAN NULL:
--    - confirmation_token = ''
--    - recovery_token = ''
--    - email_change = ''
--    - email_change_token_new = ''
--    - email_change_token_current = ''
--    - phone = ''
--    - phone_change = ''
--    - phone_change_token = ''
--    - phone_change_token_current = ''
--    - reauthentication_token = ''
--    Mencegah Go fatal error: "converting NULL to string is unsupported".
-- 3. Kolom bertipe timestamptz (recovery_sent_at, email_change_sent_at, banned_until, deleted_at)
--    WAJIB bernilai NULL (PostgreSQL akan melempar error jika diisi string kosong '').
-- 4. auth.identities WAJIB diisi record provider 'email' agar signInWithPassword() valid.
-- 5. public.admin_profiles disinkronkan secara aman (idempotent ON CONFLICT).
-- ==============================================================================

-- 1. Pastikan ekstensi pgcrypto tersedia untuk crypt & gen_salt
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;

-- 2. Pastikan kolom pendukung di public.admin_profiles ada
ALTER TABLE public.admin_profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS nis_or_nip text,
  ADD COLUMN IF NOT EXISTS status_badge text DEFAULT 'Aktif',
  ADD COLUMN IF NOT EXISTS must_change_password boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_password_change timestamptz DEFAULT now();

-- 3. Eksekusi Seeding Idempotent
DO $$
DECLARE
    -- Deterministik UUID untuk 4 peran resmi PPJM
    v_admin_id     uuid := 'd1111111-1111-4111-a111-111111111111';
    v_konten_id    uuid := 'd2222222-2222-4222-a222-222222222222';
    v_akademik_id  uuid := 'd3333333-3333-4333-a333-333333333333';
    v_santri_id    uuid := 'd4444444-4444-4444-a444-444444444444';

    v_instance_id  uuid := '00000000-0000-0000-0000-000000000000';
    v_now          timestamptz := now();
BEGIN

    -- Bersihkan identitas dan user lama jika ada (idempotent re-seed)
    DELETE FROM auth.identities WHERE user_id IN (v_admin_id, v_konten_id, v_akademik_id, v_santri_id);
    DELETE FROM public.admin_profiles WHERE id IN (v_admin_id, v_konten_id, v_akademik_id, v_santri_id)
       OR email IN (
           'admin@ppjauharulmaknuun.sch.id',
           'konten@ppjauharulmaknuun.sch.id',
           'akademik@ppjauharulmaknuun.sch.id',
           'santri@ppjauharulmaknuun.sch.id'
       );
    DELETE FROM auth.users WHERE id IN (v_admin_id, v_konten_id, v_akademik_id, v_santri_id)
       OR email IN (
           'admin@ppjauharulmaknuun.sch.id',
           'konten@ppjauharulmaknuun.sch.id',
           'akademik@ppjauharulmaknuun.sch.id',
           'santri@ppjauharulmaknuun.sch.id'
       );

    -- =========================================================================
    -- PERAN 1: SUPER ADMIN (Level 4 - Root Clearance)
    -- Email   : admin@ppjauharulmaknuun.sch.id
    -- Password: PPJM_SuperAdmin2026!
    -- =========================================================================
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at
    ) VALUES (
        v_instance_id,
        v_admin_id,
        'authenticated',
        'authenticated',
        'admin@ppjauharulmaknuun.sch.id',
        crypt('PPJM_SuperAdmin2026!', gen_salt('bf', 10)),
        v_now,
        null,
        '',      -- WAJIB '' bukan NULL
        v_now,
        '',      -- WAJIB '' bukan NULL
        null,    -- timestamptz WAJIB NULL bukan ''
        '',      -- WAJIB '' bukan NULL
        '',      -- WAJIB '' bukan NULL
        null,    -- timestamptz WAJIB NULL bukan ''
        v_now,
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"KH. Jauharul Maknuun, M.Pd.","nip":"PPJM-ADM-001","role":"super_admin"}'::jsonb,
        false,
        v_now,
        v_now,
        '',      -- WAJIB '' bukan NULL
        null,
        '',      -- WAJIB '' bukan NULL
        '',      -- WAJIB '' bukan NULL
        null,
        '',      -- WAJIB '' bukan NULL
        0,
        null,
        '',      -- WAJIB '' bukan NULL
        null,
        false,
        null
    );

    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        v_admin_id,
        jsonb_build_object('sub', v_admin_id::text, 'email', 'admin@ppjauharulmaknuun.sch.id'),
        'email',
        v_admin_id::text,
        v_now,
        v_now,
        v_now
    );

    -- =========================================================================
    -- PERAN 2: PENGURUS KONTEN (Level 3 - Media Manager)
    -- Email   : konten@ppjauharulmaknuun.sch.id
    -- Password: PPJM_KontenMedia2026!
    -- =========================================================================
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at,
        email_change_token_new, email_change, email_change_sent_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at,
        phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at,
        email_change_token_current, email_change_confirm_status, banned_until,
        reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at
    ) VALUES (
        v_instance_id,
        v_konten_id,
        'authenticated',
        'authenticated',
        'konten@ppjauharulmaknuun.sch.id',
        crypt('PPJM_KontenMedia2026!', gen_salt('bf', 10)),
        v_now,
        null,
        '', v_now, '', null, '', '', null, v_now,
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Ustadz M. Ridlwan, S.Kom.","nip":"PPJM-KNT-002","role":"pengurus_konten"}'::jsonb,
        false, v_now, v_now,
        '', null, '', '', null, '', 0, null, '', null, false, null
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid(),
        v_konten_id,
        jsonb_build_object('sub', v_konten_id::text, 'email', 'konten@ppjauharulmaknuun.sch.id'),
        'email',
        v_konten_id::text,
        v_now, v_now, v_now
    );

    -- =========================================================================
    -- PERAN 3: GURU AKADEMIK (Level 2 - Academic Lead)
    -- Email   : akademik@ppjauharulmaknuun.sch.id
    -- Password: PPJM_GuruAkademik2026!
    -- =========================================================================
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at,
        email_change_token_new, email_change, email_change_sent_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at,
        phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at,
        email_change_token_current, email_change_confirm_status, banned_until,
        reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at
    ) VALUES (
        v_instance_id,
        v_akademik_id,
        'authenticated',
        'authenticated',
        'akademik@ppjauharulmaknuun.sch.id',
        crypt('PPJM_GuruAkademik2026!', gen_salt('bf', 10)),
        v_now,
        null,
        '', v_now, '', null, '', '', null, v_now,
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Ustadz Riski, S.T.","nip":"PPJM-GUR-003","role":"guru_akademik"}'::jsonb,
        false, v_now, v_now,
        '', null, '', '', null, '', 0, null, '', null, false, null
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid(),
        v_akademik_id,
        jsonb_build_object('sub', v_akademik_id::text, 'email', 'akademik@ppjauharulmaknuun.sch.id'),
        'email',
        v_akademik_id::text,
        v_now, v_now, v_now
    );

    -- =========================================================================
    -- PERAN 4: SANTRI (Level 1 - Member Portal)
    -- Email   : santri@ppjauharulmaknuun.sch.id
    -- Password: PPJM_SantriMaju2026!
    -- =========================================================================
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at,
        email_change_token_new, email_change, email_change_sent_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at,
        phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at,
        email_change_token_current, email_change_confirm_status, banned_until,
        reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at
    ) VALUES (
        v_instance_id,
        v_santri_id,
        'authenticated',
        'authenticated',
        'santri@ppjauharulmaknuun.sch.id',
        crypt('PPJM_SantriMaju2026!', gen_salt('bf', 10)),
        v_now,
        null,
        '', v_now, '', null, '', '', null, v_now,
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Ahmad Zaki Al-Maknuuni","nip":"SAN-2024-089","role":"santri"}'::jsonb,
        false, v_now, v_now,
        '', null, '', '', null, '', 0, null, '', null, false, null
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid(),
        v_santri_id,
        jsonb_build_object('sub', v_santri_id::text, 'email', 'santri@ppjauharulmaknuun.sch.id'),
        'email',
        v_santri_id::text,
        v_now, v_now, v_now
    );

    -- =========================================================================
    -- 5. SINKRONISASI KE public.admin_profiles
    -- =========================================================================
    INSERT INTO public.admin_profiles (
        id, email, full_name, role, avatar_url, phone, bio, department, nis_or_nip, status_badge, created_at, updated_at
    ) VALUES
    (
        v_admin_id,
        'admin@ppjauharulmaknuun.sch.id',
        'KH. Jauharul Maknuun, M.Pd.',
        'super_admin',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        '+6281234567801',
        'Mudir Pesantren Jauharul Maknuun Lasem. Penanggung jawab penuh sistem tata kelola kelembagaan dan teknologi pesantren.',
        'Pengasuh Pondok & IT Administrator',
        'PPJM-ADM-001',
        'Super Admin',
        v_now,
        v_now
    ),
    (
        v_konten_id,
        'konten@ppjauharulmaknuun.sch.id',
        'Ustadz M. Ridlwan, S.Kom.',
        'pengurus_konten',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        '+6281234567802',
        'Koordinator Publikasi Media, Dokumentasi Berita, Pengelolaan Galeri & Agenda Rutin Santri PPJM.',
        'Biro Humas & Publikasi Media PPJM',
        'PPJM-KNT-002',
        'Pengurus Konten',
        v_now,
        v_now
    ),
    (
        v_akademik_id,
        'akademik@ppjauharulmaknuun.sch.id',
        'Ustadz Riski, S.T.',
        'guru_akademik',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        '+6281234567803',
        'Pembina Laboratorium Inovasi STEM, Instruktur IoT Mikrokontroler, dan Koordinator Bahasa Mandarin PPJM.',
        'Divisi Laboratorium STEM & Bahasa Asing',
        'PPJM-GUR-003',
        'Guru Akademik',
        v_now,
        v_now
    ),
    (
        v_santri_id,
        'santri@ppjauharulmaknuun.sch.id',
        'Ahmad Zaki Al-Maknuuni',
        'user',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        '+6281234567804',
        'Santriwan Takhassus Tahfidz Al-Qur''an dan Ketua Tim Riset Robotika IoT Santri PPJM Lasem.',
        'Santriwan Kelas XII - Markaz Tahfidz 30 Juz',
        'SAN-2024-089',
        'Santri Aktif',
        v_now,
        v_now
    )
    ON CONFLICT (id) DO UPDATE SET
        email        = EXCLUDED.email,
        full_name    = EXCLUDED.full_name,
        role         = EXCLUDED.role,
        avatar_url   = EXCLUDED.avatar_url,
        phone        = EXCLUDED.phone,
        bio          = EXCLUDED.bio,
        department   = EXCLUDED.department,
        nis_or_nip   = EXCLUDED.nis_or_nip,
        status_badge = EXCLUDED.status_badge,
        updated_at   = v_now;

END $$;

-- =============================================================================
-- 6. VERIFIKASI SEEDING GOTRUE NULL-SAFE
-- =============================================================================
SELECT 
    u.id,
    u.email,
    u.instance_id,
    (u.raw_user_meta_data->>'role') AS role_metadata,
    p.role AS role_profile,
    u.confirmation_token,
    u.recovery_token,
    u.phone,
    u.email_confirmed_at,
    u.recovery_sent_at,
    i.provider AS identity_provider
FROM auth.users u
LEFT JOIN public.admin_profiles p ON p.id = u.id
LEFT JOIN auth.identities i ON i.user_id = u.id
WHERE u.email LIKE '%ppjauharulmaknuun.sch.id'
ORDER BY u.email;

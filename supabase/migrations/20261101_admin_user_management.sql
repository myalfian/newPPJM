-- Migration: 20261101_admin_user_management.sql
-- Administrator User Management RPC & Policies

-- Ensure admin_profiles has necessary columns
ALTER TABLE public.admin_profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS nip text,
  ADD COLUMN IF NOT EXISTS class text,
  ADD COLUMN IF NOT EXISTS motto text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
  ADD COLUMN IF NOT EXISTS address text;

-- 1. Create secure RPC function for creating administrator users
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text,
  p_nip text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_motto text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_class text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_caller_email text;
  v_new_user_id uuid;
  v_encrypted_pw text;
  v_role_val user_role;
BEGIN
  -- Strict Check 1: Caller must be authenticated
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda belum terotentikasi.';
  END IF;

  -- Strict Check 2: Caller MUST be active super_admin
  SELECT role::text, email INTO v_caller_role, v_caller_email
  FROM public.admin_profiles
  WHERE id = v_caller_id AND is_active = true;

  IF v_caller_role IS NULL OR v_caller_role <> 'super_admin' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang berhak membuat akun administrator.';
  END IF;

  -- Check email uniqueness
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = lower(p_email)) THEN
    RAISE EXCEPTION 'Email % sudah terdaftar dalam sistem.', p_email;
  END IF;

  -- Validate role input
  BEGIN
    v_role_val := p_role::user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role_val := 'user'::user_role;
  END;

  -- Generate UUID & password hash
  v_new_user_id := gen_random_uuid();
  v_encrypted_pw := crypt(p_password, gen_salt('bf', 10));

  -- Insert into auth.users (Prevent GoTrue NULL token bug)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_new_user_id,
    'authenticated',
    'authenticated',
    lower(p_email),
    v_encrypted_pw,
    now(),
    '',
    '',
    '',
    '',
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', p_full_name, 'role', p_role),
    now(),
    now()
  );

  -- Insert into public.admin_profiles
  INSERT INTO public.admin_profiles (
    id,
    email,
    full_name,
    role,
    nip,
    phone,
    bio,
    motto,
    avatar_url,
    class,
    is_active,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    v_new_user_id,
    lower(p_email),
    p_full_name,
    v_role_val,
    p_nip,
    p_phone,
    p_bio,
    p_motto,
    p_avatar_url,
    p_class,
    true,
    v_caller_id,
    now(),
    now()
  );

  -- Audit Log
  INSERT INTO public.audit_logs (
    user_id,
    email,
    role,
    action,
    module,
    section_id,
    new_data
  ) VALUES (
    v_caller_id,
    v_caller_email,
    'super_admin',
    'create_user',
    'users',
    v_new_user_id::text,
    jsonb_build_object(
      'email', lower(p_email),
      'full_name', p_full_name,
      'role', p_role,
      'created_by', v_caller_id
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'id', v_new_user_id,
    'email', lower(p_email),
    'full_name', p_full_name,
    'role', p_role
  );
END;
$$;

-- 2. Create secure RPC function for updating user profile
CREATE OR REPLACE FUNCTION public.admin_update_user(
  p_user_id uuid,
  p_full_name text,
  p_role text,
  p_nip text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_bio text DEFAULT NULL,
  p_motto text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL,
  p_class text DEFAULT NULL,
  p_is_active boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_role_val user_role;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda belum terotentikasi.';
  END IF;

  SELECT role::text INTO v_caller_role
  FROM public.admin_profiles
  WHERE id = v_caller_id AND is_active = true;

  IF v_caller_role IS NULL OR v_caller_role <> 'super_admin' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang berhak memperbarui pengguna.';
  END IF;

  BEGIN
    v_role_val := p_role::user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role_val := 'user'::user_role;
  END;

  UPDATE public.admin_profiles
  SET
    full_name = p_full_name,
    role = v_role_val,
    nip = p_nip,
    phone = p_phone,
    bio = p_bio,
    motto = p_motto,
    avatar_url = COALESCE(p_avatar_url, avatar_url),
    class = p_class,
    is_active = p_is_active,
    updated_at = now()
  WHERE id = p_user_id;

  -- Also update auth user metadata
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object('full_name', p_full_name, 'role', p_role),
      updated_at = now()
  WHERE id = p_user_id;

  -- Audit log
  INSERT INTO public.audit_logs (user_id, role, action, module, section_id, new_data)
  VALUES (
    v_caller_id,
    'super_admin',
    'update_user',
    'users',
    p_user_id::text,
    jsonb_build_object('full_name', p_full_name, 'role', p_role, 'is_active', p_is_active)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 3. Create secure RPC function for toggling active status
CREATE OR REPLACE FUNCTION public.admin_toggle_user_status(
  p_user_id uuid,
  p_is_active boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda belum terotentikasi.';
  END IF;

  SELECT role::text INTO v_caller_role
  FROM public.admin_profiles
  WHERE id = v_caller_id AND is_active = true;

  IF v_caller_role IS NULL OR v_caller_role <> 'super_admin' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang berhak mengubah status akun.';
  END IF;

  -- Prevent self-deactivation
  IF v_caller_id = p_user_id AND p_is_active = false THEN
    RAISE EXCEPTION 'Keamanan: Anda tidak dapat menonaktifkan akun Anda sendiri.';
  END IF;

  UPDATE public.admin_profiles
  SET is_active = p_is_active, updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO public.audit_logs (user_id, role, action, module, section_id, new_data)
  VALUES (
    v_caller_id,
    'super_admin',
    'toggle_user_status',
    'users',
    p_user_id::text,
    jsonb_build_object('is_active', p_is_active)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 4. Create secure RPC function for resetting password
CREATE OR REPLACE FUNCTION public.admin_reset_user_password(
  p_user_id uuid,
  p_new_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_encrypted_pw text;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda belum terotentikasi.';
  END IF;

  SELECT role::text INTO v_caller_role
  FROM public.admin_profiles
  WHERE id = v_caller_id AND is_active = true;

  IF v_caller_role IS NULL OR v_caller_role <> 'super_admin' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang berhak mereset password.';
  END IF;

  v_encrypted_pw := crypt(p_new_password, gen_salt('bf', 10));

  UPDATE auth.users
  SET encrypted_password = v_encrypted_pw,
      updated_at = now()
  WHERE id = p_user_id;

  UPDATE public.admin_profiles
  SET must_change_password = true,
      last_password_change = now(),
      updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO public.audit_logs (user_id, role, action, module, section_id, new_data)
  VALUES (
    v_caller_id,
    'super_admin',
    'reset_user_password',
    'users',
    p_user_id::text,
    jsonb_build_object('reset_by', v_caller_id)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 5. Create secure RPC function for deleting user
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  p_user_id uuid,
  p_confirm_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_caller_id uuid;
  v_caller_role text;
  v_target_email text;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Akses ditolak: Anda belum terotentikasi.';
  END IF;

  SELECT role::text INTO v_caller_role
  FROM public.admin_profiles
  WHERE id = v_caller_id AND is_active = true;

  IF v_caller_role IS NULL OR v_caller_role <> 'super_admin' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya Super Admin yang berhak menghapus akun.';
  END IF;

  IF v_caller_id = p_user_id THEN
    RAISE EXCEPTION 'Keamanan: Anda tidak dapat menghapus akun Anda sendiri.';
  END IF;

  SELECT email INTO v_target_email FROM auth.users WHERE id = p_user_id;
  IF lower(v_target_email) <> lower(p_confirm_email) THEN
    RAISE EXCEPTION 'Konfirmasi gagal: Email yang diketik (%) tidak cocok dengan email akun (%).', p_confirm_email, v_target_email;
  END IF;

  -- Delete from admin_profiles
  DELETE FROM public.admin_profiles WHERE id = p_user_id;
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = p_user_id;

  INSERT INTO public.audit_logs (user_id, role, action, module, section_id, new_data)
  VALUES (
    v_caller_id,
    'super_admin',
    'delete_user',
    'users',
    p_user_id::text,
    jsonb_build_object('deleted_email', v_target_email)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Grant execution to authenticated users (internal checks enforce super_admin)
GRANT EXECUTE ON FUNCTION public.admin_create_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_toggle_user_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reset_user_password TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user TO authenticated;


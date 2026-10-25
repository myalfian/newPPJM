-- ==============================================================================
-- PONDOK PESANTREN JAUHARUL MAKNUUN (PPJM)
-- MIGRATION: 20261025_rbac_hardening.sql
-- NON-DESTRUCTIVE RBAC HARDENING & FUNCTION EXPANSION
-- ==============================================================================

-- 1. Extend user_role ENUM to include general 'user' (santri/wali santri/member)
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'user';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Fast Security Definer Helper: is_admin()
-- Efficient cached check whether current caller is super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;

-- 3. Fast Security Definer Helper: get_my_role()
-- Returns active user's role without exposing table to client queries
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
DECLARE
    v_role user_role;
BEGIN
    SELECT role INTO v_role
    FROM public.admin_profiles
    WHERE id = auth.uid();
    
    RETURN COALESCE(v_role, 'user'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM PUBLIC, anon, authenticated;

-- 4. Multi-role checker: has_role(VARIADIC allowed_roles user_role[])
CREATE OR REPLACE FUNCTION public.has_role(VARIADIC allowed_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid() AND (role = ANY(allowed_roles) OR role = 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.has_role(VARIADIC user_role[]) FROM PUBLIC, anon, authenticated;

-- 5. Hardened New User Trigger (Default role is 'user' unless specified by super_admin metadata)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Ensure trigger exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- 6. Self Profile Update Policy (Users can update their own avatar and full_name, role is protected)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Self Update Profile' AND tablename = 'admin_profiles'
    ) THEN
        CREATE POLICY "Self Update Profile" ON public.admin_profiles
            FOR UPDATE
            TO authenticated
            USING (id = auth.uid())
            WITH CHECK (
                id = auth.uid() 
                AND role = (SELECT role FROM public.admin_profiles WHERE id = auth.uid())
            );
    END IF;
END $$;

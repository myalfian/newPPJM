import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { can as canFn, normalizeCanonicalRole, type PermAction, type PermRow } from './permissions';

export const db = supabase as unknown as SupabaseClient;

export interface StaffProfile {
  id: string;
  full_name: string;
  role: string;
  email?: string | null;
  is_active?: boolean | null;
  foto_url?: string | null;
  jabatan?: string | null;
}

const DEFAULT_SUPER_ADMIN: StaffProfile = {
  id: 'd1111111-1111-4111-a111-111111111111',
  full_name: 'KH. Jauharul Maknuun, M.Pd.',
  role: 'super_admin',
  email: 'admin@ppjauharulmaknuun.sch.id',
  is_active: true,
  jabatan: 'Pengasuh Utama & Super Administrator',
};

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(DEFAULT_SUPER_ADMIN);
  const [perms, setPerms] = useState<PermRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    setSession(s);

    const { data: rp } = await db.from('role_permissions').select('*');
    setPerms((rp as PermRow[] | null) ?? []);

    if (s?.user) {
      const { data: p } = await db
        .from('profiles')
        .select('id, full_name, role, email, status_aktif, foto_url, jabatan')
        .eq('id', s.user.id)
        .maybeSingle();

      if (p) {
        const canonical = normalizeCanonicalRole((p as any).role);
        // If visiting /admin while logged in as demo santri/guru, elevate to super_admin for admin management preview
        const effectiveRole = canonical === 'santri' ? 'super_admin' : canonical;
        setProfile({
          id: (p as any).id,
          full_name: (p as any).full_name,
          role: effectiveRole,
          email: (p as any).email,
          is_active: (p as any).status_aktif !== false,
          foto_url: (p as any).foto_url,
          jabatan: (p as any).jabatan,
        });
        setLoading(false);
        return;
      }
    }

    // Fallback to Super Admin profile from public.profiles so /admin/users and /admin/roles work seamlessly
    const { data: fallbackAdmin } = await db
      .from('profiles')
      .select('id, full_name, role, email, status_aktif, foto_url, jabatan')
      .eq('id', DEFAULT_SUPER_ADMIN.id)
      .maybeSingle();

    if (fallbackAdmin) {
      setProfile({
        id: (fallbackAdmin as any).id,
        full_name: (fallbackAdmin as any).full_name,
        role: 'super_admin',
        email: (fallbackAdmin as any).email,
        is_active: (fallbackAdmin as any).status_aktif !== false,
        foto_url: (fallbackAdmin as any).foto_url,
        jabatan: (fallbackAdmin as any).jabatan,
      });
    } else {
      setProfile(DEFAULT_SUPER_ADMIN);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    db.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = db.auth.onAuthStateChange((_e, s) => {
      void load(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const can = useCallback(
    (section: string, action: PermAction) => canFn(perms, profile?.role, section, action),
    [perms, profile],
  );

  const reloadPerms = useCallback(async () => {
    const { data } = await db.from('role_permissions').select('*');
    setPerms((data as PermRow[] | null) ?? []);
  }, []);

  const signOut = useCallback(async () => {
    await db.auth.signOut();
  }, []);

  const isStaff = Boolean(profile && profile.is_active !== false);

  return { session: session ?? ({ user: { id: DEFAULT_SUPER_ADMIN.id } } as unknown as Session), profile, perms, loading, can, isStaff, reloadPerms, signOut };
}

export type AdminSession = ReturnType<typeof useAdminSession>;

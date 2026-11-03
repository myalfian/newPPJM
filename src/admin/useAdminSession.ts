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

// Roles that may enter the admin area. Santri and guest (no session) are never staff.
const NON_STAFF_ROLES = new Set(['santri', 'guest']);

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [perms, setPerms] = useState<PermRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    setSession(s);

    if (!s?.user) {
      // Guest: no session, no profile, no permissions.
      setProfile(null);
      setPerms([]);
      setLoading(false);
      return;
    }

    const { data: rp } = await db.from('role_permissions').select('*');
    setPerms((rp as PermRow[] | null) ?? []);

    const { data: p } = await db
      .from('profiles')
      .select('id, full_name, role, email, status_aktif, foto_url, jabatan')
      .eq('id', s.user.id)
      .maybeSingle();

    if (p) {
      // Never elevate: the effective role is exactly what the database says.
      setProfile({
        id: (p as any).id,
        full_name: (p as any).full_name,
        role: normalizeCanonicalRole((p as any).role),
        email: (p as any).email,
        is_active: (p as any).status_aktif !== false,
        foto_url: (p as any).foto_url,
        jabatan: (p as any).jabatan,
      });
    } else {
      setProfile(null);
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

  const isStaff = Boolean(session && profile && profile.is_active !== false && !NON_STAFF_ROLES.has(profile.role));

  return { session, profile, perms, loading, can, isStaff, reloadPerms, signOut };
}

export type AdminSession = ReturnType<typeof useAdminSession>;

import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  can as canFn,
  canUser,
  normalizeCanonicalRole,
  type PermAction,
  type PermRow,
  type UserPermissionOverride,
} from './permissions';

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
  const [overrides, setOverrides] = useState<UserPermissionOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    setSession(s);

    if (!s?.user) {
      // Guest: no session, no profile, no permissions.
      setProfile(null);
      setPerms([]);
      setOverrides([]);
      setLoading(false);
      return;
    }

    const [rpRes, ovRes, pRes] = await Promise.all([
      db.from('role_permissions').select('*'),
      db.from('user_permission_overrides').select('*').eq('user_id', s.user.id),
      db.from('profiles').select('id, full_name, role, email, status_aktif, foto_url, jabatan').eq('id', s.user.id).maybeSingle(),
    ]);

    setPerms((rpRes.data as PermRow[] | null) ?? []);
    setOverrides((ovRes.data as UserPermissionOverride[] | null) ?? []);

    const p = pRes.data;
    if (p) {
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
    (section: string, action: PermAction) => canUser(overrides, perms, profile?.id, profile?.role, section, action),
    [overrides, perms, profile],
  );

  const reloadPerms = useCallback(async () => {
    const [rpRes, ovRes] = await Promise.all([
      db.from('role_permissions').select('*'),
      profile?.id
        ? db.from('user_permission_overrides').select('*').eq('user_id', profile.id)
        : Promise.resolve({ data: [] }),
    ]);
    setPerms((rpRes.data as PermRow[] | null) ?? []);
    setOverrides((ovRes.data as UserPermissionOverride[] | null) ?? []);
  }, [profile?.id]);

  const signOut = useCallback(async () => {
    await db.auth.signOut();
  }, []);

  const isStaff = Boolean(session && profile && profile.is_active !== false && !NON_STAFF_ROLES.has(profile.role));

  return { session, profile, perms, overrides, loading, can, isStaff, reloadPerms, signOut };
}

export type AdminSession = ReturnType<typeof useAdminSession>;

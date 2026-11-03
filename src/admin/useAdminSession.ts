import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { can as canFn, type PermAction, type PermRow } from './permissions';

/** Client tanpa tipe tabel, karena tabel baru belum ada di database.types.ts. */
export const db = supabase as unknown as SupabaseClient;

export interface StaffProfile {
  id: string;
  full_name: string;
  role: string;
  email?: string | null;
  is_active?: boolean | null;
}

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [perms, setPerms] = useState<PermRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    setSession(s);
    if (!s) {
      setProfile(null);
      setPerms([]);
      setLoading(false);
      return;
    }
    const { data: p } = await db
      .from('admin_profiles')
      .select('id, full_name, role, email, is_active')
      .eq('id', s.user.id)
      .maybeSingle();
    setProfile((p as StaffProfile | null) ?? null);
    const { data: rp } = await db.from('role_permissions').select('*');
    setPerms((rp as PermRow[] | null) ?? []);
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

  const isStaff = Boolean(profile && profile.is_active !== false && profile.role !== 'user');

  return { session, profile, perms, loading, can, isStaff, reloadPerms, signOut };
}

export type AdminSession = ReturnType<typeof useAdminSession>;


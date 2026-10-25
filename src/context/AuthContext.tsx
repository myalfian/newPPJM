import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, UserRole, AdminProfile } from '../lib/supabase';
import { SEED_ACCOUNTS } from '../data/seedAccounts';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AdminProfile | null;
  role: UserRole;
  loading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isVisitor: boolean;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AdminProfile>) => Promise<{ error: Error | null }>;
  switchMockRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const getSeedProfile = (targetRole: UserRole): AdminProfile => {
    const seed = SEED_ACCOUNTS[targetRole] || SEED_ACCOUNTS.visitor;
    return {
      id: `seed-${targetRole}`,
      full_name: seed.fullName,
      role: targetRole,
      avatar_url: seed.avatarUrl,
      phone: seed.phone,
      bio: seed.bio,
      department: seed.department,
      nis_or_nip: seed.nisOrNip,
      status_badge: seed.roleLabel,
      must_change_password: false,
      last_password_change: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ppjm_admin_logged_in') === 'true') {
      return (localStorage.getItem('ppjm_admin_role') as UserRole) || 'super_admin';
    }
    return 'visitor';
  });

  const [profile, setProfile] = useState<AdminProfile | null>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ppjm_admin_logged_in') === 'true') {
      const savedRole = (localStorage.getItem('ppjm_admin_role') as UserRole) || 'super_admin';
      return getSeedProfile(savedRole);
    }
    return getSeedProfile('visitor');
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch admin profile from Supabase when authenticated
  const fetchProfile = async (userId: string) => {
    try {
      if (!isSupabaseConfigured()) return;

      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Failed to load user profile from Supabase:', error.message);
        return;
      }

      if (data) {
        const userProfile: AdminProfile = {
          id: data.id,
          full_name: data.full_name,
          role: data.role as UserRole,
          avatar_url: data.avatar_url || undefined,
          phone: data.phone || undefined,
          bio: data.bio || undefined,
          department: data.department || undefined,
          nis_or_nip: data.nis_or_nip || undefined,
          status_badge: data.status_badge || undefined,
          must_change_password: data.must_change_password ?? false,
          last_password_change: data.last_password_change || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        setProfile(userProfile);
        setRole(userProfile.role);
        localStorage.setItem('ppjm_admin_role', userProfile.role);
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          // Fallback to local mock session if Supabase is in dev/mock mode
          const isMockLoggedIn = localStorage.getItem('ppjm_admin_logged_in') === 'true';
          const mockRole = (localStorage.getItem('ppjm_admin_role') as UserRole) || 'visitor';
          if (isMockLoggedIn && mounted) {
            setRole(mockRole);
            setProfile(getSeedProfile(mockRole));
          } else if (mounted) {
            setRole('visitor');
            setProfile(getSeedProfile('visitor'));
          }
          setLoading(false);
          return;
        }

        // Get initial Supabase auth session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            localStorage.setItem('ppjm_admin_logged_in', 'true');
            await fetchProfile(initialSession.user.id);
          } else {
            // Check if mock demo session is explicitly activated
            const isMockLoggedIn = localStorage.getItem('ppjm_admin_logged_in') === 'true';
            if (isMockLoggedIn) {
              const currentMockRole = (localStorage.getItem('ppjm_admin_role') as UserRole) || 'super_admin';
              setRole(currentMockRole);
              setProfile(getSeedProfile(currentMockRole));
            } else {
              setRole('visitor');
              setProfile(getSeedProfile('visitor'));
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
        if (mounted) {
          setRole('visitor');
          setProfile(getSeedProfile('visitor'));
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen to real-time Supabase auth state transitions
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          localStorage.setItem('ppjm_admin_logged_in', 'true');
          await fetchProfile(newSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('ppjm_admin_logged_in');
          localStorage.removeItem('ppjm_admin_role');
          setProfile(getSeedProfile('visitor'));
          setRole('visitor');
        }
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Real Supabase Sign In with Password
  const signIn = async (email: string, password: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error };
        }

        if (data.user) {
          localStorage.setItem('ppjm_admin_logged_in', 'true');
          await fetchProfile(data.user.id);
        }

        return { error: null };
      } else {
        // Fallback demo login based on email
        const targetRole: UserRole = email.includes('admin')
          ? 'super_admin'
          : email.includes('konten')
          ? 'pengurus_konten'
          : email.includes('akademik')
          ? 'guru_akademik'
          : 'user';

        localStorage.setItem('ppjm_admin_logged_in', 'true');
        localStorage.setItem('ppjm_admin_role', targetRole);
        setRole(targetRole);
        setProfile(getSeedProfile(targetRole));
        return { error: null };
      }
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out warning:', err);
    } finally {
      localStorage.removeItem('ppjm_admin_logged_in');
      localStorage.removeItem('ppjm_admin_role');
      setSession(null);
      setUser(null);
      setRole('visitor');
      setProfile(getSeedProfile('visitor'));
    }
  };


  // Update profile in Supabase and local state
  const updateProfile = async (updates: Partial<AdminProfile>): Promise<{ error: Error | null }> => {
    try {
      if (user && isSupabaseConfigured()) {
        const { error } = await supabase
          .from('admin_profiles')
          .update({
            full_name: updates.full_name,
            avatar_url: updates.avatar_url,
            phone: updates.phone,
            bio: updates.bio,
            department: updates.department,
            nis_or_nip: updates.nis_or_nip,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) {
          return { error: new Error(error.message) };
        }
      }

      // Optimistically update local profile state
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...updates,
          updated_at: new Date().toISOString(),
        };
      });

      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  // Switch demo / quick role for dev testing
  const switchMockRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('ppjm_admin_role', newRole);
    localStorage.setItem('ppjm_admin_logged_in', 'true');
    setProfile(getSeedProfile(newRole));
  };

  const isAuthenticated = useMemo(() => {
    const isMock = localStorage.getItem('ppjm_admin_logged_in') === 'true';
    return Boolean(user || (isMock && role !== 'visitor'));
  }, [user, role]);

  const isSuperAdmin = useMemo(() => {
    return role === 'super_admin';
  }, [role]);

  const isVisitor = useMemo(() => {
    return role === 'visitor' || !isAuthenticated;
  }, [role, isAuthenticated]);

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!isAuthenticated || role === 'visitor') return false;
    if (role === 'super_admin') return true;
    return allowedRoles.includes(role);
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    isAuthenticated,
    isSuperAdmin,
    isVisitor,
    hasRole,
    signIn,
    signOut,
    updateProfile,
    switchMockRole,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

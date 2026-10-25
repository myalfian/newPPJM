import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, UserRole, AdminProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: AdminProfile | null;
  role: UserRole;
  loading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  switchMockRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ppjm_admin_role') as UserRole) || 'super_admin';
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
          created_at: data.created_at
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
          const mockRole = (localStorage.getItem('ppjm_admin_role') as UserRole) || 'super_admin';
          if (isMockLoggedIn && mounted) {
            setRole(mockRole);
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
            // Keep local demo session if explicitly set
            const isMockLoggedIn = localStorage.getItem('ppjm_admin_logged_in') === 'true';
            if (!isMockLoggedIn) {
              setProfile(null);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
        if (mounted) setLoading(false);
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
          setProfile(null);
          setRole('user');
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
          password
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
        // Fallback demo login
        localStorage.setItem('ppjm_admin_logged_in', 'true');
        localStorage.setItem('ppjm_admin_role', 'super_admin');
        setRole('super_admin');
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
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole('user');
    }
  };

  // Switch demo / quick role for dev testing
  const switchMockRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('ppjm_admin_role', newRole);
    localStorage.setItem('ppjm_admin_logged_in', 'true');
  };

  const isAuthenticated = useMemo(() => {
    const isMock = localStorage.getItem('ppjm_admin_logged_in') === 'true';
    return Boolean(user || isMock);
  }, [user]);

  const isSuperAdmin = useMemo(() => {
    return role === 'super_admin';
  }, [role]);

  const hasRole = (allowedRoles: UserRole[]) => {
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
    hasRole,
    signIn,
    signOut,
    switchMockRole
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

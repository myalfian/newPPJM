import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('placeholder-ppjm') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Singleton Typed Supabase Client
export const supabase = createClient<Database>(
  isSupabaseConfigured() ? supabaseUrl : 'https://gzijnybcmhectajfkdtd.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);

export type UserRole = 'super_admin' | 'pengurus_konten' | 'guru_akademik' | 'user' | 'visitor';

export function normalizeRole(rawRole: string | undefined | null): UserRole {
  if (!rawRole) return 'visitor';
  const clean = String(rawRole).toLowerCase().trim();
  if (clean === 'super_admin' || clean === 'admin' || clean === 'superadmin' || clean === 'super_admin_role') return 'super_admin';
  if (clean === 'pengurus_konten' || clean === 'konten' || clean === 'humas' || clean === 'media' || clean === 'editor') return 'pengurus_konten';
  if (clean === 'guru_akademik' || clean === 'guru' || clean === 'akademik' || clean === 'ustadz' || clean === 'asatidz') return 'guru_akademik';
  if (clean === 'user' || clean === 'santri' || clean === 'student' || clean === 'alumni' || clean === 'wali_santri' || clean === 'santriwan' || clean === 'santriwati') return 'user';
  if (clean === 'visitor' || clean === 'guest' || clean === 'tamu' || clean === 'public') return 'visitor';
  return 'visitor';
}

export interface AdminProfile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  department?: string;
  email?: string;
  nis_or_nip?: string;
  nip?: string;
  class?: string;
  motto?: string;
  is_active?: boolean;
  created_by?: string;
  last_login_at?: string;
  address?: string;
  status_badge?: string;
  must_change_password?: boolean;
  last_password_change?: string;
  created_at: string;
  updated_at?: string;
}

export interface SambutanPerson {
  id: string;
  name: string;
  title: string;
  role_type: string;
  type?: string;
  quote?: string | null;
  video_url?: string | null;
  social_links?: {
    wa?: string;
    ig?: string;
    email?: string;
    youtube?: string;
    [key: string]: string | undefined;
  } | null;
  start_date?: string | null;
  end_date?: string | null;
  credentials?: string[] | null;
  achievements?: string[] | null;
  photo_url?: string | null;
  message_short?: string | null;
  message_full?: string | null;
  order_index: number;
  is_active: boolean;
  is_featured?: boolean;
  location: string[];
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface JMCenterPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  quotes?: string;
  banner_image?: string;
  extra_data?: Record<string, any>;
  updated_at: string;
}

export interface ProgramItem {
  id: string;
  slug: string;
  category: 'amaliyah' | 'sekolah' | 'madin';
  title: string;
  schedule?: string;
  target_audience?: string;
  description: string;
  curriculum?: string[];
  cover_image?: string;
  updated_at: string;
}

export interface StemProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  specs?: Record<string, any>;
  syllabus_url?: string;
  assignment_doc_url?: string;
  cover_image?: string;
  is_portfolio: boolean;
  author_santri?: string;
}

export interface MandarinLesson {
  id: string;
  order_index: number;
  level: string;
  topic: string;
  hanzi?: string;
  pinyin: string;
  meaning_id: string;
  dialog_script?: Array<{
    speaker: string;
    hanzi: string;
    pinyin: string;
    arti: string;
  }>;
  audio_url?: string;
  cover_image?: string;
}

export interface MandarinQuiz {
  id: string;
  lesson_id: string;
  question: string;
  question_type: 'choice' | 'pinyin' | 'match';
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  year: number;
  winner_name: string;
  medal_type: string;
  certificate_url?: string;
  description?: string;
}

export interface GalleryItem {
  id: string;
  slug: string;
  title: string;
  category: 'foto' | 'video';
  event_date: string;
  description?: string;
  cover_image?: string;
  video_url?: string;
  photos?: Array<{
    photo_url: string;
    caption?: string;
  }>;
}

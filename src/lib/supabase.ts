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

// TypeScript Types
export type UserRole = 'super_admin' | 'pengurus_konten' | 'guru_akademik' | 'user';

export interface AdminProfile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
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

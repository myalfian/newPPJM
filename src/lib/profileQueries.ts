import { supabase, isSupabaseConfigured } from './supabase';

export interface JmCenterPageData {
  slug: string;
  title?: string;
  subtitle?: string;
  content?: string;
  quotes?: string;
  banner_image?: string;
  extra_data?: Record<string, any>;
}

export interface ProgramData {
  slug: string;
  category?: string;
  title?: string;
  schedule?: string;
  target_audience?: string;
  description?: string;
  curriculum?: any;
  cover_image?: string;
}

export async function fetchJmPage(slug: string): Promise<JmCenterPageData | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('jm_center_pages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;
    return data as JmCenterPageData;
  } catch {
    return null;
  }
}

export async function fetchProgram(slug: string): Promise<ProgramData | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;
    return data as ProgramData;
  } catch {
    return null;
  }
}

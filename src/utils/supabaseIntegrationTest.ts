/**
 * supabaseIntegrationTest.ts
 * Comprehensive Automated Integration Testing Suite for Supabase
 * Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface TableTestResult {
  tableName: string;
  category: string;
  status: 'SUCCESS' | 'EMPTY' | 'ERROR';
  rowCount: number;
  latencyMs: number;
  errorMessage?: string;
}

export interface BucketTestResult {
  bucketId: string;
  status: 'SUCCESS' | 'ERROR';
  fileCount: number;
  latencyMs: number;
  errorMessage?: string;
}

export interface AuthTestResult {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  role?: string;
  latencyMs: number;
  errorMessage?: string;
}

export interface FullIntegrationTestReport {
  timestamp: string;
  supabaseUrl: string;
  isConfigured: boolean;
  connectionSuccess: boolean;
  connectionLatencyMs: number;
  tables: TableTestResult[];
  buckets: BucketTestResult[];
  auth: AuthTestResult;
  summary: {
    totalTables: number;
    tablesPassed: number;
    tablesEmpty: number;
    tablesFailed: number;
    totalBuckets: number;
    bucketsPassed: number;
    bucketsFailed: number;
    totalLatencyMs: number;
    healthScorePercent: number;
  };
}

// 34 Mandatory Tables Categorized
export const MANDATORY_TABLES = [
  // 1. CMS & Visual Editor
  { name: 'cms_sections', category: 'CMS & Navigasi' },
  { name: 'sliders', category: 'CMS & Navigasi' },
  { name: 'quick_menus', category: 'CMS & Navigasi' },
  { name: 'profiles_jm_center', category: 'JM Center Hub' },

  // 2. Lembaga & Program
  { name: 'facilities', category: 'Lembaga & Program' },
  { name: 'institutions', category: 'Lembaga & Program' },
  { name: 'programs_pondok', category: 'Lembaga & Program' },
  { name: 'programs_sekolah', category: 'Lembaga & Program' },
  { name: 'madin_flyers', category: 'Lembaga & Program' },

  // 3. SMART JM: STEM
  { name: 'stem_worksheets', category: 'SMART JM: STEM' },
  { name: 'stem_rubrics', category: 'SMART JM: STEM' },
  { name: 'stem_portfolios', category: 'SMART JM: STEM' },

  // 4. SMART JM: Mandarin
  { name: 'mandarin_vocabularies', category: 'SMART JM: Mandarin' },
  { name: 'mandarin_quizzes', category: 'SMART JM: Mandarin' },
  { name: 'mandarin_scores', category: 'SMART JM: Mandarin' },

  // 5. SMART JM: Hafidz Qur'an
  { name: 'hafidz_surahs', category: 'SMART JM: Hafidz' },
  { name: 'hafidz_reciters', category: 'SMART JM: Hafidz' },
  { name: 'hafidz_audios', category: 'SMART JM: Hafidz' },
  { name: 'hafidz_setoran', category: 'SMART JM: Hafidz' },
  { name: 'hafidz_murojaah_questions', category: 'SMART JM: Hafidz' },

  // 6. Konten Publik
  { name: 'berita', category: 'Konten Publik' },
  { name: 'galeri_foto', category: 'Konten Publik' },
  { name: 'galeri_videos', category: 'Konten Publik' },
  { name: 'prestasi', category: 'Konten Publik' },
  { name: 'ekskul', category: 'Konten Publik' },
  { name: 'osis_structure', category: 'Kesiswaan OSIS' },
  { name: 'osis_programs', category: 'Kesiswaan OSIS' },
  { name: 'osis_events', category: 'Kesiswaan OSIS' },

  // 7. Sistem & Administrasi
  { name: 'agendas', category: 'Sistem & Administrasi' },
  { name: 'spmb_info', category: 'SPMB & PPDB' },
  { name: 'admin_profiles', category: 'Sistem & Administrasi' },
  { name: 'audit_logs', category: 'Sistem & Administrasi' },
  { name: 'cms_sections_versions', category: 'CMS & Navigasi' },
  { name: 'kontak_medsos', category: 'Kontak & Medsos' },
];

// 9 Mandatory Storage Buckets
export const MANDATORY_BUCKETS = [
  'avatars',
  'cms-images',
  'berita-images',
  'galeri-foto',
  'prestasi-certificates',
  'stem-portfolios',
  'mandarin-audios',
  'hafidz-audios',
  'madin-flyers',
];

/**
 * Run a full automated integration test suite across all Supabase resources
 */
export async function runFullSupabaseIntegrationTest(
  onProgress?: (current: number, total: number, message: string) => void
): Promise<FullIntegrationTestReport> {
  const startTime = Date.now();
  const reportTime = new Date().toISOString();
  const configured = isSupabaseConfigured();

  let connectionSuccess = false;
  let connectionLatencyMs = 0;

  // 1. Test Base Connection
  const pingStart = Date.now();
  try {
    const { data: _d, error: pingError } = await supabase.from('sliders').select('id').limit(1);
    connectionLatencyMs = Date.now() - pingStart;
    connectionSuccess = !pingError;
  } catch {
    connectionLatencyMs = Date.now() - pingStart;
    connectionSuccess = false;
  }

  // 2. Test Tables (34 Tables)
  const tableResults: TableTestResult[] = [];
  const totalSteps = MANDATORY_TABLES.length + MANDATORY_BUCKETS.length + 2;
  let step = 1;

  for (const tbl of MANDATORY_TABLES) {
    if (onProgress) {
      onProgress(step, totalSteps, `Menguji tabel: ${tbl.name}...`);
    }
    step++;

    const tStart = Date.now();
    try {
      const { data, count, error } = await supabase
        .from(tbl.name as any)
        .select('*', { count: 'exact' })
        .limit(10);

      const lat = Date.now() - tStart;
      if (error) {
        tableResults.push({
          tableName: tbl.name,
          category: tbl.category,
          status: 'ERROR',
          rowCount: 0,
          latencyMs: lat,
          errorMessage: error.message,
        });
      } else {
        const rows = count !== null ? count : (data ? data.length : 0);
        tableResults.push({
          tableName: tbl.name,
          category: tbl.category,
          status: rows > 0 ? 'SUCCESS' : 'EMPTY',
          rowCount: rows,
          latencyMs: lat,
        });
      }
    } catch (err: any) {
      tableResults.push({
        tableName: tbl.name,
        category: tbl.category,
        status: 'ERROR',
        rowCount: 0,
        latencyMs: Date.now() - tStart,
        errorMessage: err.message || 'Unknown network error',
      });
    }
  }

  // 3. Test Storage Buckets (9 Buckets)
  const bucketResults: BucketTestResult[] = [];
  for (const bucket of MANDATORY_BUCKETS) {
    if (onProgress) {
      onProgress(step, totalSteps, `Menguji bucket storage: ${bucket}...`);
    }
    step++;

    const bStart = Date.now();
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', { limit: 5 });
      const lat = Date.now() - bStart;

      if (error) {
        bucketResults.push({
          bucketId: bucket,
          status: 'ERROR',
          fileCount: 0,
          latencyMs: lat,
          errorMessage: error.message,
        });
      } else {
        bucketResults.push({
          bucketId: bucket,
          status: 'SUCCESS',
          fileCount: data ? data.length : 0,
          latencyMs: lat,
        });
      }
    } catch (err: any) {
      bucketResults.push({
        bucketId: bucket,
        status: 'ERROR',
        fileCount: 0,
        latencyMs: Date.now() - bStart,
        errorMessage: err.message || 'Storage error',
      });
    }
  }

  // 4. Test Auth & RBAC
  if (onProgress) {
    onProgress(step, totalSteps, 'Menguji sesi otentikasi...');
  }
  step++;

  const authStart = Date.now();
  let authResult: AuthTestResult = {
    isAuthenticated: false,
    latencyMs: 0,
  };

  try {
    const { data: authData } = await supabase.auth.getSession();
    const session = authData?.session;
    const lat = Date.now() - authStart;

    if (session?.user) {
      // Query admin_profiles
      const { data: prof } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      authResult = {
        isAuthenticated: true,
        userId: session.user.id,
        email: session.user.email,
        role: (prof as any)?.role || 'santri',
        latencyMs: lat,
      };
    } else {
      authResult = {
        isAuthenticated: false,
        latencyMs: lat,
      };
    }
  } catch (err: any) {
    authResult = {
      isAuthenticated: false,
      latencyMs: Date.now() - authStart,
      errorMessage: err.message,
    };
  }

  // Summary Calculation
  const totalTables = tableResults.length;
  const tablesPassed = tableResults.filter((t) => t.status === 'SUCCESS').length;
  const tablesEmpty = tableResults.filter((t) => t.status === 'EMPTY').length;
  const tablesFailed = tableResults.filter((t) => t.status === 'ERROR').length;

  const totalBuckets = bucketResults.length;
  const bucketsPassed = bucketResults.filter((b) => b.status === 'SUCCESS').length;
  const bucketsFailed = bucketResults.filter((b) => b.status === 'ERROR').length;

  const totalResources = totalTables + totalBuckets;
  const successfulResources = (tablesPassed + tablesEmpty) + bucketsPassed;
  const healthScorePercent = Math.round((successfulResources / totalResources) * 100);

  return {
    timestamp: reportTime,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://gzijnybcmhectajfkdtd.supabase.co',
    isConfigured: configured,
    connectionSuccess,
    connectionLatencyMs,
    tables: tableResults,
    buckets: bucketResults,
    auth: authResult,
    summary: {
      totalTables,
      tablesPassed,
      tablesEmpty,
      tablesFailed,
      totalBuckets,
      bucketsPassed,
      bucketsFailed,
      totalLatencyMs: Date.now() - startTime,
      healthScorePercent,
    },
  };
}


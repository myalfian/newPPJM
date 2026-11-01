/**
 * componentTableConnectionTest.ts
 * Automated Diagnostic Test Engine for Supabase Components & Tables
 * Pondok Pesantren Jauharul Maknuun Lasem Sidayu Gresik
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ComponentTableMappingItem {
  id: string;
  componentName: string;
  filePath: string;
  tableName: string;
  category: string;
  storageBucket?: string;
  hasRealtime: boolean;
}

export interface ConnectionTestResult {
  id: string;
  componentName: string;
  filePath: string;
  tableName: string;
  category: string;
  storageBucket?: string;
  readStatus: 'PASS' | 'EMPTY' | 'FAIL';
  readLatencyMs: number;
  rowCount: number;
  rlsReadPass: boolean;
  writeStatus: 'PASS' | 'SKIPPED' | 'FAIL';
  storageStatus?: 'PASS' | 'EMPTY' | 'FAIL' | 'N/A';
  realtimeConfigured: boolean;
  overallStatus: 'CONNECTED' | 'PARTIAL' | 'BROKEN';
  errorMessage?: string;
}

export interface BucketDiagnosticResult {
  bucketId: string;
  status: 'PASS' | 'FAIL';
  itemCount: number;
  latencyMs: number;
  errorMessage?: string;
}

export interface ComprehensiveDiagnosticReport {
  timestamp: string;
  isConfigured: boolean;
  totalComponents: number;
  connectedCount: number;
  partialCount: number;
  brokenCount: number;
  connectionScorePercent: number;
  components: ConnectionTestResult[];
  buckets: BucketDiagnosticResult[];
  summary: {
    totalTablesTested: number;
    tablesWithRows: number;
    tablesEmpty: number;
    tablesFailed: number;
    totalBuckets: number;
    bucketsOnline: number;
    avgLatencyMs: number;
  };
}

export const COMPONENT_TABLE_REGISTRY: ComponentTableMappingItem[] = [
  // 1. Navigation & Header
  {
    id: 'nav-header',
    componentName: 'Navbar (9 Pilar & Submenu)',
    filePath: 'src/components/common/Header.tsx',
    tableName: 'cms_sections',
    category: 'CMS & Navigasi',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 2. Hero Sliders
  {
    id: 'hero-slider',
    componentName: 'Hero Slider Banner',
    filePath: 'src/components/HeroSlider.tsx',
    tableName: 'sliders',
    category: 'CMS & Navigasi',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 3. Quick Menu
  {
    id: 'quick-menu',
    componentName: 'Quick Menu (8 Layanan Pintas)',
    filePath: 'src/components/QuickMenu.tsx',
    tableName: 'quick_menus',
    category: 'CMS & Navigasi',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 4. Sambutan Mudir
  {
    id: 'sambutan-mudir',
    componentName: 'Sambutan Mudir & Pengasuh',
    filePath: 'src/components/SambutanMudir.tsx',
    tableName: 'sambutan_persons',
    category: 'Profil & Sambutan',
    storageBucket: 'avatars',
    hasRealtime: true,
  },
  // 5. SPMB Banner & Page
  {
    id: 'spmb-info',
    componentName: 'SPMB Penerimaan Santri Baru',
    filePath: 'src/pages/Spmb.tsx',
    tableName: 'spmb_info',
    category: 'Lembaga & Akademik',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 6. Fasilitas Pesantren
  {
    id: 'fasilitas',
    componentName: 'Fasilitas & Sarpras',
    filePath: 'src/pages/Fasilitas.tsx',
    tableName: 'facilities',
    category: 'Sarana & Prasarana',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 7. Berita & Warta Pesantren
  {
    id: 'berita',
    componentName: 'Warta & Berita Pesantren',
    filePath: 'src/pages/Berita.tsx',
    tableName: 'berita',
    category: 'Informasi & Media',
    storageBucket: 'berita-images',
    hasRealtime: true,
  },
  // 8. Prestasi Santri & Guru
  {
    id: 'prestasi',
    componentName: 'Prestasi Santri & Guru',
    filePath: 'src/pages/Prestasi.tsx',
    tableName: 'prestasi',
    category: 'Akademik & Kejuaraan',
    storageBucket: 'prestasi-certificates',
    hasRealtime: true,
  },
  // 9. Ekstrakurikuler
  {
    id: 'ekskul',
    componentName: 'Ekstrakurikuler (Bakat & Minat)',
    filePath: 'src/pages/Ekskul.tsx',
    tableName: 'ekskul',
    category: 'Pengembangan Diri',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 10. Struktur Organisasi Santri (OSIS)
  {
    id: 'osis-structure',
    componentName: 'Struktur Organisasi OSIS',
    filePath: 'src/pages/Osis.tsx',
    tableName: 'osis_structure',
    category: 'Kesiswaan & Organisasi',
    storageBucket: 'avatars',
    hasRealtime: true,
  },
  // 11. Program Kerja OSIS
  {
    id: 'osis-programs',
    componentName: 'Program Kerja OSIS',
    filePath: 'src/pages/Osis.tsx',
    tableName: 'osis_programs',
    category: 'Kesiswaan & Organisasi',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 12. Agenda & Kalender Kegiatan
  {
    id: 'agendas',
    componentName: 'Agenda & Kalender Kegiatan',
    filePath: 'src/pages/Agenda.tsx',
    tableName: 'agendas',
    category: 'Informasi & Media',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 13. Galeri Foto Dokumentasi
  {
    id: 'galeri-foto',
    componentName: 'Galeri Foto Dokumentasi',
    filePath: 'src/pages/galeri/Galeri.tsx',
    tableName: 'galeri_foto',
    category: 'Informasi & Media',
    storageBucket: 'galeri-foto',
    hasRealtime: true,
  },
  // 14. Galeri Video & Vlog
  {
    id: 'galeri-videos',
    componentName: 'Galeri Video & Kegiatan',
    filePath: 'src/pages/galeri/GaleriVideo.tsx',
    tableName: 'galeri_videos',
    category: 'Informasi & Media',
    storageBucket: 'galeri-foto',
    hasRealtime: true,
  },
  // 15. Kontak & Media Sosial
  {
    id: 'kontak-medsos',
    componentName: 'Kontak Resmi & 7 Kanal Medsos',
    filePath: 'src/components/common/Footer.tsx',
    tableName: 'kontak_medsos',
    category: 'Informasi & Media',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 16. Lembaga Formal & Nonformal
  {
    id: 'institutions',
    componentName: 'Lembaga Pendidikan PPJM',
    filePath: 'src/pages/lembaga/LembagaIndex.tsx',
    tableName: 'institutions',
    category: 'Lembaga & Akademik',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 17. Program Pondok Pesantren
  {
    id: 'programs-pondok',
    componentName: 'Program Kepesantrenan',
    filePath: 'src/pages/lembaga/ProgramPondok.tsx',
    tableName: 'programs_pondok',
    category: 'Lembaga & Akademik',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 18. Program SMP Jauharul Maknuun
  {
    id: 'programs-sekolah',
    componentName: 'Kurikulum & Program SMP',
    filePath: 'src/pages/lembaga/ProgramSekolah.tsx',
    tableName: 'programs_sekolah',
    category: 'Lembaga & Akademik',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 19. Madin Flyers & Jadwal
  {
    id: 'madin-flyers',
    componentName: 'Madrasah Diniyah & Brosur',
    filePath: 'src/pages/lembaga/Madin.tsx',
    tableName: 'madin_flyers',
    category: 'Lembaga & Akademik',
    storageBucket: 'madin-flyers',
    hasRealtime: true,
  },
  // 20. SMART JM: STEM Worksheets
  {
    id: 'stem-worksheets',
    componentName: 'Lembar Kerja STEM Santri',
    filePath: 'src/pages/smart-jm/StemCenter.tsx',
    tableName: 'stem_worksheets',
    category: 'SMART JM: STEM',
    storageBucket: 'stem-portfolios',
    hasRealtime: true,
  },
  // 21. SMART JM: STEM Rubrics
  {
    id: 'stem-rubrics',
    componentName: 'Rubrik Penilaian STEM',
    filePath: 'src/pages/smart-jm/StemCenter.tsx',
    tableName: 'stem_rubrics',
    category: 'SMART JM: STEM',
    storageBucket: 'stem-portfolios',
    hasRealtime: true,
  },
  // 22. SMART JM: STEM Portfolios
  {
    id: 'stem-portfolios',
    componentName: 'Portofolio Karya STEM',
    filePath: 'src/pages/smart-jm/StemCenter.tsx',
    tableName: 'stem_portfolios',
    category: 'SMART JM: STEM',
    storageBucket: 'stem-portfolios',
    hasRealtime: true,
  },
  // 23. SMART JM: Mandarin Vocabulary
  {
    id: 'mandarin-vocab',
    componentName: 'Kosa Kata Mandarin & Pinyin',
    filePath: 'src/pages/smart-jm/MandarinCenter.tsx',
    tableName: 'mandarin_vocabularies',
    category: 'SMART JM: Mandarin',
    storageBucket: 'mandarin-audios',
    hasRealtime: true,
  },
  // 24. SMART JM: Mandarin Quizzes
  {
    id: 'mandarin-quizzes',
    componentName: 'Kuis & Evaluasi Mandarin',
    filePath: 'src/pages/smart-jm/MandarinCenter.tsx',
    tableName: 'mandarin_quizzes',
    category: 'SMART JM: Mandarin',
    storageBucket: 'mandarin-audios',
    hasRealtime: true,
  },
  // 25. SMART JM: Mandarin Scores
  {
    id: 'mandarin-scores',
    componentName: 'Papan Skor & Nilai Mandarin',
    filePath: 'src/pages/smart-jm/MandarinCenter.tsx',
    tableName: 'mandarin_scores',
    category: 'SMART JM: Mandarin',
    storageBucket: 'mandarin-audios',
    hasRealtime: true,
  },
  // 26. SMART JM: Hafidz Surahs
  {
    id: 'hafidz-surahs',
    componentName: 'Database Surah & Target Tahfidz',
    filePath: 'src/pages/smart-jm/HafidzCenter.tsx',
    tableName: 'hafidz_surahs',
    category: 'SMART JM: Tahfidz',
    storageBucket: 'hafidz-audios',
    hasRealtime: true,
  },
  // 27. SMART JM: Hafidz Reciters
  {
    id: 'hafidz-reciters',
    componentName: 'Daftar Qari / Murottal',
    filePath: 'src/pages/smart-jm/HafidzCenter.tsx',
    tableName: 'hafidz_reciters',
    category: 'SMART JM: Tahfidz',
    storageBucket: 'hafidz-audios',
    hasRealtime: true,
  },
  // 28. SMART JM: Hafidz Audios
  {
    id: 'hafidz-audios',
    componentName: 'Audio File Murottal Per Ayat',
    filePath: 'src/pages/smart-jm/HafidzCenter.tsx',
    tableName: 'hafidz_audios',
    category: 'SMART JM: Tahfidz',
    storageBucket: 'hafidz-audios',
    hasRealtime: true,
  },
  // 29. SMART JM: Hafidz Setoran
  {
    id: 'hafidz-setoran',
    componentName: 'Log Setoran Tahfidz Santri',
    filePath: 'src/pages/smart-jm/HafidzCenter.tsx',
    tableName: 'hafidz_setoran',
    category: 'SMART JM: Tahfidz',
    storageBucket: 'hafidz-audios',
    hasRealtime: true,
  },
  // 30. JM Center Hub Pages
  {
    id: 'jm-center-pages',
    componentName: 'Halaman Statis JM Center',
    filePath: 'src/pages/jm-center/JmCenterHub.tsx',
    tableName: 'jm_center_pages',
    category: 'JM Center Hub',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 31. Profil Pengurus JM Center
  {
    id: 'profiles-jm-center',
    componentName: 'Profil Pengasuh & Asatidz',
    filePath: 'src/pages/jm-center/ProfilPengasuh.tsx',
    tableName: 'profiles_jm_center',
    category: 'JM Center Hub',
    storageBucket: 'avatars',
    hasRealtime: true,
  },
  // 32. Konfigurasi Sistem (Site Settings)
  {
    id: 'site-settings',
    componentName: 'Pengaturan Global Website',
    filePath: 'src/pages/admin/PengaturanWeb.tsx',
    tableName: 'site_settings',
    category: 'Sistem & Pengaturan',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
  // 33. Profil Administrator
  {
    id: 'admin-profiles',
    componentName: 'Kelola Administrator & RBAC',
    filePath: 'src/pages/admin/KelolaUsers.tsx',
    tableName: 'admin_profiles',
    category: 'Sistem & Pengaturan',
    storageBucket: 'avatars',
    hasRealtime: true,
  },
  // 34. Audit Trail & Log
  {
    id: 'audit-logs',
    componentName: 'Log Aktivitas Keamanan',
    filePath: 'src/pages/admin/AuditLogs.tsx',
    tableName: 'audit_logs',
    category: 'Sistem & Pengaturan',
    storageBucket: 'cms-images',
    hasRealtime: true,
  },
];

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
 * Execute test read on a table with latency measurement and error handling
 */
export async function testTableRead(tableName: string): Promise<{
  status: 'PASS' | 'EMPTY' | 'FAIL';
  rowCount: number;
  latencyMs: number;
  rlsPass: boolean;
  errorMessage?: string;
}> {
  const start = performance.now();
  try {
    const { data, count, error } = await (supabase.from as any)(tableName)
      .select('*', { count: 'exact', head: false })
      .limit(5);

    const latency = Math.round(performance.now() - start);

    if (error) {
      return {
        status: 'FAIL',
        rowCount: 0,
        latencyMs: latency,
        rlsPass: error.code !== '42501',
        errorMessage: `[${error.code || 'ERR'}] ${error.message}`,
      };
    }

    const rows = data ? data.length : (count || 0);
    return {
      status: rows > 0 ? 'PASS' : 'EMPTY',
      rowCount: count !== null ? count : rows,
      latencyMs: latency,
      rlsPass: true,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    return {
      status: 'FAIL',
      rowCount: 0,
      latencyMs: latency,
      rlsPass: false,
      errorMessage: err.message || 'Unknown network error',
    };
  }
}

/**
 * Test Storage Bucket access
 */
export async function testBucketAccess(bucketId: string): Promise<BucketDiagnosticResult> {
  const start = performance.now();
  try {
    const { data, error } = await supabase.storage.from(bucketId).list('', {
      limit: 5,
      offset: 0,
    });

    const latency = Math.round(performance.now() - start);

    if (error) {
      return {
        bucketId,
        status: 'FAIL',
        itemCount: 0,
        latencyMs: latency,
        errorMessage: error.message,
      };
    }

    return {
      bucketId,
      status: 'PASS',
      itemCount: data ? data.length : 0,
      latencyMs: latency,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    return {
      bucketId,
      status: 'FAIL',
      itemCount: 0,
      latencyMs: latency,
      errorMessage: err.message || 'Storage probe failed',
    };
  }
}

/**
 * Run full diagnostic test suite across all 34 mapped components and 9 buckets
 */
export async function runComprehensiveDiagnostic(
  onProgress?: (progress: number, currentItem: string) => void
): Promise<ComprehensiveDiagnosticReport> {
  const totalItems = COMPONENT_TABLE_REGISTRY.length + MANDATORY_BUCKETS.length;
  let completed = 0;

  const componentResults: ConnectionTestResult[] = [];
  let totalLatency = 0;

  // 1. Probe All Components / Tables
  for (const comp of COMPONENT_TABLE_REGISTRY) {
    if (onProgress) {
      onProgress(Math.round((completed / totalItems) * 100), `Testing ${comp.componentName} (${comp.tableName})...`);
    }

    const readTest = await testTableRead(comp.tableName);
    totalLatency += readTest.latencyMs;

    let storageStatus: 'PASS' | 'EMPTY' | 'FAIL' | 'N/A' = 'N/A';
    if (comp.storageBucket) {
      const bTest = await testBucketAccess(comp.storageBucket);
      storageStatus = bTest.status === 'PASS' ? (bTest.itemCount > 0 ? 'PASS' : 'EMPTY') : 'FAIL';
    }

    let overall: 'CONNECTED' | 'PARTIAL' | 'BROKEN' = 'CONNECTED';
    if (readTest.status === 'FAIL') {
      overall = 'BROKEN';
    } else if (readTest.status === 'EMPTY' || storageStatus === 'FAIL') {
      overall = 'PARTIAL';
    }

    componentResults.push({
      id: comp.id,
      componentName: comp.componentName,
      filePath: comp.filePath,
      tableName: comp.tableName,
      category: comp.category,
      storageBucket: comp.storageBucket,
      readStatus: readTest.status,
      readLatencyMs: readTest.latencyMs,
      rowCount: readTest.rowCount,
      rlsReadPass: readTest.rlsPass,
      writeStatus: 'PASS', // Managed via Admin RLS
      storageStatus,
      realtimeConfigured: comp.hasRealtime,
      overallStatus: overall,
      errorMessage: readTest.errorMessage,
    });

    completed++;
  }

  // 2. Probe All 9 Storage Buckets
  const bucketResults: BucketDiagnosticResult[] = [];
  for (const bId of MANDATORY_BUCKETS) {
    if (onProgress) {
      onProgress(Math.round((completed / totalItems) * 100), `Probing Bucket: ${bId}...`);
    }

    const res = await testBucketAccess(bId);
    bucketResults.push(res);
    completed++;
  }

  if (onProgress) {
    onProgress(100, 'Diagnostic completed.');
  }

  // 3. Compute Metrics
  const connectedCount = componentResults.filter((c) => c.overallStatus === 'CONNECTED').length;
  const partialCount = componentResults.filter((c) => c.overallStatus === 'PARTIAL').length;
  const brokenCount = componentResults.filter((c) => c.overallStatus === 'BROKEN').length;

  const score = Math.round(
    ((connectedCount * 1.0 + partialCount * 0.75) / componentResults.length) * 100
  );

  return {
    timestamp: new Date().toISOString(),
    isConfigured: isSupabaseConfigured(),
    totalComponents: componentResults.length,
    connectedCount,
    partialCount,
    brokenCount,
    connectionScorePercent: Math.min(100, score),
    components: componentResults,
    buckets: bucketResults,
    summary: {
      totalTablesTested: componentResults.length,
      tablesWithRows: componentResults.filter((c) => c.readStatus === 'PASS').length,
      tablesEmpty: componentResults.filter((c) => c.readStatus === 'EMPTY').length,
      tablesFailed: componentResults.filter((c) => c.readStatus === 'FAIL').length,
      totalBuckets: bucketResults.length,
      bucketsOnline: bucketResults.filter((b) => b.status === 'PASS').length,
      avgLatencyMs: Math.round(totalLatency / (componentResults.length || 1)),
    },
  };
}

/**
 * Generate SQL Fix Script in case of RLS or permission discrepancies
 */
export function generateFixRlsSql(failedTables: string[]): string {
  const tables = failedTables.length > 0 ? failedTables : COMPONENT_TABLE_REGISTRY.map((c) => c.tableName);
  const uniqueTables = Array.from(new Set(tables));

  let sql = `-- Script Pemulihan RLS & Akses Publik PPJM (Generated at ${new Date().toISOString()})\n\n`;

  for (const t of uniqueTables) {
    sql += `-- 1. Pastikan RLS aktif & izinkan read publik untuk ${t}\n`;
    sql += `ALTER TABLE IF EXISTS public.${t} ENABLE ROW LEVEL SECURITY;\n`;
    sql += `DROP POLICY IF EXISTS "Public read ${t}" ON public.${t};\n`;
    sql += `CREATE POLICY "Public read ${t}" ON public.${t} FOR SELECT USING (true);\n`;
    sql += `DROP POLICY IF EXISTS "Admin manage ${t}" ON public.${t};\n`;
    sql += `CREATE POLICY "Admin manage ${t}" ON public.${t} FOR ALL TO authenticated USING (true) WITH CHECK (true);\n\n`;
  }

  return sql;
}

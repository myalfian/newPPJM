import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Layout,
  Database,
  Image,
  Film,
  FileText,
  Newspaper,
  Table,
  Search,
  Filter,
  Plus,
  Users,
  BookOpen,
  Target,
  MapPin,
  Layers,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

type AssetTab = 'master' | 'database' | 'photo' | 'video' | 'document' | 'article';

const TAB_CONFIG: Record<AssetTab, { label: string; icon: React.ElementType }> = {
  master:   { label: 'Master Data',       icon: Layout },
  database: { label: 'Database Assets',   icon: Database },
  photo:    { label: 'Foto',              icon: Image },
  video:    { label: 'Video',             icon: Film },
  document: { label: 'Dokumen',           icon: FileText },
  article:  { label: 'Artikel / Naskah',  icon: Newspaper },
};

const MOCK_PHOTOS = [
  { id: 1, title: 'Kegiatan Tahfidz', category: 'Kegiatan', size: '2.4 MB', updated: '2026-10-28' },
  { id: 2, title: 'Wisuda Santri', category: 'Acara', size: '3.1 MB', updated: '2026-10-25' },
  { id: 3, title: 'Kajian Rutin', category: 'Agama', size: '1.8 MB', updated: '2026-10-20' },
  { id: 4, title: 'Olahraga Bulanan', category: 'Olahraga', size: '2.0 MB', updated: '2026-10-15' },
  { id: 5, title: 'Prestasi Olahraga', category: 'Prestasi', size: '1.5 MB', updated: '2026-10-10' },
  { id: 6, title: 'Bazaar Santri', category: 'Kewirausahaan', size: '2.7 MB', updated: '2026-10-05' },
];

const MOCK_VIDEOS = [
  { id: 1, title: 'Sambutan Mudir', category: 'Acara', duration: '12:45', views: '1.2K', updated: '2026-10-27' },
  { id: 2, title: 'Kajian Jumat', category: 'Agama', duration: '45:30', views: '850', updated: '2026-10-24' },
  { id: 3, title: 'Lomba Memorisasi', category: 'Kegiatan', duration: '08:15', views: '420', updated: '2026-10-18' },
  { id: 4, title: 'Turnamen Futsal', category: 'Olahraga', duration: '15:20', views: '640', updated: '2026-10-12' },
  { id: 5, title: 'Pentas Seni', category: 'Seni', duration: '22:10', views: '730', updated: '2026-10-08' },
];

const MOCK_DOCUMENTS = [
  { id: 1, title: 'SK Pendirian Pondok', category: 'Surat Keputusan', type: 'PDF', size: '2.4 MB', updated: '2026-11-01' },
  { id: 2, title: 'Kurikulum SMP Plus', category: 'Dokumen Akademik', type: 'PDF', size: '850 KB', updated: '2026-10-29' },
  { id: 3, title: 'Laporan Keuangan Bulanan', category: 'Laporan', type: 'XLSX', size: '450 KB', updated: '2026-10-25' },
  { id: 4, title: 'SOP Tata Tertib Santri', category: 'Pedoman', type: 'PDF', size: '620 KB', updated: '2026-10-20' },
  { id: 5, title: 'Panduan Tahfidz', category: 'Pedoman', type: 'DOCX', size: '380 KB', updated: '2026-10-18' },
];

const MOCK_ARTICLES = [
  { id: 1, title: 'Pembentukan Kabinet OSIS Baru', category: 'Berita OSIS', author: 'Ustadz Riski', date: '2026-11-02', status: 'Published' },
  { id: 2, title: 'Lomba Tahfidz Tahunan 2026', category: 'Pengumuman', author: 'Panitia', date: '2026-10-30', status: 'Published' },
  { id: 3, title: 'Hasil Olimpiade Sains Tingkat Provinsi', category: 'Prestasi', author: 'Panitia', date: '2026-10-28', status: 'Published' },
  { id: 4, title: 'Jadwal KBM Semester Ganjil', category: 'Akademik', author: 'Kepala Sekolah', date: '2026-10-25', status: 'Draft' },
  { id: 5, title: 'Pekan Bahasa Arab', category: 'Kegiatan', author: 'Pengurus Bahasa', date: '2026-10-20', status: 'Published' },
];

const MOCK_DB_TABLES = [
  { name: 'profiles', rows: 1254, size: '45.2 MB', updated: '2026-11-05' },
  { name: 'programs_pondok', rows: 342, size: '12.8 MB', updated: '2026-11-04' },
  { name: 'programs_sekolah', rows: 89, size: '8.4 MB', updated: '2026-11-03' },
  { name: 'stem_projects', rows: 67, size: '5.6 MB', updated: '2026-11-02' },
  { name: 'mandarin_lessons', rows: 234, size: '18.9 MB', updated: '2026-11-01' },
  { name: 'osis_events', rows: 156, size: '7.3 MB', updated: '2026-10-31' },
];

const MOCK_MASTER_DATA = [
  { label: 'Data Kelas', count: 6, icon: Layout },
  { label: 'Data Jabatan', count: 12, icon: Users },
  { label: 'Data Mata Pelajaran', count: 28, icon: BookOpen },
  { label: 'Data Kategori', count: 15, icon: Layers },
  { label: 'Data Sasaran', count: 9, icon: Target },
  { label: 'Data Lokasi', count: 22, icon: MapPin },
];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<AssetTab>('master');
  const [searchQuery, setSearchQuery] = useState('');
  const uniqueId = `asset-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-slate-200/70 dark:border-zinc-800/70 pb-1.5 sm:pb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <LayoutDashboard className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Manajemen Aset & Master Data</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Asset Management</h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Kelola master data, tabel basis data, dan aset multimedia (foto, video, dokumen, artikel) dari satu tempat.
          </p>
        </div>
        <div className="relative mt-2 sm:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aset atau data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 sm:w-96 pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="flex border-b border-slate-200/70 dark:border-zinc-800/70 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <ul className="bottom-curved-tab-list flex items-center gap-2">
          {Object.entries(TAB_CONFIG).map(([key, tab]) => (
            <li key={key} className="bottom-curved-tab-col flex-none h-full flex items-center justify-center snap-start shrink-0">
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as AssetTab)}
                aria-pressed={activeTab === key}
                className={`bottom-curved-tab-btn ${activeTab === key ? 'active' : ''}`}
              >
                {activeTab === key && (
                  <motion.div
                    layoutId={`${uniqueId}-pill-${key}`}
                    layout="position"
                    className="bottom-curved-pointer"
                    transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.58 }}
                  >
                    <svg
                      viewBox="0 0 74 22"
                      className="bottom-curved-notch-svg"
                      width="74"
                      height="22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <radialGradient id={`bottomNotchDotGrad-${uniqueId}-${key}`} cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#fffbeb" />
                          <stop offset="35%" stopColor="#fde047" />
                          <stop offset="75%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#92400e" />
                        </radialGradient>
                        <path
                          d="M 0 22 C 16 22, 22 4, 37 4 C 52 4, 58 22, 74 22 Z"
                          className="bottom-curved-notch-surface"
                          stroke="none"
                        />
                        <circle
                          cx="37"
                          cy="16"
                          r="4.8"
                          fill={`url(#bottomNotchDotGrad-${uniqueId}-${key})`}
                          className="bottom-curved-notch-dot"
                          stroke="none"
                        />
                        <circle cx="35.5" cy="14.5" r="1.4" fill="#ffffff" opacity="0.85" stroke="none" />
                      </defs>
                    </svg>
                  </motion.div>
                )}
                <span className="bottom-curved-tab-text font-extrabold tracking-tight">
                  <span className={`text-white ${activeTab === key ? 'text-[#facc15]' : ''}`}>
                    {tab.label}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        {activeTab === 'master' && <MasterDataSection />}
        {activeTab === 'database' && <DatabaseAssetsSection />}
        {activeTab === 'photo' && <PhotoAssetsSection />}
        {activeTab === 'video' && <VideoAssetsSection />}
        {activeTab === 'document' && <DocumentAssetsSection />}
        {activeTab === 'article' && <ArticleAssetsSection />}
      </div>
    </div>
  );
}

function MasterDataSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Master Data</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Kelola data master sistem</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white text-xs font-bold transition">Tambah Data</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-bold text-[10px] uppercase border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2">Nama Master Data</th>
              <th className="px-3 py-2 text-center">Jumlah Data</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-800/50 text-zinc-600 dark:text-zinc-400">
            {MOCK_MASTER_DATA.map((item) => (
              <tr key={item.label} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">{item.label}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-center font-mono text-zinc-500 dark:text-zinc-400">{item.count}</td>
                <td className="px-3 py-2 text-center">
                  <button className="text-xs font-bold text-emerald-600 hover:text-emerald-800">Kelola</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DatabaseAssetsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Database Assets</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Tabel database dan tabel data</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white text-xs font-bold transition">Sinkronisasi</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-bold text-[10px] uppercase border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2">Nama Tabel</th>
              <th className="px-3 py-2 text-center">Jumlah Baris</th>
              <th className="px-3 py-2 text-center">Ukuran</th>
              <th className="px-3 py-2 text-center">Terakhir Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-800/50 text-zinc-600 dark:text-zinc-400">
            {MOCK_DB_TABLES.map((t) => (
              <tr key={t.name} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-3 py-2">{t.name}</td>
                <td className="px-3 py-2 text-center font-mono text-zinc-500 dark:text-zinc-400">{t.rows}</td>
                <td className="px-3 py-2 text-center font-mono text-zinc-500 dark:text-zinc-400">{t.size}</td>
                <td className="px-3 py-2 text-center font-mono text-zinc-500 dark:text-zinc-400">{t.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PhotoAssetsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Foto Assets</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Galeri foto kegiatan santri dan acara</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white text-xs font-bold transition">Unggah Foto</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {MOCK_PHOTOS.map((photo) => (
          <div key={photo.id} className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img src={`https://picsum.photos/seed/${photo.id}/400/300`} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-opacity" />
              <div className="absolute top-2 left-2 right-2 flex justify-between text-white text-[10px] font-bold p-2">
                <span>{photo.category}</span>
                <span>{photo.size}</span>
              </div>
            </div>
            <div className="p-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{photo.title}</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{photo.updated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoAssetsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Video Assets</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Arsip video kegiatan dan dokumentasi</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white text-xs font-bold transition">Unggah Video</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_VIDEOS.map((v) => (
          <div key={v.id} className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img src={`https://picsum.photos/seed/${v.id}/400/225`} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-opacity" />
              <div className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                <span>{v.duration}</span>
                <span>{v.views}</span>
              </div>
            </div>
            <div className="p-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{v.title}</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{v.category}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{v.updated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentAssetsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Dokumen Assets</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">PDF, Excel, Word, dan dokumen lainnya</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white text-xs font-bold transition">Unggah Dokumen</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 font-bold text-[10px] uppercase border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2">Nama Dokumen</th>
              <th className="px-3 py-2 text-center">Kategori</th>
              <th className="px-3 py-2 text-center">Tipe</th>
              <th className="px-3 py-2 text-center">Ukuran</th>
              <th className="px-3 py-2 text-center">Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-zinc-800/50 text-zinc-600 dark:text-zinc-400">
            {MOCK_DOCUMENTS.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-zinc-400 shrink-0">D</span>
                    <span className="font-semibold text-zinc-900 dark:text-white truncate">{d.title}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-zinc-500 dark:text-zinc-400">{d.category}</td>
                <td className="px-3 py-2 text-center">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[9px] font-bold text-blue-700">{d.type}</span>
                </td>
                <td className="px-3 py-2 text-center font-mono text-zinc-500 dark:text-zinc-400">{d.size}</td>
                <td className="px-3 py-2 text-center font-mono text-zinc-500 dark:text-zinc-400">{d.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArticleAssetsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Artikel / Naskah</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Artikel, naskah, dan tulisan pendukung</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-[#0d4a28] hover:bg-[#0a3a20] text-white text-xs font-bold transition">Tulis Artikel</button>
      </div>
      <div className="space-y-2">
        {MOCK_ARTICLES.map((article) => (
          <div key={article.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0">
              <Newspaper className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{article.title}</h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{article.category}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                <span>{article.author}</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-zinc-800"></span>
                <span>{article.date}</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-zinc-800"></span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">{article.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

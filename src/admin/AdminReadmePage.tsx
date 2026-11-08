import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  Database,
  Smartphone,
  Lock,
  CheckCircle2,
  FileCode2,
  ChevronRight,
  Server,
  FolderTree,
} from 'lucide-react';

interface ReadmeTab {
  id: string;
  title: string;
  icon: React.ElementType;
}

const TABS: ReadmeTab[] = [
  { id: 'ringkasan', title: 'Ringkasan & Identitas', icon: Sparkles },
  { id: 'stack', title: 'Tech Stack & Library', icon: Code2 },
  { id: 'struktur', title: 'Struktur Folder', icon: FolderTree },
  { id: 'roles', title: 'Hak Akses 10 Role (RBAC)', icon: ShieldCheck },
  { id: 'sidebar', title: 'Navigasi & Modul Admin', icon: Layers },
  { id: 'media', title: 'Media & Pipeline WebP', icon: Server },
  { id: 'keamanan', title: 'Keamanan & Deployment', icon: Lock },
];

export const AdminReadmePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ringkasan');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#115E59]">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Dokumentasi Resmi Sistem (README.md)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-teal-950 tracking-tight mt-1">
            Panduan &amp; Spesifikasi Terpadu PPJM
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Pondok Pesantren &amp; SMP Plus Jauharul Maknuun, Lasem, Sidayu, Gresik, Jawa Timur.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
            Build: Passing
          </span>
          <span className="px-3 py-1 rounded-full bg-teal-50 text-[#115E59] text-xs font-bold border border-teal-200">
            TS Strict: Clean
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-200/80 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#115E59] text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:text-teal-950 hover:bg-zinc-100 border border-zinc-200/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-7 shadow-xs space-y-6">
        {/* TAB 1: RINGKASAN */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>1. Ringkasan Arsitektur &amp; Identitas Sistem</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Platform web resmi terintegrasi yang melayani portal informasi publik, pendaftaran murid baru (SPMB), galeri multimedia beranimasi, modul pembelajaran STEM &amp; Bahasa Mandarin, serta Content Management System (CMS) Zero-IT berbasis peran (RBAC).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 space-y-1">
                <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">Lembaga Naungan</span>
                <p className="text-sm font-extrabold text-teal-950">Yayasan Pondok Pesantren Jauharul Maknuun</p>
                <p className="text-xs text-zinc-600">SMP Plus Jauharul Maknuun</p>
              </div>
              <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 space-y-1">
                <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">Lokasi Lembaga</span>
                <p className="text-sm font-extrabold text-teal-950">Lasem, Sidayu, Kabupaten Gresik</p>
                <p className="text-xs text-zinc-600">Jawa Timur, Indonesia</p>
              </div>
              <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 space-y-1">
                <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">Domain Resmi</span>
                <p className="text-sm font-extrabold text-[#115E59]">https://ppjauharulmaknuun.sch.id/</p>
                <p className="text-xs text-zinc-600">Production Ready SSL Certified</p>
              </div>
              <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 space-y-1">
                <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">Target Aksesibilitas</span>
                <p className="text-sm font-extrabold text-teal-950">WCAG 2.1 AA Compliant</p>
                <p className="text-xs text-zinc-600">Touch Target &ge; 44&times;44 px, ARIA describedby</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STACK */}
        {activeTab === 'stack' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#115E59]" />
                <span>2. Stack Teknologi &amp; Library Inti</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Kombinasi teknologi mutakhir untuk performa tinggi, keandalan offline-first, dan keamanan data level enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'React 19 & React Router 7', desc: 'Komponen fungsi modern, routing bersarang (/admin, /guru, /santri).' },
                { name: 'Tailwind CSS v4', desc: 'Palet pesantren: Emerald #115E59, Gold #D4AF37, dan Canvas #FAF7F0.' },
                { name: 'Framer Motion', desc: 'Transisi halus coverflow, bottom sheet mobile, dan animasi kartu.' },
                { name: 'Dnd Kit', desc: 'Drag-and-drop pengurutan konten admin real-time tanpa reload halaman.' },
                { name: 'Supabase JS', desc: 'Database PostgreSQL 17 + GoTrue Auth + RLS + Storage WebP.' },
                { name: 'TipTap StarterKit', desc: 'Rich text WYSIWYG editor aman dengan sanitasi HTML otomatis.' },
              ].map((item) => (
                <div key={item.name} className="p-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/60 space-y-1">
                  <p className="text-xs font-black text-teal-950">{item.name}</p>
                  <p className="text-xs text-zinc-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STRUKTUR FOLDER */}
        {activeTab === 'struktur' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#115E59]" />
                <span>3. Struktur Folder &amp; Kode Sumber Proyek</span>
              </h2>
            </div>
            <pre className="p-4 rounded-2xl bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`NewPPPJM/
├── public/                 # Aset statis (favicon, logo SVG)
├── src/
│   ├── admin/              # Panel Admin CMS, CrudEditor, SliderSettings
│   ├── components/         # Komponen bersama (Navbar, CardImageSlider, Lightbox)
│   ├── guru/               # Portal kerja Guru & Musyrif
│   ├── santri/             # Portal belajar & hafalan Santri
│   ├── lib/                # Client Supabase, WebP converter, sliderSettings
│   ├── pages/              # Halaman publik (Beranda, SPMB, Galeri, OSIS, dll)
│   └── types/              # Deklarasi tipe TypeScript terpadu
├── supabase/
│   └── migrations/         # File migrasi SQL deklaratif PostgreSQL
└── package.json            # Daftar dependensi & script`}
            </pre>
          </div>
        )}

        {/* TAB 4: ROLES (RBAC) */}
        {activeTab === 'roles' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>4. Sistem Hak Akses 10 Role (RBAC Tiga Lapis)</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Ditegakkan pada Lapisan UI, Lapisan Router Middleware, dan Lapisan Database Row Level Security (RLS).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { role: 'super_admin', label: 'Super Admin', desc: 'Akses penuh CMS, slider settings global, kelola akun, dan matriks izin.' },
                { role: 'yayasan', label: 'Dewan Pembina Yayasan', desc: 'Supervisi capaian akademik, profil santri, guru, dan sarana lembaga.' },
                { role: 'kepsek', label: 'Kepala SMP Plus JM', desc: 'Supervisi KBM kurikulum, evaluasi tugas guru, dan persetujuan nilai.' },
                { role: 'guru', label: 'Guru Pengampu Mapel', desc: 'Mengelola tugas kelas miliknya, input materi, dan menilai submission.' },
                { role: 'musyrif', label: 'Pembina Asrama & Halaqah', desc: 'Pengawasan amaliyah santri, kedisiplinan diniyah, dan rekam hafalan.' },
                { role: 'santri', label: 'Santriwan / Santriwati', desc: 'Portal tugas mandiri, setoran hafalan Qur’an, dan catatan prestasi.' },
                { role: 'ppdb', label: 'Panitia SPMB', desc: 'Verifikasi berkas calon murid baru dan komunikasi dengan wali santri.' },
                { role: 'keuangan', label: 'Tim Administrasi & Kasir', desc: 'Pengelolaan tagihan biaya pendidikan, infak, dan rekap keuangan.' },
                { role: 'humas', label: 'Hubungan Masyarakat', desc: 'Publikasi warta berita resmi, agenda pesantren, dan media sosial.' },
                { role: 'osis_pengurus', label: 'Pengurus OSIS Santri', desc: 'Dokumentasi kegiatan, struktur kabinet, dan program khidmah.' },
              ].map((r) => (
                <div key={r.role} className="p-3.5 rounded-2xl border border-zinc-100 bg-zinc-50/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-950">{r.label}</span>
                    <code className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      {r.role}
                    </code>
                  </div>
                  <p className="text-xs text-zinc-600">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SIDEBAR */}
        {activeTab === 'sidebar' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#115E59]" />
                <span>5. Struktur Sidebar &amp; Navigasi Admin (6 Kelompok)</span>
              </h2>
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-700">
              <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>1. Pusat Kendali &amp; Beranda:</strong> Ringkasan Dashboard, Bulk Upload, Slider Beranda, Quick Menus, Kontak Medsos, Sambutan, Profil Saya, dan Panduan Read Me.
              </li>
              <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>2. Profil &amp; Kelembagaan:</strong> Identitas Institusi, Visi Misi, Sejarah Biografi, dan Fasilitas.
              </li>
              <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>3. Akademik, Diniyah &amp; STEM:</strong> Program Pondok, Program Sekolah, Madin, Ekskul, Mandarin, dan Lembar Kerja STEM.
              </li>
              <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>4. Kesiswaan, Prestasi &amp; OSIS:</strong> Prestasi Santri, Event OSIS, Program Kerja, dan Dokumentasi Naskah.
              </li>
              <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>5. Publikasi &amp; Media Santri:</strong> Berita Resmi, Info Terkini, Agenda, Karya Siswa, Galeri Foto &amp; Video.
              </li>
              <li className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>6. Pengaturan &amp; Hak Akses:</strong> Pengaturan Slider Global, Kelola Pengguna, Matriks Hak Akses, dan Master Data.
              </li>
            </ul>
          </div>
        )}

        {/* TAB 6: MEDIA WEBP */}
        {activeTab === 'media' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-[#115E59]" />
                <span>6. Fitur Media &amp; Pipeline Kompresi WebP Otomatis</span>
              </h2>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <p className="font-bold">Otomatisasi Kompresi Sisi Klien (Client-Side Optimizer):</p>
              <p className="leading-relaxed">
                Setiap foto yang diunggah oleh staf (hingga 20 MB dari kamera smartphone) secara otomatis dikonversi menjadi format WebP berkualitas tinggi dengan kompresi cerdas (&sim;120 KB) sebelum dikirim ke Supabase Storage. Hal ini menghemat bandwidth hingga 85% dan memastikan loading halaman super cepat.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: KEAMANAN & DEPLOYMENT */}
        {activeTab === 'keamanan' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-700" />
                <span>7. Standar Keamanan &amp; Deployment</span>
              </h2>
            </div>
            <div className="space-y-2 text-xs text-zinc-700">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>Zero Secret Policy:</strong> Tidak ada kata sandi, token, atau service key yang disimpan di kode sumber.
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>Content Security Policy:</strong> Proteksi XSS dan sanitasi rich text dengan DOMPurify dan TipTap schema restrictions.
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <strong>Continuous Deployment:</strong> Terintegrasi dengan Cloudflare Pages dan Vercel dengan optimasi Rolldown Vite engine.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


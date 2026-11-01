import React, { useState } from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';
import { BookOpen, GraduationCap, School, Layers } from 'lucide-react';

export const KelolaProgram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pondok' | 'sekolah' | 'madin'>('pondok');

  // Fields for Program Pondok Pesantren
  const pondokFields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Nama Program Pondok',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Tahfidzul Qur\'an 30 Juz Bersanad'
    },
    {
      name: 'description',
      label: 'Deskripsi Program & Metode',
      type: 'richtext',
      placeholder: 'Jelaskan tujuan, metode talaqqi, dan target hafalan...'
    }
  ];

  // Fields for Program SMP Plus (Sekolah)
  const sekolahFields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Nama Program Sekolah (SMP Plus)',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Kurikulum Merdeka Terakreditasi "A"'
    },
    {
      name: 'curriculum',
      label: 'Standar Kurikulum & Riset Terapan',
      type: 'textarea',
      placeholder: 'Kurikulum Terpadu Berstandar Nasional & Riset Terapan...'
    }
  ];

  // Fields for Program Madrasah Diniyah (MDT Wustho Flyers & Panduan)
  const madinFields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Judul Flyer / Panduan Madin',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Brosur & Kurikulum 9 Mapel Turats MDT Wustho'
    },
    {
      name: 'category',
      label: 'Kategori Dokumen',
      type: 'select',
      options: [
        { label: 'Brosur & Infografis', value: 'Brosur' },
        { label: 'Kurikulum Turats', value: 'Kurikulum' },
        { label: 'Jadwal & Panduan', value: 'Panduan' }
      ]
    },
    {
      name: 'image_url',
      label: 'Gambar / Poster Flyer',
      type: 'image',
      bucket: 'cms-images'
    },
    {
      name: 'pdf_url',
      label: 'Tautan PDF Unduhan (Opsional)',
      type: 'text',
      placeholder: 'https://... atau /documents/kurikulum-madin.pdf'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-3xl text-white shadow-lg border border-emerald-800/60 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>KONTEN AKADEMIK &amp; TAHFIDZ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Kelola Program Unggulan Santri
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Atur dan perbarui program unggulan untuk Pondok Pesantren, SMP Plus Jauharul Maknuun, dan Madrasah Diniyah Takmiliyah Wustho secara dinamis ke Supabase.
          </p>
        </div>
      </div>

      {/* Sub-Unit Tab Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('pondok')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pondok'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Program Pondok Pesantren</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sekolah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sekolah'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>2. Program SMP Plus (Sekolah)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('madin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'madin'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>3. Program Madrasah Diniyah</span>
        </button>
      </div>

      {/* Tab 1: Pondok Pesantren */}
      {activeTab === 'pondok' && (
        <MultiSectionBuilder
          tableName="programs_pondok"
          displayName="Program Pondok Pesantren"
          fields={pondokFields}
          allowFeatured={false}
          allowReorder={true}
          allowCategories={false}
          storageBucket="cms-images"
        />
      )}

      {/* Tab 2: SMP Plus */}
      {activeTab === 'sekolah' && (
        <MultiSectionBuilder
          tableName="programs_sekolah"
          displayName="Program SMP Plus Jauharul Maknuun"
          fields={sekolahFields}
          allowFeatured={false}
          allowReorder={true}
          allowCategories={false}
          storageBucket="cms-images"
        />
      )}

      {/* Tab 3: Madrasah Diniyah */}
      {activeTab === 'madin' && (
        <MultiSectionBuilder
          tableName="madin_flyers"
          displayName="Flyer & Dokumen MDT Wustho"
          fields={madinFields}
          allowFeatured={false}
          allowReorder={true}
          allowCategories={true}
          storageBucket="cms-images"
        />
      )}
    </div>
  );
};

export default KelolaProgram;


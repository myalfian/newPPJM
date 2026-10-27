import React from 'react';
import { Building2, CheckCircle2, GraduationCap, Award, BookOpen } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';
import { useCachedQuery } from '../../lib/queryCache';
import { fetchProgram } from '../../lib/profileQueries';

export const ProgramSekolah: React.FC = () => {
  const { data: progData } = useCachedQuery(
    'program-sekolah',
    () => fetchProgram('program-sekolah')
  );

  const customDesc = progData?.description;
  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 py-1.5 sm:py-2 space-y-1.5 sm:space-y-2">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-2.5 sm:p-3.5 lg:p-4 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pendidikan Formal Terpadu</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {progData?.title || 'Pendidikan Sekolah Berkarakter Islami'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Kurikulum nasional terakreditasi yang diintegrasikan secara holistik dengan nilai-nilai kesantrian dan riset teknologi.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3">
        <div className="lg:col-span-8 bg-white rounded-2xl p-3 sm:p-4 shadow-m3-1 border border-slate-200 space-y-2 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <h2 className="text-base sm:text-lg font-bold text-emerald-950">
            Harmoni Akademik Formal & Ruhaniyyah Pesantren
          </h2>
          {customDesc ? (
            <p className="whitespace-pre-line">{customDesc}</p>
          ) : (
            <p>
              Di Pondok Pesantren Jauharul Maknuun Lasem, pendidikan formal tidak diposisikan sebagai hal yang terpisah dari ketarbiyahan santri. Kami mendesain jadwal dan materi belajar agar para santri dapat berprestasi tinggi dalam mata pelajaran sains, matematika, dan literasi nasional tanpa mengorbankan waktu nderes al-Qur’an dan kajian kitab kuning.
            </p>
          )}

          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1.5">
            <h3 className="font-extrabold text-emerald-950 text-xs sm:text-sm">
              Keunggulan Kurikulum Sekolah PPJM:
            </h3>
            <ul className="space-y-1 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Guru & Asatidz Berkualifikasi:</strong> Pengajar lulusan perguruan tinggi terkemuka dan zawiyah pesantren ternama.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Integrasi Lab STEM & Komputer:</strong> Fasilitas laboratorium sains, coding dasar, dan mikrokontroler robotika santri.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Bimbingan Masuk Perguruan Tinggi:</strong> Program intensif UTBK, SNBP, serta peluang beasiswa studi ke Timur Tengah dan Tiongkok.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-m3-1 border border-slate-200 space-y-1.5">
            <h3 className="font-extrabold text-xs sm:text-sm text-emerald-950">
              Jenjang Pendidikan
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="font-bold text-emerald-900 text-xs sm:text-sm">Tingkat Menengah Pertama</div>
                <div className="text-slate-500 text-[11px] sm:text-xs">Fokus pada pembentukan pondasi adab, hafalan juz 30 & 1-5, serta sains dasar.</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="font-bold text-emerald-900 text-xs sm:text-sm">Tingkat Menengah Atas</div>
                <div className="text-slate-500 text-[11px] sm:text-xs">Pendalaman riset STEM, karya tulis ilmiah, dan sertifikasi bahasa Mandarin/Arab.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

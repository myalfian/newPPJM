import React from 'react';
import { Building2, CheckCircle2, GraduationCap, Award, BookOpen } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const ProgramSekolah: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 space-y-3 sm:space-y-4">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-4 sm:p-6 lg:p-7 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pendidikan Formal Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Pendidikan Sekolah Berkarakter Islami
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Kurikulum nasional terakreditasi yang diintegrasikan secara holistik dengan nilai-nilai kesantrian dan riset teknologi.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 shadow-m3-1 border border-slate-200 space-y-3.5 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-950">
            Harmoni Akademik Formal & Ruhaniyyah Pesantren
          </h2>
          <p>
            Di Pondok Pesantren Jauharul Maknuun Lasem, pendidikan formal tidak diposisikan sebagai hal yang terpisah dari ketarbiyahan santri. Kami mendesain jadwal dan materi belajar agar para santri dapat berprestasi tinggi dalam mata pelajaran sains, matematika, dan literasi nasional tanpa mengorbankan waktu nderes al-Qur’an dan kajian kitab kuning.
          </p>

          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-2">
            <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base">
              Keunggulan Kurikulum Sekolah PPJM:
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Guru & Asatidz Berkualifikasi:</strong> Pengajar lulusan perguruan tinggi terkemuka dan zawiyah pesantren ternama.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Integrasi Lab STEM & Komputer:</strong> Fasilitas laboratorium sains, coding dasar, dan mikrokontroler robotika santri.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span><strong>Bimbingan Masuk Perguruan Tinggi:</strong> Program intensif UTBK, SNBP, serta peluang beasiswa studi ke Timur Tengah dan Tiongkok.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-3.5 sm:p-4.5 shadow-m3-1 border border-slate-200 space-y-2.5">
            <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">
              Jenjang Pendidikan
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-emerald-900 text-xs sm:text-sm">Tingkat Menengah Pertama</div>
                <div className="text-slate-500 text-[11px] sm:text-xs">Fokus pada pembentukan pondasi adab, hafalan juz 30 & 1-5, serta sains dasar.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
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

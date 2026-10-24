import React from 'react';
import { Compass, Quote, CheckCircle2, Share2 } from 'lucide-react';
import { NavBarTabs } from '../../components/common/NavBarTabs';

export const Sambutan: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 space-y-3 sm:space-y-4">
      {/* Skeuomorphic Folder-Tab Breadcrumb Navigation */}
      <NavBarTabs />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-2xl p-4 sm:p-6 lg:p-7 text-white shadow-m3-2 relative overflow-hidden">
        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Kalam Hikmah Mudir Pesantren</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Sambutan Pengasuh Pondok Pesantren
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl">
            Pondok Pesantren Jauharul Maknuun Lasem, Sidayu, Kabupaten Gresik, Jawa Timur.
          </p>
        </div>
      </div>

      {/* Main Narrative & High-Res Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Photo & Quote Card */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-m3-1 border border-slate-200 space-y-2.5">
            <div className="h-72 sm:h-80 rounded-xl overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="Pengasuh KH. M. Jauharul Maknuun"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-0.5">
              <h3 className="font-extrabold text-base sm:text-lg text-emerald-950">
                KH. M. Jauharul Maknuun
              </h3>
              <p className="text-xs font-semibold text-gold-700">
                Mudir & Pengasuh Pondok Pesantren
              </p>
              <p className="text-[11px] text-slate-400">
                Lasem - Sidayu - Gresik
              </p>
            </div>
          </div>

          {/* Quote Card */}
          <div className="p-4 sm:p-4.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 space-y-2 relative">
            <Quote className="w-6 h-6 text-gold-500 opacity-60 absolute top-3 right-3" />
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Amanat Pesantren
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 italic leading-relaxed">
              “Kekuatan santri terletak pada keikhlasan niat, ketawadhuan adab, serta kesiapan menjawab tantangan zaman dengan bekal ilmu agama yang shahih dan teknologi yang maslahat.”
            </p>
          </div>
        </div>

        {/* Narrative Text */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 shadow-m3-1 border border-slate-200 space-y-3.5 text-slate-700 leading-relaxed text-xs sm:text-sm">
          <div className="font-quran text-2xl sm:text-3xl text-emerald-900 text-center py-2 border-b border-slate-100">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <p className="font-semibold text-emerald-900">
            Assalamu’alaikum Warahmatullahi Wabarakatuh,
          </p>

          <p>
            Segala puji bagi Allah Subhanahu wa Ta’ala, Dzat yang telah melimpahkan anugerah taufiq, hidayah, dan inayah-Nya kepada kita semua. Shalawat serta salam semoga senantiasa tercurah ke haribaan Baginda Agung Nabi Muhammad SAW, beserta keluarga, para sahabat, dan pengikut beliau hingga akhir zaman.
          </p>

          <p>
            Selamat datang di media informasi resmi <strong>Pondok Pesantren Jauharul Maknuun Lasem, Sidayu, Gresik</strong>. Di era disrupsi digital yang bergerak begitu cepat, pesantren kami terus berikhtiar mempertahankan nilai-nilai salafus sholih yang luhur seraya membuka diri terhadap kemaslahatan inovasi teknologi modern.
          </p>

          <p>
            Nama <em>“Jauharul Maknuun”</em> (Permata yang Tersimpan Indah) terinspirasi dari kitab masyhur ilmu Balaghah karangan Syaikh Abdurrahman al-Akhdhari. Kami bertekad membimbing putra-putri santri agar bertransformasi menjadi mutiara-mutiara ilmu yang memancarkan akhlaqul karimah, ketajaman akal fikiran, serta keteguhan jiwa di manapun kelak mereka berkhidmat.
          </p>

          <div className="p-5 rounded-2xl bg-slate-50 border-l-4 border-emerald-700 space-y-2 text-sm">
            <div className="font-bold text-emerald-900">Fokus Tarbiyah Pesantren:</div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Penguasaan sanad kitab kuning (turats) berjenjang.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Karantina intensif Tahfidzul Qur’an 30 Juz mutqin.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Pengembangan sains terapan melalui Laboratorium STEM Santri.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Kemahiran bahasa penutur asli (Arab & Mandarin).</span>
              </li>
            </ul>
          </div>

          <p>
            Semoga kehadiran portal ini semakin mempererat ukhuwah islamiyyah antara pesantren, wali santri, alumni, dan segenap kaum muslimin. Kami memohon doa restu agar amanah pendidikan suci ini senantiasa diridhoi oleh Allah SWT.
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-emerald-900">Wassalamu’alaikum Warahmatullahi Wabarakatuh,</p>
              <p className="text-xs text-slate-500 mt-1">Lasem, Sidayu, Gresik</p>
            </div>
            <div className="font-quran text-2xl text-emerald-800">
              خادم المعهد جوهر المكنون
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

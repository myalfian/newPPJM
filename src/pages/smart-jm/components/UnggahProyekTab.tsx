import React, { useState } from 'react';
import { CloudUpload, CheckCircle2, Trash2 } from 'lucide-react';
import { StemUploadItem } from '../stemProjects';

interface UnggahProyekTabProps {
  _projectId: string;
  uploads: StemUploadItem[];
}

export const UnggahProyekTab: React.FC<UnggahProyekTabProps> = ({ _projectId, uploads }) => {
  const [formData, setFormData] = useState({ judul: '', deskripsi: '', linkVideo: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<StemUploadItem[]>(uploads);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (f.size > 20 * 1024 * 1024) {
        alert('Ukuran file maksimal 20MB');
        return;
      }
      setFile(f);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.deskripsi) {
      alert('Judul dan deskripsi wajib diisi');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      const newUpload: StemUploadItem = {
        id: `up-${Date.now()}`,
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        fileName: file?.name || 'Tidak ada file',
        fileSize: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '-',
        uploadedAt: new Date().toLocaleDateString('id-ID'),
      };
      setUploadHistory([newUpload, ...uploadHistory]);
      setFormData({ judul: '', deskripsi: '', linkVideo: '' });
      setFile(null);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <div className="space-y-5 p-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
          <CloudUpload className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Kumpulkan Karya Proyek</h4>
          <p className="text-xs text-slate-500">
            Unggah dokumen hasil praktikum untuk dinilai pembina
          </p>
        </div>
      </div>

      {/* Form Upload */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Judul Karya Siswa
            </label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Laporan Hydrolift Kelas VIII-A"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Deskripsi Singkat
            </label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              rows={3}
              placeholder="Ceritakan singkat tentang hasil proyek Anda..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Unggah File (Gambar / Video / PDF)
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:border-emerald-300 hover:bg-emerald-50 transition-all group cursor-pointer">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              {file ? (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div>
                  <CloudUpload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Klik untuk memilih file</span>
                  <p className="text-[10px] text-slate-400">
                    Maksimal 20MB • JPG, PNG, MP4, PDF, DOCX
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Link Video Opsional (YouTube / Drive)
          </label>
          <input
            type="url"
            value={formData.linkVideo}
            onChange={(e) => setFormData({ ...formData, linkVideo: e.target.value })}
            placeholder="https://youtu.be/..."
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading || !formData.judul || !formData.deskripsi}
          className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
            isUploading || !formData.judul || !formData.deskripsi
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 hover:shadow-emerald-400'
          }`}
        >
          {isUploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengunggah…
            </>
          ) : (
            <>
              <CloudUpload className="w-4 h-4" />
              Simpan & Kumpulkan
            </>
          )}
        </button>
      </form>

      {/* Riwayat Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-900 text-sm">Riwayat Pengumpulan</h5>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            {uploadHistory.length} berkas
          </span>
        </div>

        {uploadHistory.length === 0 ? (
          <div className="py-6 text-center text-slate-400">
            Belum ada berkas yang dikumpulkan.
          </div>
        ) : (
          <div className="space-y-2">
            {uploadHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{item.judul}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{item.deskripsi}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>{item.fileName}</span>
                    <span className="w-px h-3 bg-slate-300"></span>
                    <span>{item.fileSize}</span>
                    <span className="w-px h-3 bg-slate-300"></span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-slate-400 hover:text-red-600 transition-colors p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

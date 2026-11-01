# Arsitektur Word Toolbar Contextual Per Section (24 Section)
## Pondok Pesantren Jauharul Maknuun (PPJM)

Dokumen ini menjelaskan implementasi teknis dan panduan operasional integrasi **Microsoft Word-like Contextual Ribbon Toolbar** yang dirancang khusus untuk administrator pesantren dan pengasuh non-IT di seluruh modul Admin Editor PPJM.

---

### 1. Arsitektur Komponen

```
┌────────────────────────────────────────────────────────────────────────┐
│                   sectionToolbarConfig.ts (24 Section)                 │
│  - Definisi per seksi: sambutan, slider, quickmenu, keunggulan,        │
│    fasilitas, lembaga, program_pondok/smp/madin, stem, mandarin,       │
│    hafidz, prestasi, ekskul, osis, berita, galeri, agenda, dll.        │
│  - Metadata: show tools, tabs (Home, Insert, Layout), defaultStyle,    │
│    bucket storage, minHeight, maxLength.                               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               SectionWordEditor.tsx / WordToolbarPerSection            │
│  - TipTap Core Engine + Custom Extensions:                             │
│    • LetterSpacing (letter-spacing)                                    │
│    • WordSpacing (word-spacing)                                        │
│    • ParagraphSpacing (marginTop / marginBottom Sebelum & Sesudah)     │
│    • TextIndent (First-line indent & Hanging indent)                   │
│    • LineHeight (1.0 - 2.5)                                            │
│    • FontSize (10px - 36px)                                            │
│  - Ribbon Tabs:                                                        │
│    • Beranda (Home): Clipboard, Font, Paragraf, Gaya/Headings          │
│    • Sisipkan (Insert): Foto Komputer (WebP Auto), Tabel, YouTube,     │
│      Link, Garis Batas                                                 │
│    • Tata Letak (Layout): Spasi Baris, Jarak Paragraf, Indentasi       │
│  - Auto-draft Recovery (localStorage per sectionType + fieldName)      │
│  - Status Bar: Jumlah kata, karakter, estimasi waktu baca, zoom %      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTML Sanitized (DOMPurify)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SafeRichContent.tsx (Renderer Publik)                │
│  - Strict DOMPurify Sanitization dengan whitelist CSS properties:      │
│    letter-spacing, word-spacing, line-height, text-indent, margins     │
│  - Tipografi Tailwind Typography: prose prose-emerald                  │
│  - Mendukung tabel, iframe YouTube resmi, dan format tulisan Arab      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Peta Konfigurasi 24 Section (`sectionToolbarConfig.ts`)

| # | Section Type | Fields yang Dikonfigurasi | Bucket Supabase | Toolbar Tier | Fitur Khusus |
| :- | :--- | :--- | :--- | :--- | :--- |
| **1** | `sambutan` | `name`, `title`, `quote`, `message_short`, `message_full` | `avatars` | **Full Word Ribbon** | Font Amiri Arabic, justify, line-height 1.8, after 12pt, first-line indent |
| **2** | `slider` | `title`, `description` | `cms-images` | Medium Content | Font Poppins, modal popup |
| **3** | `quickmenu` | `label` | `cms-images` | Minimal | Bold, color, center |
| **4** | `keunggulan` | `title`, `description` | `cms-images` | Medium Content | Heading, bullet, link |
| **5** | `fasilitas` | `name`, `description` | `cms-images` | Medium + Table | Tabel spesifikasi ruang & alat |
| **6** | `lembaga` | `name`, `description`, `history` | `cms-images` | **Full Word Ribbon** | Naskah sejarah kronologis |
| **7** | `program_pondok` | `title`, `description`, `curriculum` | `cms-images` | **Full Word Ribbon** | Tabel jadwal 24 jam santri |
| **8** | `program_smp` | `title`, `description`, `highlights` | `cms-images` | Medium Content | Numbered list capaian |
| **9** | `program_madin` | `title`, `description`, `kitab` | `cms-images` | Medium + Arabic | Kitab kuning turats |
| **10** | `stem` | `title`, `description`, `goals`, `steps` | `cms-images` | **Full Word Ribbon** | Checklist langkah eksperimen IoT |
| **11** | `mandarin` | `vocab`, `example`, `description` | `cms-images` | Minimal + Dialogue | Hanzi, pinyin, dialog |
| **12** | `hafidz` | `title`, `content`, `motto` | `cms-images` | **Full Word Ribbon** | Font mushaf Amiri, tasmi' |
| **13** | `prestasi` | `title`, `description` | `cms-images` | Medium Content | Bold, heading, align |
| **14** | `ekskul` | `name`, `description`, `syllabus` | `cms-images` | Medium + Table | Silabus latihan tingkatan |
| **15** | `osis` | `name`, `motto`, `program`, `target` | `cms-images` | Medium + Checklist | Proker & evaluasi kinerja |
| **16** | `berita` | `title`, `excerpt`, `content` | `berita-images` | **Full Word Suite** | Heading H1-H4, tabel, foto, video |
| **17** | `galeri` | `title`, `description` | `galeri-foto` | Medium Content | Narasi dokumentasi kegiatan |
| **18** | `agenda` | `title`, `description`, `location_text` | `cms-images` | Medium Content | Rundown & petunjuk acara |
| **19** | `testimoni` | `name`, `role`, `message` | `avatars` | Minimal Quote | Italic, quote style |
| **20** | `stats` | `label`, `description` | `cms-images` | Minimal | Format label metrik |
| **21** | `kontak` | `label`, `address`, `greeting` | `cms-images` | Minimal | Format teks template WA |
| **22** | `navbar` | `label` | `cms-images` | Minimal | Label pilar menu |
| **23** | `bottomnav` | `label` | `cms-images` | Minimal | Label hub navigasi mobile |
| **24** | `spmb` | `title`, `alur`, `persyaratan`, `biaya` | `cms-images` | **Full Word Ribbon** | Tabel rincian biaya & checklist |

---

### 3. Integrasi & Implementasi Editor

1. **`src/pages/admin/KelolaSambutan.tsx`**:
   - `message_full` menggunakan `SectionWordEditor sectionType="sambutan" fieldName="message_full" bucket="avatars"`
   - `message_short` menggunakan `SectionWordEditor sectionType="sambutan" fieldName="message_short"`
2. **`src/pages/admin/KelolaBerita.tsx`**:
   - `content` menggunakan `SectionWordEditor sectionType="berita" fieldName="content" bucket="berita-images"` dengan toolbar berita terlengkap.
3. **`src/pages/admin/KelolaPrestasi.tsx`**:
   - `description` menggunakan `SectionWordEditor sectionType="prestasi" fieldName="description"`.
4. **`src/pages/admin/KelolaEkskul.tsx`**:
   - `description` menggunakan `SectionWordEditor sectionType="ekskul" fieldName="description"`.
5. **`src/pages/admin/KelolaOsis.tsx`**:
   - `program` menggunakan `SectionWordEditor sectionType="osis" fieldName="program"`.
6. **`src/pages/admin/KelolaAgenda.tsx`**:
   - `description` menggunakan `SectionWordEditor sectionType="agenda" fieldName="description"`.
7. **`src/pages/admin/KelolaProfil.tsx`**:
   - `description` menggunakan `SectionWordEditor sectionType="lembaga" fieldName="description"`.
8. **`src/pages/admin/KelolaSlider.tsx`**:
   - `description` menggunakan `SectionWordEditor sectionType="slider" fieldName="description"`.
9. **`src/pages/admin/WebVisualEditor.tsx` & `src/components/editor/EditContentModal.tsx`**:
   - Menghubungkan panel properti kanan dan modal edit konten secara dinamis ke `SectionWordEditor`.

---

### 4. Renderer Publik Bersih (`SafeRichContent.tsx`)
Setiap data HTML yang dihasilkan oleh editor secara otomatis dirender di halaman publik (`Home.tsx`, `SambutanSection.tsx`, `DetailBerita.tsx`, `PrestasiLightboxModal.tsx`, `EkskulDetailModal.tsx`, `Galeri.tsx`) menggunakan:
```tsx
<SafeRichContent content={data} className="..." />
```
- Menjaga keindahan visual CSS (*line-height, letter-spacing, text-indent, paragraph spacing*).
- Menjamin keamanan dari serangan XSS atau skrip berbahaya via whitelist ketat DOMPurify.


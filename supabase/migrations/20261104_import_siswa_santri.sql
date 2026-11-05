-- Migration: 20261104_import_siswa_santri.sql
-- Import data siswa dari DATABASE SISWA.xlsx ke tabel profiles dengan role 'santri'
-- Menggunakan UUID deterministik (berdasarkan md5 NIS) agar idempotent di re-run
-- Membuat akun auth.users terlebih dahulu untuk memenuhi FK constraint profiles_id_fkey -> users.id
-- Total: 129 siswa (7A, 7B, 8A, 8B, 9A, 9B)

-- Pastikan extension pgcrypto tersedia untuk crypt, gen_random_uuid, dan md5
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;

-- Pastikan kolom yang diperlukan ada di tabel profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nis text,
  ADD COLUMN IF NOT EXISTS kelas text,
  ADD COLUMN IF NOT EXISTS angkatan text,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS status_aktif boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS mapel_diampu text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS jadwal_mengajar jsonb DEFAULT '{}';

-- Tabel temporary untuk menyimpan data siswa dengan UUID deterministik (md5 dari NIS)
CREATE TEMP TABLE IF NOT EXISTS tmp_siswa_import (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  nis text NOT NULL UNIQUE,
  kelas text NOT NULL,
  angkatan text NOT NULL,
  email text NOT NULL UNIQUE
);

-- Kosongkan tabel temporary jika ada data dari run sebelumnya
TRUNCATE tmp_siswa_import;

-- Insert semua data siswa ke tabel temporary.
-- ID di-generate deterministik dari md5(NIS) sehingga re-run menghasilkan UUID yang sama.
INSERT INTO tmp_siswa_import (id, full_name, nis, kelas, angkatan, email) VALUES
-- ===== KELAS 7A (Angkatan 2026/2027) =====
((md5('20260001')::uuid), 'Abbad Nailun Nabhan', '20260001', '7A', '2026/2027', '20260001@ppjauharulmaknuun.sch.id'),
((md5('20260002')::uuid), 'Achmad Zayn Firoos Robbani', '20260002', '7A', '2026/2027', '20260002@ppjauharulmaknuun.sch.id'),
((md5('20260003')::uuid), 'Agha Awwaluddin Adiansyah', '20260003', '7A', '2026/2027', '20260003@ppjauharulmaknuun.sch.id'),
((md5('20260004')::uuid), 'Ahmad Agastya Fitrah', '20260004', '7A', '2026/2027', '20260004@ppjauharulmaknuun.sch.id'),
((md5('20260005')::uuid), 'Ahmad Raihan Halimi Wahab', '20260005', '7A', '2026/2027', '20260005@ppjauharulmaknuun.sch.id'),
((md5('20260006')::uuid), 'Carlen Hafidz Ataillah', '20260006', '7A', '2026/2027', '20260006@ppjauharulmaknuun.sch.id'),
((md5('20260007')::uuid), 'Fairel Atharizz Calief', '20260007', '7A', '2026/2027', '20260007@ppjauharulmaknuun.sch.id'),
((md5('20260008')::uuid), 'Galang Wicaksono', '20260008', '7A', '2026/2027', '20260008@ppjauharulmaknuun.sch.id'),
((md5('20260009')::uuid), 'Ghaisan Tsaqif Al Ahza', '20260009', '7A', '2026/2027', '20260009@ppjauharulmaknuun.sch.id'),
((md5('20260010')::uuid), 'Kenzhu Daffa Maullana', '20260010', '7A', '2026/2027', '20260010@ppjauharulmaknuun.sch.id'),
((md5('20260011')::uuid), 'Mirza Haziq Putra Mislan', '20260011', '7A', '2026/2027', '20260011@ppjauharulmaknuun.sch.id'),
((md5('20260012')::uuid), 'Mochammad Nizam Al-Ghifari', '20260012', '7A', '2026/2027', '20260012@ppjauharulmaknuun.sch.id'),
((md5('20260013')::uuid), 'Mohamad Wakhid Bagus Satrio', '20260013', '7A', '2026/2027', '20260013@ppjauharulmaknuun.sch.id'),
((md5('20260014')::uuid), 'Muhamad Mahraz Amsyar Ramadhani', '20260014', '7A', '2026/2027', '20260014@ppjauharulmaknuun.sch.id'),
((md5('20260015')::uuid), 'Muhammad Ali Muzakki', '20260015', '7A', '2026/2027', '20260015@ppjauharulmaknuun.sch.id'),
((md5('20260016')::uuid), 'Muhammad Alvaro Gavriel', '20260016', '7A', '2026/2027', '20260016@ppjauharulmaknuun.sch.id'),
((md5('20260017')::uuid), 'Muhammad Fathur Rohman Annawawi', '20260017', '7A', '2026/2027', '20260017@ppjauharulmaknuun.sch.id'),
((md5('20260018')::uuid), 'Muhammad Maheer Al Kayyis', '20260018', '7A', '2026/2027', '20260018@ppjauharulmaknuun.sch.id'),
((md5('20260019')::uuid), 'Muhammad Nur Fadlil Ramadlani', '20260019', '7A', '2026/2027', '20260019@ppjauharulmaknuun.sch.id'),
((md5('20260020')::uuid), 'Muhammad Sultan Virmansyah', '20260020', '7A', '2026/2027', '20260020@ppjauharulmaknuun.sch.id'),

-- ===== KELAS 7B (Angkatan 2026/2027) =====
((md5('20260021')::uuid), 'Muhammad Zidan Danis Al Faraby', '20260021', '7B', '2026/2027', '20260021@ppjauharulmaknuun.sch.id'),
((md5('20260022')::uuid), 'Aceline Aay Firzanah Hatami', '20260022', '7B', '2026/2027', '20260022@ppjauharulmaknuun.sch.id'),
((md5('20260023')::uuid), 'Adia Rafa Fathina', '20260023', '7B', '2026/2027', '20260023@ppjauharulmaknuun.sch.id'),
((md5('20260024')::uuid), 'Anindita Keisha Az Zahra', '20260024', '7B', '2026/2027', '20260024@ppjauharulmaknuun.sch.id'),
((md5('20260025')::uuid), 'Annisa Syariah Islami Raisa', '20260025', '7B', '2026/2027', '20260025@ppjauharulmaknuun.sch.id'),
((md5('20260026')::uuid), 'Atiqa Fairuz Khalisa', '20260026', '7B', '2026/2027', '20260026@ppjauharulmaknuun.sch.id'),
((md5('20260027')::uuid), 'Ayesha Assyifa Qolbi', '20260027', '7B', '2026/2027', '20260027@ppjauharulmaknuun.sch.id'),
((md5('20260028')::uuid), 'Dara Syahnaz Jannah Bidari', '20260028', '7B', '2026/2027', '20260028@ppjauharulmaknuun.sch.id'),
((md5('20260029')::uuid), 'Daryn Aquilla Azzalfa', '20260029', '7B', '2026/2027', '20260029@ppjauharulmaknuun.sch.id'),
((md5('20260030')::uuid), 'Dewi Amirah Rosyadah', '20260030', '7B', '2026/2027', '20260030@ppjauharulmaknuun.sch.id'),
((md5('20260031')::uuid), 'Fathiyah Shidqi Oktavianda', '20260031', '7B', '2026/2027', '20260031@ppjauharulmaknuun.sch.id'),
((md5('20260032')::uuid), 'Ghina Rania Salsabilah', '20260032', '7B', '2026/2027', '20260032@ppjauharulmaknuun.sch.id'),
((md5('20260033')::uuid), 'Jingga Rindu Awani', '20260033', '7B', '2026/2027', '20260033@ppjauharulmaknuun.sch.id'),
((md5('20260034')::uuid), 'Nabila Hasna Amira', '20260034', '7B', '2026/2027', '20260034@ppjauharulmaknuun.sch.id'),
((md5('20260035')::uuid), 'Nafisa Nasikhatul Mufidah', '20260035', '7B', '2026/2027', '20260035@ppjauharulmaknuun.sch.id'),
((md5('20260036')::uuid), 'Najwa Zahira Ahsanty', '20260036', '7B', '2026/2027', '20260036@ppjauharulmaknuun.sch.id'),
((md5('20260037')::uuid), 'Nur Amira Hidayatul Ummah', '20260037', '7B', '2026/2027', '20260037@ppjauharulmaknuun.sch.id'),
((md5('20260038')::uuid), 'Nur Zalfa Naqiyyatun Nisa', '20260038', '7B', '2026/2027', '20260038@ppjauharulmaknuun.sch.id'),
((md5('20260039')::uuid), 'Nyimas Jasmin Fahira', '20260039', '7B', '2026/2027', '20260039@ppjauharulmaknuun.sch.id'),
((md5('20260040')::uuid), 'Putri Dwi Auliyah Puspita Ramadani', '20260040', '7B', '2026/2027', '20260040@ppjauharulmaknuun.sch.id'),
((md5('20260041')::uuid), 'Salma Nabilah', '20260041', '7B', '2026/2027', '20260041@ppjauharulmaknuun.sch.id'),
((md5('20260042')::uuid), 'Shielsa Ramadanish Averos Faradesi', '20260042', '7B', '2026/2027', '20260042@ppjauharulmaknuun.sch.id'),
((md5('20260043')::uuid), 'Zahira Syahida Syakbanah', '20260043', '7B', '2026/2027', '20260043@ppjauharulmaknuun.sch.id'),
((md5('20260044')::uuid), 'Zahirah Hesti Nabilah', '20260044', '7B', '2026/2027', '20260044@ppjauharulmaknuun.sch.id'),

-- ===== KELAS 8A (Angkatan 2025/2026) =====
((md5('20250001')::uuid), 'Achmad Fairuz Zufar', '20250001', '8A', '2025/2026', '20250001@ppjauharulmaknuun.sch.id'),
((md5('20250002')::uuid), 'Afif Assyakir Fillah', '20250002', '8A', '2025/2026', '20250002@ppjauharulmaknuun.sch.id'),
((md5('20250003')::uuid), 'Afif Ezza Alfath', '20250003', '8A', '2025/2026', '20250003@ppjauharulmaknuun.sch.id'),
((md5('20250004')::uuid), 'Albi Sabda Tita Prayogi', '20250004', '8A', '2025/2026', '20250004@ppjauharulmaknuun.sch.id'),
((md5('20250005')::uuid), 'Ananda Desta Putra Utomo', '20250005', '8A', '2025/2026', '20250005@ppjauharulmaknuun.sch.id'),
((md5('20250006')::uuid), 'Danish Danial Yoga Hidayat', '20250006', '8A', '2025/2026', '20250006@ppjauharulmaknuun.sch.id'),
((md5('20250007')::uuid), 'Ghazy Mahardika Hariakusuma', '20250007', '8A', '2025/2026', '20250007@ppjauharulmaknuun.sch.id'),
((md5('20250008')::uuid), 'Khalif Rama Heidian', '20250008', '8A', '2025/2026', '20250008@ppjauharulmaknuun.sch.id'),
((md5('20250009')::uuid), 'Kiki Budi Nur Jaka Saputra', '20250009', '8A', '2025/2026', '20250009@ppjauharulmaknuun.sch.id'),
((md5('20250010')::uuid), 'M. Hafid Mutawakkil Habibullah', '20250010', '8A', '2025/2026', '20250010@ppjauharulmaknuun.sch.id'),
((md5('20250011')::uuid), 'Moh Bintang Raffasya Alby Rahman', '20250011', '8A', '2025/2026', '20250011@ppjauharulmaknuun.sch.id'),
((md5('20250012')::uuid), 'Moh. Bintang Aulia Hakim', '20250012', '8A', '2025/2026', '20250012@ppjauharulmaknuun.sch.id'),
((md5('20250013')::uuid), 'Muh. Fauzan Fadhlan', '20250013', '8A', '2025/2026', '20250013@ppjauharulmaknuun.sch.id'),
((md5('20250014')::uuid), 'Muhammad Abdurrahman Faiz', '20250014', '8A', '2025/2026', '20250014@ppjauharulmaknuun.sch.id'),
((md5('20250015')::uuid), 'Muhammad Alfiano Putra Mashuri', '20250015', '8A', '2025/2026', '20250015@ppjauharulmaknuun.sch.id'),
((md5('20250016')::uuid), 'Muhammad Amirul Ihsan', '20250016', '8A', '2025/2026', '20250016@ppjauharulmaknuun.sch.id'),
((md5('20250017')::uuid), 'Muhammad Aqil Nur Hasan', '20250017', '8A', '2025/2026', '20250017@ppjauharulmaknuun.sch.id'),
((md5('20250018')::uuid), 'Muhammad Hizam Hifdillah', '20250018', '8A', '2025/2026', '20250018@ppjauharulmaknuun.sch.id'),
((md5('20250019')::uuid), 'Muhammad Ibnu Sina', '20250019', '8A', '2025/2026', '20250019@ppjauharulmaknuun.sch.id'),
((md5('20250020')::uuid), 'Muhammad Rafardan Aidin', '20250020', '8A', '2025/2026', '20250020@ppjauharulmaknuun.sch.id'),
((md5('20250021')::uuid), 'Muhammad Rizki Zahran Alphard', '20250021', '8A', '2025/2026', '20250021@ppjauharulmaknuun.sch.id'),
((md5('20250022')::uuid), 'Muhammad Yasin Aliimuddin', '20250022', '8A', '2025/2026', '20250022@ppjauharulmaknuun.sch.id'),
((md5('20250023')::uuid), 'Nanda Pratama', '20250023', '8A', '2025/2026', '20250023@ppjauharulmaknuun.sch.id'),
((md5('20250024')::uuid), 'Olfat Rozzan', '20250024', '8A', '2025/2026', '20250024@ppjauharulmaknuun.sch.id'),
((md5('20250025')::uuid), 'Raditia Rengga Pradana', '20250025', '8A', '2025/2026', '20250025@ppjauharulmaknuun.sch.id'),
((md5('20250026')::uuid), 'Rajendra Arganta Adi Marsuki', '20250026', '8A', '2025/2026', '20250026@ppjauharulmaknuun.sch.id'),

-- ===== KELAS 8B (Angkatan 2025/2026) =====
((md5('20250027')::uuid), 'Amirah Faizah', '20250027', '8B', '2025/2026', '20250027@ppjauharulmaknuun.sch.id'),
((md5('20250028')::uuid), 'Ananda Nayla Azzahra', '20250028', '8B', '2025/2026', '20250028@ppjauharulmaknuun.sch.id'),
((md5('20250029')::uuid), 'Anandita Sasi Kirana Arytasha', '20250029', '8B', '2025/2026', '20250029@ppjauharulmaknuun.sch.id'),
((md5('20250030')::uuid), 'Aulia Mudliah Ali', '20250030', '8B', '2025/2026', '20250030@ppjauharulmaknuun.sch.id'),
((md5('20250031')::uuid), 'Bilqis Ulfaira Mochtar Efendi', '20250031', '8B', '2025/2026', '20250031@ppjauharulmaknuun.sch.id'),
((md5('20250032')::uuid), 'Dafinah Syauqiyah Fatma', '20250032', '8B', '2025/2026', '20250032@ppjauharulmaknuun.sch.id'),
((md5('20250033')::uuid), 'Faiqiha Annisa Ilmi Al Hafiza', '20250033', '8B', '2025/2026', '20250033@ppjauharulmaknuun.sch.id'),
((md5('20250034')::uuid), 'Kayla Akifah Azzahra', '20250034', '8B', '2025/2026', '20250034@ppjauharulmaknuun.sch.id'),
((md5('20250035')::uuid), 'Maulidiyah Kayla Khanza', '20250035', '8B', '2025/2026', '20250035@ppjauharulmaknuun.sch.id'),
((md5('20250036')::uuid), 'Muniya Zahira Ajwa Rudyanto', '20250036', '8B', '2025/2026', '20250036@ppjauharulmaknuun.sch.id'),
((md5('20250037')::uuid), 'Namirah Faizah', '20250037', '8B', '2025/2026', '20250037@ppjauharulmaknuun.sch.id'),
((md5('20250038')::uuid), 'Nayla Ikrima Hamidah', '20250038', '8B', '2025/2026', '20250038@ppjauharulmaknuun.sch.id'),
((md5('20250039')::uuid), 'Raisya Fitri Anjani', '20250039', '8B', '2025/2026', '20250039@ppjauharulmaknuun.sch.id'),
((md5('20250040')::uuid), 'Shabitah Ayunindya Gayatri', '20250040', '8B', '2025/2026', '20250040@ppjauharulmaknuun.sch.id'),
((md5('20250041')::uuid), 'Talita Atika Zahra', '20250041', '8B', '2025/2026', '20250041@ppjauharulmaknuun.sch.id'),
((md5('20250042')::uuid), 'Yumna Salsabilah', '20250042', '8B', '2025/2026', '20250042@ppjauharulmaknuun.sch.id'),

-- ===== KELAS 9A (Angkatan 2024/2025) =====
((md5('20240001')::uuid), 'Aryasatya Bintang Zaidan', '20240001', '9A', '2024/2025', '20240001@ppjauharulmaknuun.sch.id'),
((md5('20240002')::uuid), 'Hafiyyan Nuha Aji Putra', '20240002', '9A', '2024/2025', '20240002@ppjauharulmaknuun.sch.id'),
((md5('20240003')::uuid), 'Hayfa Khalfani Sakhiy Addiya''ulhaq', '20240003', '9A', '2024/2025', '20240003@ppjauharulmaknuun.sch.id'),
((md5('20240004')::uuid), 'M. Attabik Rizki Maulana', '20240004', '9A', '2024/2025', '20240004@ppjauharulmaknuun.sch.id'),
((md5('20240005')::uuid), 'M. Azka Farikhul Qolbi P. S.', '20240005', '9A', '2024/2025', '20240005@ppjauharulmaknuun.sch.id'),
((md5('20240006')::uuid), 'M. Haikal Azhar Kamil', '20240006', '9A', '2024/2025', '20240006@ppjauharulmaknuun.sch.id'),
((md5('20240007')::uuid), 'M. Irsyadul Akmal', '20240007', '9A', '2024/2025', '20240007@ppjauharulmaknuun.sch.id'),
((md5('20240008')::uuid), 'M. Syeh Khabibus S. A.', '20240008', '9A', '2024/2025', '20240008@ppjauharulmaknuun.sch.id'),
((md5('20240009')::uuid), 'Muhammad Ade Bayu Zubairy', '20240009', '9A', '2024/2025', '20240009@ppjauharulmaknuun.sch.id'),
((md5('20240010')::uuid), 'Muhammad Adinata Javier', '20240010', '9A', '2024/2025', '20240010@ppjauharulmaknuun.sch.id'),
((md5('20240011')::uuid), 'Muhammad Ainul Al Haqqi', '20240011', '9A', '2024/2025', '20240011@ppjauharulmaknuun.sch.id'),
((md5('20240012')::uuid), 'Muhammad Amzar Khairin', '20240012', '9A', '2024/2025', '20240012@ppjauharulmaknuun.sch.id'),
((md5('20240013')::uuid), 'Muhammad Azfar Bahij', '20240013', '9A', '2024/2025', '20240013@ppjauharulmaknuun.sch.id'),
((md5('20240014')::uuid), 'Muhammad Hafidz Alfarizqy', '20240014', '9A', '2024/2025', '20240014@ppjauharulmaknuun.sch.id'),
((md5('20240015')::uuid), 'Muhammad Nizar Azmi', '20240015', '9A', '2024/2025', '20240015@ppjauharulmaknuun.sch.id'),
((md5('20240016')::uuid), 'Muhammad Yusuf Azighah', '20240016', '9A', '2024/2025', '20240016@ppjauharulmaknuun.sch.id'),
((md5('20240017')::uuid), 'Naufal Dwi Adinata', '20240017', '9A', '2024/2025', '20240017@ppjauharulmaknuun.sch.id'),
((md5('20240018')::uuid), 'Sandi Ariesta Sabagya', '20240018', '9A', '2024/2025', '20240018@ppjauharulmaknuun.sch.id'),
((md5('20240019')::uuid), 'Zhahir Harith Hariq', '20240019', '9A', '2024/2025', '20240019@ppjauharulmaknuun.sch.id'),
((md5('20240020')::uuid), 'Moh. Miftahun Na''im', '20240020', '9A', '2024/2025', '20240020@ppjauharulmaknuun.sch.id'),

-- ===== KELAS 9B (Angkatan 2024/2025) =====
((md5('20240021')::uuid), 'Adryana Alya Zafeera', '20240021', '9B', '2024/2025', '20240021@ppjauharulmaknuun.sch.id'),
((md5('20240022')::uuid), 'Aisya Filza Farzanah', '20240022', '9B', '2024/2025', '20240022@ppjauharulmaknuun.sch.id'),
((md5('20240023')::uuid), 'Aisyah Qori'' Akifah', '20240023', '9B', '2024/2025', '20240023@ppjauharulmaknuun.sch.id'),
((md5('20240024')::uuid), 'Alifiyah Luthfi Alkhoriroh', '20240024', '9B', '2024/2025', '20240024@ppjauharulmaknuun.sch.id'),
((md5('20240025')::uuid), 'Amanda Naura Rizka S', '20240025', '9B', '2024/2025', '20240025@ppjauharulmaknuun.sch.id'),
((md5('20240026')::uuid), 'Arina Nurul Ilma', '20240026', '9B', '2024/2025', '20240026@ppjauharulmaknuun.sch.id'),
((md5('20240027')::uuid), 'Assyifa Yastiya Wahyurianto', '20240027', '9B', '2024/2025', '20240027@ppjauharulmaknuun.sch.id'),
((md5('20240028')::uuid), 'Fathimatul Muthi''ah', '20240028', '9B', '2024/2025', '20240028@ppjauharulmaknuun.sch.id'),
((md5('20240029')::uuid), 'Hasna Adara Cetta', '20240029', '9B', '2024/2025', '20240029@ppjauharulmaknuun.sch.id'),
((md5('20240030')::uuid), 'Kenzosena Revisha Amabelle', '20240030', '9B', '2024/2025', '20240030@ppjauharulmaknuun.sch.id'),
((md5('20240031')::uuid), 'Khairina Hasya Zafirah', '20240031', '9B', '2024/2025', '20240031@ppjauharulmaknuun.sch.id'),
((md5('20240032')::uuid), 'Leora Zhafirah Aristawati', '20240032', '9B', '2024/2025', '20240032@ppjauharulmaknuun.sch.id'),
((md5('20240033')::uuid), 'Mahira Almalika Putri Prayetno', '20240033', '9B', '2024/2025', '20240033@ppjauharulmaknuun.sch.id'),
((md5('20240034')::uuid), 'Nasywa Khalila Nauthaputri', '20240034', '9B', '2024/2025', '20240034@ppjauharulmaknuun.sch.id'),
((md5('20240035')::uuid), 'Nasywa Putri Almira', '20240035', '9B', '2024/2025', '20240035@ppjauharulmaknuun.sch.id'),
((md5('20240036')::uuid), 'Naura Shofa Ayunindya', '20240036', '9B', '2024/2025', '20240036@ppjauharulmaknuun.sch.id'),
((md5('20240037')::uuid), 'Putri Hasna Chumairoh', '20240037', '9B', '2024/2025', '20240037@ppjauharulmaknuun.sch.id'),
((md5('20240038')::uuid), 'Raesa Afiqa Ningrum', '20240038', '9B', '2024/2025', '20240038@ppjauharulmaknuun.sch.id'),
((md5('20240039')::uuid), 'Raqilla Kirana Mirza Teguhati', '20240039', '9B', '2024/2025', '20240039@ppjauharulmaknuun.sch.id'),
((md5('20240040')::uuid), 'Ratu Asyifa Nabila Ramadhani', '20240040', '9B', '2024/2025', '20240040@ppjauharulmaknuun.sch.id'),
((md5('20240041')::uuid), 'Reisya Syabani Maheswari', '20240041', '9B', '2024/2025', '20240041@ppjauharulmaknuun.sch.id'),
((md5('20240042')::uuid), 'Salsabila Putri Briliana', '20240042', '9B', '2024/2025', '20240042@ppjauharulmaknuun.sch.id'),
((md5('20240043')::uuid), 'Zea Zafirah', '20240043', '9B', '2024/2025', '20240043@ppjauharulmaknuun.sch.id');

-- 1. Hapus profiles lama berdasarkan NIS range (idempotent, TANPA filter role agar menangkap semua role lama)
DELETE FROM public.profiles
WHERE nis IN (
    '20260001','20260002','20260003','20260004','20260005','20260006','20260007','20260008','20260009','20260010',
    '20260011','20260012','20260013','20260014','20260015','20260016','20260017','20260018','20260019','20260020',
    '20260021','20260022','20260023','20260024','20260025','20260026','20260027','20260028','20260029','20260030',
    '20260031','20260032','20260033','20260034','20260035','20260036','20260037','20260038','20260039','20260040',
    '20260041','20260042','20260043','20260044',
    '20250001','20250002','20250003','20250004','20250005','20250006','20250007','20250008','20250009','20250010',
    '20250011','20250012','20250013','20250014','20250015','20250016','20250017','20250018','20250019','20250020',
    '20250021','20250022','20250023','20250024','20250025','20250026',
    '20250027','20250028','20250029','20250030','20250031','20250032','20250033','20250034','20250035','20250036',
    '20250037','20250038','20250039','20250040','20250041','20250042',
    '20240001','20240002','20240003','20240004','20240005','20240006','20240007','20240008','20240009','20240010',
    '20240011','20240012','20240013','20240014','20240015','20240016','20240017','20240018','20240019','20240020',
    '20240021','20240022','20240023','20240024','20240025','20240026','20240027','20240028','20240029','20240030',
    '20240031','20240032','20240033','20240034','20240035','20240036','20240037','20240038','20240039','20240040',
    '20240041','20240042','20240043'
);

-- 2. Hapus auth.identities dan auth.users lama untuk siswa (berdasarkan email pattern)
DELETE FROM auth.identities
WHERE user_id IN (
  SELECT u.id FROM auth.users u
  WHERE u.email LIKE '%@ppjauharulmaknuun.sch.id'
    AND u.email ~ '^[0-9]{8}@ppjauharulmaknuun\.sch\.id$'
);

DELETE FROM auth.users
WHERE email LIKE '%@ppjauharulmaknuun.sch.id'
  AND email ~ '^[0-9]{8}@ppjauharulmaknuun\.sch\.id$';

-- 3. Insert ke auth.users untuk setiap siswa (mengikuti GoTrue invariant: instance_id, token kosong, tidak NULL)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
)
SELECT
  '00000000-0000-0000-0000-000000000000'::uuid,
  t.id,
  'authenticated',
  'authenticated',
  t.email,
  crypt('PPJM_Santri2026!', gen_salt('bf', 10)),
  now(),
  null,
  '',      -- WAJIB '' bukan NULL
  now(),
  '',      -- WAJIB '' bukan NULL
  null,    -- timestamptz WAJIB NULL
  '',      -- WAJIB '' bukan NULL
  '',      -- WAJIB '' bukan NULL
  null,    -- timestamptz WAJIB NULL
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', t.full_name, 'role', 'santri', 'nis', t.nis, 'kelas', t.kelas, 'angkatan', t.angkatan),
  false,
  now(),
  now(),
  null,    -- phone = NULL (tidak ada nomor HP untuk siswa, mencegah unique constraint violation pada users_phone_key)
  null,
  '',      -- WAJIB '' bukan NULL
  '',      -- WAJIB '' bukan NULL
  null,
  '',      -- WAJIB '' bukan NULL
  0,
  null,
  '',      -- WAJIB '' bukan NULL
  null,
  false,
  null
FROM tmp_siswa_import t;

-- 4. Insert ke auth.identities untuk setiap siswa
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  t.id,
  jsonb_build_object('sub', t.id::text, 'email', t.email),
  'email',
  t.id::text,
  now(),
  now(),
  now()
FROM tmp_siswa_import t;

-- 5. Insert ke public.profiles untuk setiap siswa dengan role 'santri'
INSERT INTO public.profiles (
  id,
  full_name,
  nis,
  kelas,
  angkatan,
  role,
  status_aktif,
  mapel_diampu,
  jadwal_mengajar,
  created_at,
  updated_at
)
SELECT
  t.id,
  t.full_name,
  t.nis,
  t.kelas,
  t.angkatan,
  'santri',
  true,
  '{}',
  '{}',
  now(),
  now()
FROM tmp_siswa_import t;

-- 6. Verifikasi jumlah data yang diimport per kelas
SELECT 
  p.kelas,
  p.angkatan,
  COUNT(*) AS jumlah_siswa
FROM public.profiles p
JOIN tmp_siswa_import t ON t.id = p.id
WHERE p.role = 'santri'
GROUP BY p.kelas, p.angkatan
ORDER BY p.kelas, p.angkatan;

-- 7. Tampilkan total keseluruhan
SELECT COUNT(*) AS total_siswa_diimport
FROM public.profiles p
JOIN tmp_siswa_import t ON t.id = p.id
WHERE p.role = 'santri';

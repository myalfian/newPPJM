/**
 * Generator Pesan WhatsApp Ramah Pengurus Pondok
 * Memformat warta/berita/pengumuman secara otomatis dengan teks tebal, emoticon islami,
 * dan tautan resmi untuk diteruskan ke grup WhatsApp Wali Santri dalam 1 kali klik.
 */

export interface WhatsAppBroadcastOptions {
  title: string;
  category?: string;
  excerpt: string;
  targetUrl: string;
  tanggal?: string;
}

export function generateWhatsAppBroadcastUrl(options: WhatsAppBroadcastOptions): string {
  const { title, category = 'WARTA PONDOK', excerpt, targetUrl, tanggal } = options;

  const dateStr = tanggal || new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const message = `*BISMILLAHIRROHMANIRROHIM* 🌿
*PONDOK PESANTREN JAUHARUL MAKNUUN LASEM*
_Kecamatan Sidayu, Kabupaten Gresik_
--------------------------------------------
📢 *PENGUMUMAN RESMI / ${category.toUpperCase()}*

📌 *${title}*
🗓️ _Waktu: ${dateStr}_

${excerpt}

Silakan simak informasi lengkap & dokumentasi resmi melalui tautan portal berikut:
🔗 ${targetUrl}

_Semoga Allah SWT senantiasa melimpahkan berkah dan meridhoi putra-putri santri kita sekalian. Amin ya Rabbal 'Alamin._
--------------------------------------------
_Kantor Sekretariat PPJM Lasem Sidayu Gresik_`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

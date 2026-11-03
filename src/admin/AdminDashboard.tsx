import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Landmark, History, Building2, ShieldCheck } from 'lucide-react';
import type { AdminOutletContext } from './AdminLayout';
import { CRUD_SECTIONS, type NavGroupKey } from './sections';

type CardItem = { to: string; title: string; desc: string; icon: React.ElementType; section: string; group: string };

const crudCards = (group: NavGroupKey, descPrefix: string): CardItem[] =>
  CRUD_SECTIONS.filter((s) => s.group === group).map((s) => ({
    to: `/admin/s/${s.key}`,
    title: s.label,
    desc: `${descPrefix} ${s.label.toLowerCase()}.`,
    icon: s.icon,
    section: s.key,
    group,
  }));

const ALL_CARDS: CardItem[] = [
  { to: '/admin/visi-misi', title: 'Visi, Misi & Tujuan', desc: 'Edit teks dan lihat hasilnya langsung.', icon: Landmark, section: 'visi_misi', group: 'Content' },
  { to: '/admin/sejarah', title: 'Sejarah', desc: 'Atur pengantar dan linimasa pesantren.', icon: History, section: 'sejarah', group: 'Content' },
  { to: '/admin/fasilitas', title: 'Fasilitas', desc: 'Kelola kartu fasilitas, foto, dan urutannya.', icon: Building2, section: 'fasilitas', group: 'Content' },
  ...crudCards('Content', 'Kelola konten'),
  ...crudCards('Akademik', 'Kelola modul akademik'),
  ...crudCards('Publikasi', 'Kelola publikasi'),
  ...crudCards('Manajemen', 'Kelola data'),
  { to: '/admin/roles', title: 'Role & Credential', desc: 'Atur hak akses dan bagikan akun.', icon: ShieldCheck, section: 'roles', group: 'Pengaturan' },
];

const GROUP_ORDER = ['Content', 'Akademik', 'Publikasi', 'Manajemen', 'Pengaturan'];

export const AdminDashboard: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const allowed = ALL_CARDS.filter((c) => admin.can(c.section, 'view'));

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div>
        <h1 className="text-xl font-bold text-teal-950">Assalamu'alaikum, {admin.profile?.full_name}</h1>
        <p className="text-sm text-zinc-600">Pilih bagian website yang ingin dikelola.</p>
      </div>

      {GROUP_ORDER.map((group) => {
        const items = allowed.filter((c) => c.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900/60">{group}</h2>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  className="rounded-2xl border border-teal-900/10 bg-white p-4 shadow-sm transition hover:border-[#115E59]/40"
                >
                  <c.icon className="text-[#115E59]" size={20} />
                  <h3 className="mt-2.5 text-sm font-semibold text-teal-950">{c.title}</h3>
                  <p className="mt-0.5 text-xs text-zinc-600">{c.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

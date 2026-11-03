import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Landmark, History, ShieldCheck } from 'lucide-react';
import type { AdminOutletContext } from './AdminLayout';

export const AdminDashboard: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const cards = [
    { to: '/admin/visi-misi', title: 'Visi, Misi & Tujuan', desc: 'Edit teks dan lihat hasilnya langsung.', icon: Landmark, section: 'visi_misi' },
    { to: '/admin/sejarah', title: 'Sejarah', desc: 'Atur pengantar dan linimasa pesantren.', icon: History, section: 'sejarah' },
    { to: '/admin/roles', title: 'Role & Credential', desc: 'Atur hak akses dan bagikan akun.', icon: ShieldCheck, section: 'roles' },
  ].filter((c) => admin.can(c.section, 'view'));

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-teal-950">Assalamu'alaikum, {admin.profile?.full_name}</h1>
        <p className="text-sm text-zinc-600">Pilih bagian yang ingin diedit.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-2xl border border-teal-900/10 bg-white p-5 shadow-sm transition hover:border-[#115E59]/40">
            <c.icon className="text-[#115E59]" size={22} />
            <h2 className="mt-3 font-semibold text-teal-950">{c.title}</h2>
            <p className="text-sm text-zinc-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};


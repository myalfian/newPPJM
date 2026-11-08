import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GripVertical, Trash2, Plus, Save, ImagePlus, Eye, EyeOff, Monitor, Tablet, Smartphone, CheckCircle2 } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import { convertImageToWebP, formatBytes } from '../lib/webpConverter';

type Fac = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  capacity: string;
  features: string[];
  is_active: boolean;
  isNew?: boolean;
};
type Device = 'desktop' | 'tablet' | 'mobile';
const WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };
const CATEGORIES = ['Pendidikan', 'Ibadah', 'Hunian', 'Penunjang', 'Olahraga'];
const MAX_IMAGE = 5 * 1024 * 1024;
const field = 'w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm disabled:bg-zinc-50';

const Row: React.FC<{
  f: Fac; disabled: boolean; canDelete: boolean;
  onChange: (p: Partial<Fac>) => void; onRemove: () => void; onUpload: (file: File) => void;
}> = ({ f, disabled, canDelete, onChange, onRemove, onUpload }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: f.id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border bg-white p-3 ${isDragging ? 'border-[#115E59] shadow-md' : 'border-zinc-200'} ${f.is_active ? '' : 'opacity-60'}`}
    >
      <div className="flex gap-2">
        <button {...attributes} {...listeners} className="mt-2 cursor-grab touch-none text-zinc-400" aria-label="Geser urutan"><GripVertical size={16} /></button>
        <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-zinc-950/10 border border-zinc-200/60">
          {f.image_url ? <img src={f.image_url} alt="" className="h-full w-full object-contain p-0.5" /> : <ImagePlus className="text-zinc-300" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input className={field} placeholder="Nama fasilitas" value={f.name} disabled={disabled} onChange={(e) => onChange({ name: e.target.value })} />
          <div className="flex gap-2">
            <select className={field} value={f.category} disabled={disabled} onChange={(e) => onChange({ category: e.target.value })}>
              {[...new Set([...CATEGORIES, f.category])].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input className={field} placeholder="Kapasitas (opsional)" value={f.capacity} disabled={disabled} onChange={(e) => onChange({ capacity: e.target.value })} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          <button disabled={disabled} onClick={() => onChange({ is_active: !f.is_active })} className="text-zinc-500 hover:text-[#115E59]"
            aria-label={f.is_active ? 'Sembunyikan dari website' : 'Tampilkan di website'} title={f.is_active ? 'Tampil di website' : 'Disembunyikan'}>
            {f.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          {canDelete && <button onClick={onRemove} className="text-zinc-400 hover:text-red-600" aria-label="Hapus fasilitas"><Trash2 size={16} /></button>}
        </div>
      </div>
      <textarea className={`${field} mt-2 resize-none`} rows={2} placeholder="Deskripsi singkat" value={f.description} disabled={disabled} onChange={(e) => onChange({ description: e.target.value })} />
      <textarea className={`${field} mt-2 resize-none`} rows={2} placeholder="Fitur (satu per baris)" disabled={disabled}
        value={f.features.join('\n')} onChange={(e) => onChange({ features: e.target.value.split('\n') })} />
      {!disabled && (
        <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#115E59]">
          <ImagePlus size={14} /> {f.image_url ? 'Ganti foto' : 'Unggah foto'}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(file); e.target.value = ''; }} />
        </label>
      )}
    </div>
  );
};

export const FasilitasEditor: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const canEdit = admin.can('fasilitas', 'edit');
  const canCreate = admin.can('fasilitas', 'create');
  const canDelete = admin.can('fasilitas', 'delete');

  const [items, setItems] = useState<Fac[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [device, setDevice] = useState<Device>('desktop');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const { data } = await db.from('facilities').select('*').order('order_index', { ascending: true }).order('created_at', { ascending: true });
    setItems(((data as Record<string, unknown>[] | null) ?? []).map((r) => ({
      id: String(r.id),
      name: String(r.name ?? ''),
      category: String(r.category ?? 'Pendidikan'),
      description: String(r.description ?? ''),
      image_url: String(r.image_url ?? ''),
      capacity: String(r.capacity ?? ''),
      features: Array.isArray(r.features) ? (r.features as string[]) : [],
      is_active: r.is_active !== false,
    })));
    setRemoved([]);
    setReady(true);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    setItems((l) => arrayMove(l, l.findIndex((x) => x.id === e.active.id), l.findIndex((x) => x.id === e.over!.id)));
  };

  const patch = (id: string, p: Partial<Fac>) => setItems((l) => l.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const upload = async (id: string, rawFile: File) => {
    if (rawFile.size > 20 * 1024 * 1024) { setStatus('error'); setMsg('Ukuran foto maksimal 20 MB.'); return; }
    const converted = await convertImageToWebP(rawFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
    const file = converted.file;
    const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
    const path = `facilities/${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from('cms-images').upload(path, file, { contentType: file.type, cacheControl: '31536000' });
    if (error) { setStatus('error'); setMsg(`Gagal mengunggah foto: ${error.message}`); return; }
    patch(id, { image_url: db.storage.from('cms-images').getPublicUrl(path).data.publicUrl });
    setStatus('saved');
    setMsg(`Foto fasilitas otomatis dikonversi ke WebP (${formatBytes(converted.originalSize)} → ${formatBytes(converted.compressedSize)}).`);
  };

  const save = async () => {
    setStatus('saving');
    const bad = items.find((f) => !f.name.trim() || !f.image_url);
    if (bad) { setStatus('error'); setMsg('Setiap fasilitas wajib punya nama dan foto.'); return; }

    for (const id of removed) {
      const { error } = await db.from('facilities').delete().eq('id', id);
      if (error) { setStatus('error'); setMsg('Gagal menghapus. Anda mungkin tidak punya izin hapus.'); return; }
    }
    for (const [i, f] of items.entries()) {
      const row = {
        name: f.name.trim(), category: f.category, description: f.description.trim(), image_url: f.image_url,
        capacity: f.capacity.trim() || null, features: f.features.map((s) => s.trim()).filter(Boolean),
        is_active: f.is_active, order_index: i,
      };
      const { error } = f.isNew
        ? await db.from('facilities').insert(row)
        : await db.from('facilities').update(row).eq('id', f.id);
      if (error) { setStatus('error'); setMsg(`Gagal menyimpan "${f.name}". Anda mungkin tidak punya izin.`); return; }
    }
    await load();
    setStatus('saved'); setMsg('Tersimpan. Website publik sudah diperbarui.');
  };

  const btn = (active: boolean) => `rounded-lg p-1.5 ${active ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;
  const shown = items.filter((f) => f.is_active);

  if (!ready) return <p className="text-sm text-zinc-500">Memuat…</p>;

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-teal-950">Fasilitas</h1>
          {(canEdit || canCreate) && (
            <button onClick={save} disabled={status === 'saving'}
              className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              <Save size={16} /> {status === 'saving' ? 'Menyimpan…' : 'Simpan'}
            </button>
          )}
        </div>
        {!canEdit && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Anda hanya bisa melihat bagian ini.</p>}
        {msg && <p role="status" className={`text-xs ${status === 'error' ? 'text-red-600' : 'text-teal-800'}`}>{msg}</p>}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {items.map((f) => (
                <Row key={f.id} f={f} disabled={!canEdit && !f.isNew} canDelete={canDelete || !!f.isNew}
                  onChange={(p) => patch(f.id, p)}
                  onUpload={(file) => upload(f.id, file)}
                  onRemove={() => { setItems((l) => l.filter((x) => x.id !== f.id)); if (!f.isNew) setRemoved((r) => [...r, f.id]); }} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {canCreate && (
          <button onClick={() => setItems((l) => [...l, { id: crypto.randomUUID(), name: '', category: 'Pendidikan', description: '', image_url: '', capacity: '', features: [], is_active: true, isNew: true }])}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#115E59]/40 px-3 py-2 text-xs font-semibold text-[#115E59]">
            <Plus size={14} /> Tambah fasilitas
          </button>
        )}
      </section>

      <section className="space-y-3 xl:sticky xl:top-20 xl:self-start">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-teal-950">Pratinjau langsung</p>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} className={btn(device === d)} aria-label={d}><Icon size={16} /></button>
            ))}
          </div>
        </div>
        <div className="overflow-auto rounded-2xl border border-teal-900/10 bg-[#FAF7F0] p-3">
          <div className="mx-auto transition-[width]" style={{ width: WIDTH[device], maxWidth: '100%' }}>
            {shown.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-400">Belum ada fasilitas yang ditampilkan.</p>
            ) : (
              <div className={`grid gap-2.5 ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {shown.map((f) => (
                  <article key={f.id} className="flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xs">
                    <div className="relative aspect-[16/10] bg-zinc-950/10 flex items-center justify-center overflow-hidden">
                      {f.image_url && <img src={f.image_url} alt={f.name} className="h-full w-full object-contain p-0.5" />}
                      <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-emerald-300">{f.category}</span>
                    </div>
                    <div className="space-y-1.5 p-3">
                      <h3 className="text-sm font-black leading-tight text-zinc-900">{f.name || 'Nama fasilitas'}</h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600">{f.description}</p>
                      {f.features.filter(Boolean).slice(0, 2).map((t, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-zinc-500"><CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" /><span className="truncate">{t}</span></div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-zinc-500">Pratinjau menampilkan kartu seperti di website. Filter kategori dan perbesar foto tetap hanya ada di website.</p>
      </section>
    </div>
  );
};


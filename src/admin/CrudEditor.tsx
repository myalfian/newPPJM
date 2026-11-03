import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  GripVertical, Trash2, Plus, Save, ImagePlus, Eye, EyeOff, Search, ChevronDown, ChevronUp,
  Bold, Italic, List, Monitor, Tablet, Smartphone,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import { crudByKey, type CrudSection, type Field } from './sections';

type Row = Record<string, unknown> & { id: string };
type Draft = Record<string, string | boolean>;
type Device = 'desktop' | 'tablet' | 'mobile';
const WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };
const MAX_IMAGE = 5 * 1024 * 1024;
const input = 'w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm disabled:bg-zinc-50';

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

/** Baris DB → nilai form (semua string/boolean agar mudah diedit). */
function toDraft(sec: CrudSection, row: Row | null): Draft {
  const d: Draft = {};
  for (const f of sec.fields) {
    const v = row?.[f.key];
    if (f.kind === 'bool') d[f.key] = row ? v === true : false;
    else if (f.kind === 'lines') d[f.key] = Array.isArray(v) ? (v as unknown[]).map(String).join('\n') : '';
    else if (f.kind === 'json') d[f.key] = v == null ? '' : JSON.stringify(v, null, 2);
    else if (f.kind === 'date') d[f.key] = typeof v === 'string' ? v.slice(0, 10) : '';
    else d[f.key] = v == null ? '' : String(v);
  }
  return d;
}

/** Nilai form → payload DB. Melempar Error berisi pesan ramah jika tidak valid. */
function toPayload(sec: CrudSection, d: Draft): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of sec.fields) {
    const v = d[f.key];
    if (f.kind === 'bool') { out[f.key] = v === true; continue; }
    const s = String(v ?? '').trim();
    if (f.required && !s) throw new Error(`"${f.label}" wajib diisi.`);
    if (f.kind === 'lines') out[f.key] = s ? s.split('\n').map((x) => x.trim()).filter(Boolean) : [];
    else if (f.kind === 'json') {
      if (!s) out[f.key] = null;
      else {
        try { out[f.key] = JSON.parse(s); } catch { throw new Error(`"${f.label}" bukan JSON yang valid.`); }
      }
    } else if (f.kind === 'number') {
      if (!s) out[f.key] = null;
      else if (Number.isNaN(Number(s))) throw new Error(`"${f.label}" harus berupa angka.`);
      else out[f.key] = Number(s);
    } else out[f.key] = s === '' ? null : s;
  }
  if (sec.slugFrom && !out.slug) out.slug = slugify(String(d[sec.slugFrom] ?? '')) || null;
  return out;
}

const RichField: React.FC<{ value: string; disabled: boolean; onChange: (html: string) => void }> = ({ value, disabled, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });
  const b = (a: boolean) => `rounded-lg p-1.5 ${a ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex gap-1 border-b border-zinc-100 p-1">
        <button type="button" className={b(!!editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Tebal"><Bold size={14} /></button>
        <button type="button" className={b(!!editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Miring"><Italic size={14} /></button>
        <button type="button" className={b(!!editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Daftar"><List size={14} /></button>
      </div>
      <EditorContent editor={editor} className="p-2.5 text-sm [&_.ProseMirror]:min-h-[110px] [&_.ProseMirror]:outline-none" />
    </div>
  );
};

const FieldInput: React.FC<{
  sec: CrudSection; f: Field; value: string | boolean; disabled: boolean;
  onChange: (v: string | boolean) => void; onUpload: (file: File) => Promise<string | null>;
}> = ({ f, value, disabled, onChange, onUpload }) => {
  const [busy, setBusy] = useState(false);
  const str = String(value ?? '');
  let control: React.ReactNode;
  switch (f.kind) {
    case 'bool':
      control = (
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-[#115E59]" checked={value === true} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
          {f.label}
        </label>
      );
      return <div>{control}</div>;
    case 'textarea':
      control = <textarea className={`${input} resize-y`} rows={3} value={str} disabled={disabled} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'lines':
      control = <textarea className={`${input} resize-y font-mono text-xs`} rows={3} value={str} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'json':
      control = <textarea className={`${input} resize-y font-mono text-xs`} rows={5} value={str} disabled={disabled} spellCheck={false} onChange={(e) => onChange(e.target.value)} />;
      break;
    case 'rich':
      control = <RichField value={str} disabled={disabled} onChange={onChange} />;
      break;
    case 'select':
      control = (
        <select className={input} value={str} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
          <option value="" />
          {f.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
      break;
    case 'image':
      control = (
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100">
            {str ? <img src={str} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="text-zinc-300" />}
          </div>
          {!disabled && (
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#115E59]">
              <ImagePlus size={14} /> {busy ? 'Mengunggah…' : str ? 'Ganti gambar' : 'Unggah gambar'}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  setBusy(true);
                  const url = await onUpload(file);
                  setBusy(false);
                  if (url) onChange(url);
                }} />
            </label>
          )}
        </div>
      );
      break;
    default:
      control = (
        <input className={input} type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : 'text'}
          value={str} disabled={disabled} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      );
  }
  return (
    <label className="block space-y-1 text-xs font-semibold text-zinc-700">
      <span>{f.label}{f.required && <span className="text-red-600"> *</span>}</span>
      {control}
      {f.help && <span className="block font-normal text-zinc-500">{f.help}</span>}
    </label>
  );
};

const Item: React.FC<{
  sec: CrudSection; row: Row; draft: Draft; open: boolean; sortable: boolean;
  canEdit: boolean; canDelete: boolean; canPublish: boolean; saving: boolean;
  onToggleOpen: () => void; onDraft: (k: string, v: string | boolean) => void;
  onSave: () => void; onDelete: () => void; onToggleActive: () => void; onUpload: (file: File) => Promise<string | null>;
}> = ({ sec, row, draft, open, sortable, canEdit, canDelete, canPublish, saving, onToggleOpen, onDraft, onSave, onDelete, onToggleActive, onUpload }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id, disabled: !sortable });
  const active = sec.activeField ? row[sec.activeField] !== false && row[sec.activeField] != null : true;
  const img = sec.imageField ? (row[sec.imageField] as string | null) : null;
  const main = sec.fields.filter((f) => !f.advanced);
  const adv = sec.fields.filter((f) => f.advanced);
  const [showAdv, setShowAdv] = useState(false);
  const title = String(row[sec.titleField] ?? '') || '(tanpa judul)';
  const sub = sec.subtitleField ? String(row[sec.subtitleField] ?? '') : '';
  const badge = sec.badgeField ? String(row[sec.badgeField] ?? '') : '';

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border bg-white ${isDragging ? 'border-[#115E59] shadow-md' : 'border-zinc-200'} ${active ? '' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 p-2.5">
        {sortable && (
          <button {...attributes} {...listeners} className="cursor-grab touch-none text-zinc-400" aria-label="Geser urutan"><GripVertical size={16} /></button>
        )}
        {sec.imageField && (
          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">{img && <img src={img} alt="" className="h-full w-full object-cover" />}</div>
        )}
        <button type="button" onClick={onToggleOpen} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <p className="truncate text-sm font-semibold text-teal-950">{title}</p>
          <p className="truncate text-xs text-zinc-500">{[badge, sub].filter(Boolean).join(' · ')}</p>
        </button>
        {sec.activeField && canPublish && (
          <button onClick={onToggleActive} className="text-zinc-500 hover:text-[#115E59]"
            aria-label={active ? 'Sembunyikan dari website' : 'Tampilkan di website'} title={active ? 'Tampil di website' : 'Disembunyikan'}>
            {active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
        <button onClick={onToggleOpen} className="text-zinc-400" aria-label={open ? 'Tutup' : 'Buka'}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {open && (
        <div className="space-y-3 border-t border-zinc-100 p-3">
          {main.map((f) => (
            <FieldInput key={f.key} sec={sec} f={f} value={draft[f.key]} disabled={!canEdit} onChange={(v) => onDraft(f.key, v)} onUpload={onUpload} />
          ))}
          {adv.length > 0 && (
            <div>
              <button type="button" onClick={() => setShowAdv((v) => !v)} className="text-xs font-semibold text-zinc-600 underline">
                {showAdv ? 'Sembunyikan' : 'Tampilkan'} pengaturan lanjutan
              </button>
              {showAdv && (
                <div className="mt-2 space-y-3 rounded-lg bg-zinc-50 p-3">
                  {adv.map((f) => (
                    <FieldInput key={f.key} sec={sec} f={f} value={draft[f.key]} disabled={!canEdit} onChange={(v) => onDraft(f.key, v)} onUpload={onUpload} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            {canDelete ? (
              <button onClick={onDelete} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600"><Trash2 size={14} /> Hapus</button>
            ) : <span />}
            {canEdit && (
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                <Save size={15} /> {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Editor: React.FC<{ sec: CrudSection }> = ({ sec }) => {
  const admin = useOutletContext<AdminOutletContext>();
  const canView = admin.can(sec.key, 'view');
  const canCreate = admin.can(sec.key, 'create');
  const canEdit = admin.can(sec.key, 'edit');
  const canDelete = admin.can(sec.key, 'delete');
  const canPublish = admin.can(sec.key, 'publish');

  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<Draft | null>(null);
  const [q, setQ] = useState('');
  const [device, setDevice] = useState<Device>('desktop');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'error' | 'ok'>('idle');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await db.from(sec.table).select('*').order(sec.sort.col, { ascending: sec.sort.asc }).limit(300);
    if (error) { setStatus('error'); setMsg('Gagal memuat data. Pastikan migrasi SQL sudah dijalankan.'); }
    const list = ((data as Row[] | null) ?? []).map((r) => ({ ...r, id: String(r.id) }));
    setRows(list);
    setDrafts(Object.fromEntries(list.map((r) => [r.id, toDraft(sec, r)])));
    setReady(true);
  }, [sec]);

  useEffect(() => { setReady(false); setOpenId(null); setNewRow(null); setMsg(''); void load(); }, [load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const upload = async (file: File): Promise<string | null> => {
    if (file.size > MAX_IMAGE) { setStatus('error'); setMsg('Ukuran gambar maksimal 5 MB.'); return null; }
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${sec.table}/${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from('cms-images').upload(path, file, { contentType: file.type });
    if (error) { setStatus('error'); setMsg('Gagal mengunggah gambar. Periksa izin atau format file.'); return null; }
    return db.storage.from('cms-images').getPublicUrl(path).data.publicUrl;
  };

  const fail = (m: string) => { setStatus('error'); setMsg(m); };
  const ok = (m: string) => { setStatus('ok'); setMsg(m); };

  const saveRow = async (row: Row) => {
    setSavingId(row.id);
    try {
      const payload = toPayload(sec, drafts[row.id]);
      const { error } = await db.from(sec.table).update(payload).eq('id', row.id);
      if (error) throw new Error('Gagal menyimpan. Anda mungkin tidak punya izin mengubah bagian ini.');
      await load();
      ok('Tersimpan. Website publik sudah diperbarui.');
    } catch (e) { fail((e as Error).message); }
    setSavingId(null);
  };

  const createRow = async () => {
    if (!newRow) return;
    setSavingId('new');
    try {
      const payload = toPayload(sec, newRow);
      if (sec.authorField && admin.session) payload[sec.authorField] = admin.session.user.id;
      if (sec.orderField) payload[sec.orderField] = rows.length;
      if (sec.activeField) payload[sec.activeField] = sec.activeField === 'is_published' ? false : true;
      const { error } = await db.from(sec.table).insert(payload);
      if (error) throw new Error('Gagal menambah data. Anda mungkin tidak punya izin menambah.');
      setNewRow(null);
      await load();
      ok('Data baru tersimpan.');
    } catch (e) { fail((e as Error).message); }
    setSavingId(null);
  };

  const removeRow = async (row: Row) => {
    if (!window.confirm('Hapus data ini? Tindakan ini tidak bisa dibatalkan.')) return;
    const { error } = await db.from(sec.table).delete().eq('id', row.id);
    if (error) return fail('Gagal menghapus. Anda mungkin tidak punya izin hapus.');
    await load();
    ok('Data dihapus.');
  };

  const toggleActive = async (row: Row) => {
    if (!sec.activeField) return;
    const next = row[sec.activeField] === false || row[sec.activeField] == null;
    const patch: Record<string, unknown> = { [sec.activeField]: next };
    if (sec.publishedAtField && next && !row[sec.publishedAtField]) patch[sec.publishedAtField] = new Date().toISOString();
    const { error } = await db.from(sec.table).update(patch).eq('id', row.id);
    if (error) return fail('Gagal mengubah status tampil.');
    await load();
  };

  const onDragEnd = async (e: DragEndEvent) => {
    if (!sec.orderField || !e.over || e.active.id === e.over.id) return;
    const from = rows.findIndex((r) => r.id === e.active.id);
    const to = rows.findIndex((r) => r.id === e.over!.id);
    const next = arrayMove(rows, from, to);
    setRows(next);
    const results = await Promise.all(next.map((r, i) => db.from(sec.table).update({ [sec.orderField!]: i }).eq('id', r.id)));
    if (results.some((r) => r.error)) { fail('Urutan tidak tersimpan. Anda mungkin tidak punya izin mengubah.'); await load(); }
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) => [sec.titleField, sec.subtitleField, sec.badgeField].some((k) => k && String(r[k] ?? '').toLowerCase().includes(t)));
  }, [rows, q, sec]);

  const devBtn = (a: boolean) => `rounded-lg p-1.5 ${a ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;
  const sortable = Boolean(sec.orderField && canEdit && !q);

  if (!canView) return <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Anda tidak punya akses melihat bagian ini.</p>;
  if (!ready) return <p className="text-sm text-zinc-500">Memuat…</p>;

  const visible = sec.activeField ? filtered.filter((r) => r[sec.activeField!] !== false && r[sec.activeField!] != null) : filtered;

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-teal-950">{sec.label}</h1>
          {canCreate && (
            <button onClick={() => { setNewRow(toDraft(sec, null)); setOpenId(null); }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#115E59] px-3.5 py-2 text-sm font-semibold text-white">
              <Plus size={15} /> Tambah
            </button>
          )}
        </div>
        {!canEdit && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Anda hanya bisa melihat bagian ini.</p>}
        {msg && <p role="status" className={`text-xs ${status === 'error' ? 'text-red-600' : 'text-teal-800'}`}>{msg}</p>}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-zinc-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari…" className={`${input} pl-9`} />
        </div>

        {newRow && (
          <div className="space-y-3 rounded-xl border border-[#115E59]/40 bg-white p-3">
            <p className="text-sm font-semibold text-teal-950">Data baru</p>
            {sec.fields.filter((f) => !f.advanced).map((f) => (
              <FieldInput key={f.key} sec={sec} f={f} value={newRow[f.key]} disabled={false}
                onChange={(v) => setNewRow((d) => (d ? { ...d, [f.key]: v } : d))} onUpload={upload} />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setNewRow(null)} className="rounded-xl px-3 py-2 text-sm text-zinc-600">Batal</button>
              <button onClick={createRow} disabled={savingId === 'new'} className="rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {savingId === 'new' ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">Pengaturan lanjutan bisa diisi setelah data tersimpan.</p>
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">Belum ada data.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={filtered.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {filtered.map((r) => (
                  <Item key={r.id} sec={sec} row={r} draft={drafts[r.id] ?? toDraft(sec, r)} open={openId === r.id} sortable={sortable}
                    canEdit={canEdit} canDelete={canDelete} canPublish={canPublish} saving={savingId === r.id}
                    onToggleOpen={() => setOpenId((c) => (c === r.id ? null : r.id))}
                    onDraft={(k, v) => setDrafts((d) => ({ ...d, [r.id]: { ...(d[r.id] ?? toDraft(sec, r)), [k]: v } }))}
                    onSave={() => saveRow(r)} onDelete={() => removeRow(r)} onToggleActive={() => toggleActive(r)} onUpload={upload} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <section className="space-y-3 xl:sticky xl:top-20 xl:self-start">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-teal-950">Pratinjau kartu</p>
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)} className={devBtn(device === d)} aria-label={d}><Icon size={16} /></button>
            ))}
          </div>
        </div>
        <div className="max-h-[70vh] overflow-auto rounded-2xl border border-teal-900/10 bg-[#FAF7F0] p-3">
          <div className="mx-auto transition-[width]" style={{ width: WIDTH[device], maxWidth: '100%' }}>
            {visible.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-400">Belum ada data yang ditampilkan.</p>
            ) : (
              <div className={`grid gap-2.5 ${device === 'mobile' || !sec.imageField ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {visible.map((r) => {
                  const d = drafts[r.id];
                  const get = (k?: string) => (k ? String((d?.[k] ?? r[k] ?? '') as string) : '');
                  const img = sec.imageField ? get(sec.imageField) : '';
                  return (
                    <article key={r.id} className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-xs">
                      {sec.imageField && (
                        <div className="relative aspect-[16/10] bg-zinc-100">
                          {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                          {sec.badgeField && get(sec.badgeField) && (
                            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-emerald-300">{get(sec.badgeField)}</span>
                          )}
                        </div>
                      )}
                      <div className="space-y-1 p-3">
                        {!sec.imageField && sec.badgeField && get(sec.badgeField) && (
                          <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{get(sec.badgeField)}</span>
                        )}
                        <h3 className="text-sm font-black leading-tight text-zinc-900">{get(sec.titleField) || '(tanpa judul)'}</h3>
                        {sec.subtitleField && <p className="line-clamp-2 text-xs text-zinc-600">{get(sec.subtitleField)}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-zinc-500">Pratinjau ini menampilkan ringkasan kartu. Tata letak lengkap bisa dilihat lewat tombol "Lihat Website".</p>
      </section>
    </div>
  );
};

export const CrudRoute: React.FC = () => {
  const { key } = useParams();
  const sec = crudByKey(key);
  if (!sec) return <p className="text-sm text-zinc-600">Bagian tidak ditemukan.</p>;
  return <Editor key={sec.key} sec={sec} />;
};


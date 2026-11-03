import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, GripVertical, Trash2, Plus, Monitor, Tablet, Smartphone, Save, Star } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useOutletContext } from 'react-router-dom';
import { db } from './useAdminSession';
import type { AdminOutletContext } from './AdminLayout';
import { SejarahView } from '../pages/jm-center/SejarahSection';
import type { HistoryMilestone } from '../pages/jm-center/types';

type Item = HistoryMilestone & { id: string };
type Device = 'desktop' | 'tablet' | 'mobile';
const WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };
const uid = () => crypto.randomUUID();
const input = 'w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-sm';

const Row: React.FC<{ it: Item; disabled: boolean; onChange: (p: Partial<HistoryMilestone>) => void; onRemove: () => void }> = ({
  it, disabled, onChange, onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: it.id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded-xl border bg-white p-2.5 ${isDragging ? 'border-[#115E59] shadow-md' : 'border-zinc-200'}`}
    >
      <button {...attributes} {...listeners} className="mt-2 cursor-grab touch-none text-zinc-400" aria-label="Geser urutan">
        <GripVertical size={16} />
      </button>
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <input className={`${input} w-24`} placeholder="Tahun" value={it.year} disabled={disabled} onChange={(e) => onChange({ year: e.target.value })} />
          <input className={input} placeholder="Judul tonggak" value={it.title} disabled={disabled} onChange={(e) => onChange({ title: e.target.value })} />
        </div>
        <textarea className={`${input} resize-none`} rows={2} placeholder="Keterangan" value={it.desc} disabled={disabled} onChange={(e) => onChange({ desc: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <button disabled={disabled} onClick={() => onChange({ highlight: !it.highlight })}
          className={it.highlight ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-500'} aria-label="Tandai penting" aria-pressed={!!it.highlight}>
          <Star size={16} fill={it.highlight ? 'currentColor' : 'none'} />
        </button>
        <button disabled={disabled} onClick={onRemove} className="text-zinc-400 hover:text-red-600" aria-label="Hapus tonggak"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

export const SejarahEditor: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const canEdit = admin.can('sejarah', 'edit');

  const [rowId, setRowId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [extra, setExtra] = useState<Record<string, unknown>>({});
  const [device, setDevice] = useState<Device>('desktop');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editable: canEdit,
    onUpdate: ({ editor: e }) => setContent(e.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    (async () => {
      const { data } = await db.from('jm_center_pages').select('*').eq('slug', 'sejarah').maybeSingle();
      if (data) {
        const ex = (data.extra_data ?? {}) as Record<string, unknown>;
        setRowId(data.id);
        setExtra(ex);
        const c = typeof data.content === 'string' ? data.content : '';
        setContent(c);
        editor.commands.setContent(c);
        setItems((Array.isArray(ex.timeline) ? (ex.timeline as HistoryMilestone[]) : []).map((t) => ({ ...t, id: uid() })));
      }
      setReady(true);
    })();
  }, [editor]);

  useEffect(() => {
    editor?.setEditable(canEdit);
  }, [editor, canEdit]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    setItems((list) => arrayMove(list, list.findIndex((m) => m.id === e.active.id), list.findIndex((m) => m.id === e.over!.id)));
  };

  const timeline: HistoryMilestone[] = items
    .filter((i) => i.title.trim() || i.desc.trim())
    .map(({ year, title, desc, highlight }) => ({ year: year.trim(), title: title.trim(), desc: desc.trim(), ...(highlight ? { highlight } : {}) }));

  const save = async () => {
    setStatus('saving');
    const payload = {
      slug: 'sejarah',
      title: 'Sejarah',
      content,
      extra_data: { ...extra, timeline },
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await (rowId
      ? db.from('jm_center_pages').update(payload).eq('id', rowId)
      : db.from('jm_center_pages').insert(payload).select('id').single());
    if (error) {
      setStatus('error');
      setMsg('Gagal menyimpan. Anda mungkin tidak punya izin mengubah bagian ini.');
      return;
    }
    if (!rowId && data && 'id' in data) setRowId((data as { id: string }).id);
    setStatus('saved');
    setMsg('Tersimpan. Website publik sudah diperbarui.');
  };

  const btn = (active: boolean) => `rounded-lg p-1.5 ${active ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;

  if (!ready) return <p className="text-sm text-zinc-500">Memuat…</p>;

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-teal-950">Sejarah</h1>
          {canEdit && (
            <button onClick={save} disabled={status === 'saving'}
              className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              <Save size={16} /> {status === 'saving' ? 'Menyimpan…' : 'Simpan'}
            </button>
          )}
        </div>
        {!canEdit && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Anda hanya bisa melihat bagian ini.</p>}
        {msg && <p role="status" className={`text-xs ${status === 'error' ? 'text-red-600' : 'text-teal-800'}`}>{msg}</p>}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-700">Pengantar sejarah</p>
          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="flex gap-1 border-b border-zinc-100 p-1.5">
              <button className={btn(!!editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Tebal"><Bold size={15} /></button>
              <button className={btn(!!editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Miring"><Italic size={15} /></button>
              <button className={btn(!!editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Daftar"><List size={15} /></button>
            </div>
            <EditorContent editor={editor} className="min-h-[110px] p-3 text-sm [&_.ProseMirror]:min-h-[90px] [&_.ProseMirror]:outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-700">Linimasa (geser untuk mengubah urutan, bintang = tonggak penting)</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((it) => (
                  <Row key={it.id} it={it} disabled={!canEdit}
                    onChange={(p) => setItems((l) => l.map((x) => (x.id === it.id ? { ...x, ...p } : x)))}
                    onRemove={() => setItems((l) => l.filter((x) => x.id !== it.id))} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {canEdit && (
            <button onClick={() => setItems((l) => [...l, { id: uid(), year: '', title: '', desc: '' }])}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#115E59]/40 px-3 py-2 text-xs font-semibold text-[#115E59]">
              <Plus size={14} /> Tambah tonggak
            </button>
          )}
        </div>
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
            <SejarahView history={timeline} content={content} />
          </div>
        </div>
      </section>
    </div>
  );
};


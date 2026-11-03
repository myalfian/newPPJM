import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, GripVertical, Trash2, Plus, Monitor, Tablet, Smartphone, Save } from 'lucide-react';
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
import { VisiMisiView } from '../pages/jm-center/VisiMisiSection';

type Mission = { id: string; text: string };
type Device = 'desktop' | 'tablet' | 'mobile';
const WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };
const uid = () => crypto.randomUUID();

const Row: React.FC<{ m: Mission; onChange: (t: string) => void; onRemove: () => void; disabled: boolean }> = ({
  m, onChange, onRemove, disabled,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id, disabled });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 rounded-xl border bg-white p-2 ${isDragging ? 'border-[#115E59] shadow-md' : 'border-zinc-200'}`}
    >
      <button {...attributes} {...listeners} className="mt-2 cursor-grab touch-none text-zinc-400" aria-label="Geser urutan">
        <GripVertical size={16} />
      </button>
      <textarea
        value={m.text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="flex-1 resize-none rounded-lg border-0 bg-transparent p-1.5 text-sm outline-none focus:bg-teal-50/50"
      />
      <button onClick={onRemove} disabled={disabled} className="mt-2 text-zinc-400 hover:text-red-600" aria-label="Hapus misi">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export const VisiMisiEditor: React.FC = () => {
  const admin = useOutletContext<AdminOutletContext>();
  const canEdit = admin.can('visi_misi', 'edit');

  const [rowId, setRowId] = useState<string | null>(null);
  const [title, setTitle] = useState('Visi Misi dan Tujuan');
  const [vision, setVision] = useState('');
  const [indicator, setIndicator] = useState('');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [extra, setExtra] = useState<Record<string, unknown>>({});
  const [device, setDevice] = useState<Device>('desktop');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editable: canEdit,
    onUpdate: ({ editor: e }) => setVision(e.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    (async () => {
      const { data } = await db.from('jm_center_pages').select('*').eq('slug', 'visi-misi').maybeSingle();
      if (data) {
        const ex = (data.extra_data ?? {}) as Record<string, unknown>;
        setRowId(data.id);
        setTitle(data.title ?? 'Visi Misi dan Tujuan');
        setExtra(ex);
        const v = typeof ex.vision === 'string' ? ex.vision : '';
        setVision(v);
        editor.commands.setContent(v);
        setIndicator(typeof ex.vision_indicator === 'string' ? ex.vision_indicator : '');
        setMissions((Array.isArray(ex.missions) ? (ex.missions as string[]) : []).map((t) => ({ id: uid(), text: t })));
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
    setMissions((list) => {
      const from = list.findIndex((m) => m.id === e.active.id);
      const to = list.findIndex((m) => m.id === e.over!.id);
      return arrayMove(list, from, to);
    });
  };

  const save = async () => {
    setStatus('saving');
    const texts = missions.map((m) => m.text.trim()).filter(Boolean);
    const payload = {
      slug: 'visi-misi',
      title: title.trim() || 'Visi Misi dan Tujuan',
      content: [editor?.getText() ?? '', ...texts].join('\n\n'),
      extra_data: { ...extra, vision, vision_indicator: indicator, missions: texts },
      updated_at: new Date().toISOString(),
    };
    const q = rowId
      ? db.from('jm_center_pages').update(payload).eq('id', rowId)
      : db.from('jm_center_pages').insert(payload).select('id').single();
    const { data, error } = await q;
    if (error) {
      setStatus('error');
      setMsg('Gagal menyimpan. Anda mungkin tidak punya izin mengubah bagian ini.');
      return;
    }
    if (!rowId && data && 'id' in data) setRowId((data as { id: string }).id);
    setStatus('saved');
    setMsg('Tersimpan. Website publik sudah diperbarui.');
  };

  const btn = (active: boolean) =>
    `rounded-lg p-1.5 ${active ? 'bg-[#115E59] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`;

  if (!ready) return <p className="text-sm text-zinc-500">Memuat…</p>;

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-teal-950">Visi, Misi & Tujuan</h1>
          {canEdit && (
            <button onClick={save} disabled={status === 'saving'}
              className="inline-flex items-center gap-2 rounded-xl bg-[#115E59] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              <Save size={16} /> {status === 'saving' ? 'Menyimpan…' : 'Simpan'}
            </button>
          )}
        </div>
        {!canEdit && <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Anda hanya bisa melihat bagian ini.</p>}
        {msg && <p role="status" className={`text-xs ${status === 'error' ? 'text-red-600' : 'text-teal-800'}`}>{msg}</p>}

        <label className="block space-y-1 text-xs font-semibold text-zinc-700">
          Judul bagian
          <input value={title} disabled={!canEdit} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-normal" />
        </label>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-700">Visi</p>
          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="flex gap-1 border-b border-zinc-100 p-1.5">
              <button className={btn(!!editor?.isActive('bold'))} onClick={() => editor?.chain().focus().toggleBold().run()} aria-label="Tebal"><Bold size={15} /></button>
              <button className={btn(!!editor?.isActive('italic'))} onClick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Miring"><Italic size={15} /></button>
              <button className={btn(!!editor?.isActive('bulletList'))} onClick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Daftar"><List size={15} /></button>
            </div>
            <EditorContent editor={editor} className="min-h-[110px] p-3 text-sm [&_.ProseMirror]:min-h-[90px] [&_.ProseMirror]:outline-none" />
          </div>
        </div>

        <label className="block space-y-1 text-xs font-semibold text-zinc-700">
          Indikator visi (pisahkan dengan titik koma)
          <textarea value={indicator} disabled={!canEdit} onChange={(e) => setIndicator(e.target.value)} rows={2}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-normal" />
        </label>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-700">Misi (geser untuk mengubah urutan)</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={missions.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {missions.map((m) => (
                  <Row key={m.id} m={m} disabled={!canEdit}
                    onChange={(t) => setMissions((l) => l.map((x) => (x.id === m.id ? { ...x, text: t } : x)))}
                    onRemove={() => setMissions((l) => l.filter((x) => x.id !== m.id))} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {canEdit && (
            <button onClick={() => setMissions((l) => [...l, { id: uid(), text: '' }])}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#115E59]/40 px-3 py-2 text-xs font-semibold text-[#115E59]">
              <Plus size={14} /> Tambah misi
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
            <VisiMisiView
              sectionTitle={title}
              vision={vision}
              visionIndicator={indicator}
              missions={missions.map((m) => m.text).filter(Boolean)}
              values={Array.isArray(extra.values) ? (extra.values as { title: string; desc: string }[]) : []}
            />
          </div>
        </div>
        <p className="text-[11px] text-zinc-500">Lebar pratinjau meniru ponsel/tablet, tetapi breakpoint tetap mengikuti lebar jendela browser.</p>
      </section>
    </div>
  );
};


import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaKeunggulan: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Judul Pilar Keunggulan',
      type: 'text',
      required: true,
      placeholder: "Contoh: Tahfidzul Qur'an Mutqin"
    },
    {
      name: 'description',
      label: 'Keterangan Pilar',
      type: 'textarea',
      required: true,
      placeholder: 'Penjelasan program keunggulan secara mendalam...'
    },
    {
      name: 'icon',
      label: 'Nama Icon (Lucide)',
      type: 'text',
      placeholder: 'Contoh: BookOpen, Cpu, Languages, ShieldCheck'
    },
    {
      name: 'color',
      label: 'Tema Warna Tailwind',
      type: 'select',
      options: [
        { label: 'Emerald (Hijau Pondok)', value: 'emerald' },
        { label: 'Blue (Sains & Teknologi)', value: 'blue' },
        { label: 'Amber (Bahasa & Internasional)', value: 'amber' },
        { label: 'Indigo (Karakter & Salaf)', value: 'indigo' },
        { label: 'Rose (Aktivitas & Kreatif)', value: 'rose' }
      ]
    },
    {
      name: 'image_url',
      label: 'Foto Pendukung (Opsional)',
      type: 'image',
      bucket: 'cms-images'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="sub_items"
      parentModule="keunggulan_items"
      displayName="Pilar Keunggulan Pesantren"
      fields={fields}
      allowFeatured={false}
      allowReorder={true}
      allowCategories={false}
      storageBucket="cms-images"
    />
  );
};

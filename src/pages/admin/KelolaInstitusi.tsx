import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaInstitusi: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nama Lembaga / Unit Pendidikan',
      type: 'text',
      required: true,
      placeholder: 'Contoh: SMP Plus Jauharul Maknuun'
    },
    {
      name: 'category',
      label: 'Kategori Unit',
      type: 'select',
      options: [
        { label: 'Pondok Pesantren', value: 'Pondok Pesantren' },
        { label: 'Sekolah Formal', value: 'Sekolah Formal' },
        { label: 'Madrasah Diniyah', value: 'Madrasah Diniyah' },
        { label: 'Yayasan / Pusat', value: 'Yayasan' }
      ]
    },
    {
      name: 'description',
      label: 'Deskripsi Singkat',
      type: 'textarea',
      placeholder: 'Jelaskan visi, kurikulum, dan karakteristik lembaga...'
    },
    {
      name: 'image_url',
      label: 'Foto / Logo Lembaga',
      type: 'image',
      bucket: 'cms-images'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="institutions"
      displayName="Lembaga Pendidikan PPJM"
      fields={fields}
      allowFeatured={true}
      allowReorder={true}
      allowCategories={true}
      storageBucket="cms-images"
    />
  );
};


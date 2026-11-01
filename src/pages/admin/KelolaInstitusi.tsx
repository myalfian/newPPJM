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
      name: 'type',
      label: 'Kategori / Tipe Unit',
      type: 'select',
      required: true,
      options: [
        { label: 'Pondok Pesantren (Salaf & Tahfidz)', value: 'pesantren' },
        { label: 'SMP Plus Jauharul Maknuun (Formal)', value: 'formal' },
        { label: 'Madrasah Diniyah (MDT Wustho)', value: 'diniyah' },
        { label: 'Yayasan / Manajemen Pusat', value: 'yayasan' }
      ]
    },
    {
      name: 'description',
      label: 'Deskripsi Naskah Profil Lengkap',
      type: 'richtext',
      placeholder: 'Tuliskan sejarah, kurikulum, sintesa kiblat, dan profil kelembagaan...'
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


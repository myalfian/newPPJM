import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaFasilitas: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Nama Fasilitas',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Laboratorium Komputer Modern & Robotik'
    },
    {
      name: 'category',
      label: 'Kategori Fasilitas',
      type: 'select',
      required: true,
      parentModuleCategory: 'facilities_categories'
    },
    {
      name: 'description',
      label: 'Deskripsi Fasilitas',
      type: 'textarea',
      placeholder: 'Jelaskan fasilitas, spesifikasi, dan manfaat untuk santri...'
    },
    {
      name: 'image_url',
      label: 'Foto Fasilitas (WebP)',
      type: 'image',
      bucket: 'fasilitas'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="facilities"
      displayName="Fasilitas Pesantren"
      categoryParentModule="facilities_categories"
      fields={fields}
      allowFeatured={true}
      allowReorder={true}
      allowCategories={true}
      storageBucket="fasilitas"
    />
  );
};


import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaNavbar: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Nama Menu Navigasi',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Smart JM'
    },
    {
      name: 'description',
      label: 'Subtitle / Keterangan Menu',
      type: 'text',
      placeholder: 'Contoh: Tahfidz, STEM & Mandarin'
    },
    {
      name: 'icon',
      label: 'Icon Lucide',
      type: 'text',
      placeholder: 'Contoh: Sparkles, BookOpen, Trophy'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="sub_items"
      parentModule="navbar_items"
      displayName="Menu Navigasi Utama (Navbar 9 Pilar)"
      fields={fields}
      allowFeatured={false}
      allowReorder={true}
      allowCategories={false}
    />
  );
};


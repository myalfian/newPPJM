import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaBottomNav: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Label Menu Mobile',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Beranda'
    },
    {
      name: 'icon',
      label: 'Icon Lucide',
      type: 'text',
      placeholder: 'Contoh: Home, GraduationCap, Sparkles'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="sub_items"
      parentModule="bottom_nav_items"
      displayName="Menu Navigasi Mobile (Bottom Bar)"
      fields={fields}
      allowFeatured={false}
      allowReorder={true}
      allowCategories={false}
    />
  );
};


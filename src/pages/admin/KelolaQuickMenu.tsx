import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaQuickMenu: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'label',
      label: 'Label Menu Cepat',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Pendaftaran Santri Baru'
    },
    {
      name: 'link',
      label: 'Tautan Tujuan (URL / Path)',
      type: 'text',
      required: true,
      placeholder: 'Contoh: /spmb atau https://wa.me/...'
    },
    {
      name: 'icon',
      label: 'Icon Lucide',
      type: 'text',
      placeholder: 'Contoh: UserPlus, GraduationCap, Trophy, BookOpen'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="quick_menus"
      displayName="Menu Akses Cepat (Quick Menu)"
      fields={fields}
      allowFeatured={false}
      allowReorder={true}
      allowCategories={false}
    />
  );
};


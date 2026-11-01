import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaSpmb: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'title',
      label: 'Nama Gelombang SPMB',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Gelombang 1 (Jalur Prestasi & Beasiswa)'
    },
    {
      name: 'date_range',
      label: 'Periode Pendaftaran',
      type: 'text',
      required: true,
      placeholder: 'Contoh: 1 November 2026 - 31 Januari 2027'
    },
    {
      name: 'description',
      label: 'Keterangan Gelombang & Syarat',
      type: 'textarea',
      placeholder: 'Rincian kuota, tes wawancara, dan biaya formulir...'
    },
    {
      name: 'cta_link',
      label: 'Tautan Pendaftaran (Form / WA)',
      type: 'text',
      placeholder: 'https://bit.ly/spmb-ppjm-2027 atau /spmb'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="spmb_info"
      displayName="Informasi Gelombang SPMB"
      fields={fields}
      allowFeatured={true}
      allowReorder={true}
      allowCategories={false}
    />
  );
};


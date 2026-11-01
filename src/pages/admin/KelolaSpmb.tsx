import React from 'react';
import { MultiSectionBuilder, FieldConfig } from '../../components/admin/MultiSectionBuilder';

export const KelolaSpmb: React.FC = () => {
  const fields: FieldConfig[] = [
    {
      name: 'tahun_ajaran',
      label: 'Tahun Ajaran',
      type: 'text',
      required: true,
      placeholder: 'Contoh: 2026/2027'
    },
    {
      name: 'gelombang',
      label: 'Nama Gelombang SPMB',
      type: 'text',
      required: true,
      placeholder: 'Contoh: Gelombang 1 (Jalur Unggulan & Beasiswa)'
    },
    {
      name: 'kontak_wa',
      label: 'Nomor WhatsApp Panitia SPMB',
      type: 'text',
      required: true,
      placeholder: 'Contoh: 6285646199273'
    },
    {
      name: 'alur',
      label: 'Alur Tahapan Pendaftaran (Langkah demi Langkah)',
      type: 'tags',
      placeholder: 'Contoh: 1. Pendaftaran Online / Langsung'
    },
    {
      name: 'persyaratan',
      label: 'Berkas Persyaratan Administrasi',
      type: 'tags',
      placeholder: 'Contoh: Fotokopi Akta Kelahiran & KK (2 Lembar)'
    },
    {
      name: 'biaya',
      label: 'Rincian Biaya & Infaq Santri (Tekan Enter tiap item)',
      type: 'tags',
      placeholder: 'Contoh: Infaq Gedung: Rp 3.500.000'
    }
  ];

  return (
    <MultiSectionBuilder
      tableName="spmb_info"
      displayName="Informasi SPMB Santri Baru"
      fields={fields}
      allowFeatured={true}
      allowReorder={true}
      allowCategories={false}
    />
  );
};


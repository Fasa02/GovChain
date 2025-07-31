import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

export default function DetailPage() {
  const { state } = useLocation();
  const code      = state?.code || '–';

  const detail = {
    status: 'Asli, Terverifikasi di Blockchain',
    nft: '3Qda…1QHQA',
    wallet: 'Pemerintah Kota Surabaya',
    izin: '11SKS1JDAHWQ',
    jenis: 'Izin Usaha Konstruksi',
    pemilik: 'PT. Cinta Abadi',
    tanggal: '11/2/2023',
    berlaku: '11/2/2028'
  };

  return (
    <div className="detail-page">
      <h2>Detail Perizinan</h2>
      <div className="detail-card">
        <div className="status">
          Status Keaslian: <span className="badge">{detail.status}</span>
        </div>
        <dl>
          <dt>Nomor NFT</dt><dd>{detail.nft}</dd>
          <dt>Wallet Verifikator</dt><dd>{detail.wallet}</dd>
          <dt>Nomor Izin</dt><dd>{detail.izin}</dd>
          <dt>Jenis Izin</dt><dd>{detail.jenis}</dd>
          <dt>Nama Pemilik Usaha</dt><dd>{detail.pemilik}</dd>
          <dt>Tanggal Terbit</dt><dd>{detail.tanggal}</dd>
          <dt>Berlaku Hingga</dt><dd>{detail.berlaku}</dd>
        </dl>
        <button className="btn btn-secondary">
          Lihat di Blockchain Explorer
        </button>
      </div>
    </div>
  );
}

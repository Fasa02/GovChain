import React from 'react';
import './App.css';

export default function ScanQR() {
  return (
    <div className="scan-page">
      <h2>Scan QR</h2>
      <p>Lakukan verifikasi izin usaha dengan mudah.</p>
       <div className="scan-actions">
        <button className="btn btn-primary">
          <img src="/images/scan1.png" alt="Scan Icon" className="btn-icon" />
          Mulai Verifikasi Sekarang
        </button>
        <button className="btn btn-secondary">
          <img src="/images/unggah.png" alt="Upload Icon" className="btn-icon" />
          Unggah QR
        </button>
      </div>
    </div>
  );
}
// src/RegistrationFlow.js
import React, { useState } from 'react';
import './App.css';

export default function RegistrationFlow() {
  const [step, setStep]     = useState(1);
  const [file, setFile]     = useState(null);
  const [summary, setSummary] = useState(null);

  // Handler upload PDF
  const handleUpload = e => {
    const pdf = e.target.files[0];
    if (!pdf) return;
    setFile(pdf);

    // *Di sini kamu bisa parse PDF-nya (misal pakai pdfjs),
    // lalu generate summary dari isinya. Sekarang dummy:*
    setSummary({
      jumlah: 124,
      jenis: 5,
      pemilik: 20,
      terbit: '11/2/2023',
      sampai: '11/2/2028'
    });

    setStep(2);
  };

  // Handler daftarkan ke blockchain
  const handleMint = () => {
    // Panggil API smart contract atau backend-mu di sini...
    // Setelah sukses:
    setStep(3);
  };

  return (
    <div className="reg-flow">
      {/* Step indicator */}
      <div className="stepper">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="circle">1</div><div className="label">Unggah</div>
          <div className="bar" />
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="circle">2</div><div className="label">Rangkuman</div>
          <div className="bar" />
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="circle">3</div><div className="label">Sukses</div>
        </div>
      </div>

      {/* CONTENT */}
      {step === 1 && (
        <div className="step-panel">
          <div className="upload-box">
            <img src="/images/pdf-icon.png" alt="PDF" className="upload-icon"/>
            <p>Unggah PDF berisi detail perizinan</p>
            <label className="btn-primary">
              Pilih File PDF
              <input type="file" accept="application/pdf" hidden onChange={handleUpload} />
            </label>
          </div>
        </div>
      )}

      {step === 2 && summary && (
        <div className="step-panel mint-summary">
          <div className="summary-card">
            <h3>Rangkuman</h3>
            <div className="grid-two">
              <div><strong>{summary.jumlah}</strong><br/>Jumlah Izin</div>
              <div><strong>{summary.jenis}</strong><br/>Jenis Izin</div>
              <div><strong>{summary.pemilik}</strong><br/>Pemilik Usaha</div>
            </div>
            <p>Terbit: {summary.terbit}<br/>Hingga: {summary.sampai}</p>
          </div>
          <div className="mint-card">
            <h3>Terbitkan NFT</h3>
            <p>Daftarkan detail izin ini ke blockchain sebagai NFT.</p>
            <button className="btn-primary" onClick={handleMint}>
              Daftarkan ke Blockchain
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-panel success-card">
          <h3>Daftar ke Blockchain Sukses</h3>
          <img src="/images/success.png" alt="Sukses" className="success-icon"/>
          <button className="btn-primary">
            Lihat di Blockchain Explorer
          </button>
        </div>
      )}
    </div>
  );
}

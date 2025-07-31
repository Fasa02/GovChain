// src/RegistrationFlow.js
import React, { useState } from 'react';
import './App.css';

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const verifier = 'Pemerintah Kota Surabaya';
  const [nftHash, setNftHash] = useState('');

  // Handler upload PDF
  const handleUpload = e => {
    const pdf = e.target.files[0];
    if (!pdf) return;
    setFile(pdf);
    // dummy summary
    setSummary({ jumlah:124, jenis:5, pemilik:20, terbit:'11/2/2023', sampai:'11/2/2028' });
    setStep(2);
  };

  // Handler daftarkan ke blockchain (step 3)
  const handleMint = () => setStep(3);

  return (
    <div className="reg-flow">
      {/* Step indicator */}
      <div className="stepper">
        {['Unggah','Penerbitan NFT','Sukses'].map((label,i) => (
          <div key={i} className={`step ${step > i ? 'active' : ''}`}>
            <div className="circle">{step > i ? '✔' : i+1}</div>
            <div className="label">{label}</div>
            {i < 2 && <div className="bar" />}            
          </div>
        ))}
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
        <div className="step-panel mint-card">
          <h3>Terbitkan NFT</h3>
          <p>Anda akan mencatat izin ini secara permanen ke blockchain dan menerbitkan aset NFT sebagai bukti otentik. Pastikan data sudah benar.</p>
          <button className="btn-primary" onClick={handleMint}>
            Daftarkan ke Blockchain
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="step-panel success-card">
          <h3>Daftar ke Blockchain Sukses</h3>
          <div className="success-content">
            <div className="success-info">
              <label>Wallet Verifikator</label>
              <p>{verifier} ✅</p>
              <label>NFT Hash</label>
              <div className="hash-input">
                <input
                  type="text"
                  value={nftHash}
                  onChange={e => setNftHash(e.target.value)}
                  placeholder="3Qda...10HQA"
                />
                <button className="btn-secondary">🔍</button>
              </div>
            </div>
            <img src="/images/cube-plus.png" alt="" className="success-icon"/>
          </div>
          <button className="btn-primary explorer-btn">
            Lihat di Blockchain Explorer
          </button>
        </div>
      )}
    </div>
  );
}

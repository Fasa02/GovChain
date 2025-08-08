import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'react-qr-code';
import Web3Service from './Web3.js';
import './App.css';

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [hash, setHash] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const connected = await Web3Service.connectWallet();
    setIsWalletConnected(connected);
    if (connected) {
      setWalletAddress(Web3Service.account);
    }
  };

  const handleUpload = async (e) => {
    const pdf = e.target.files[0];
    if (!pdf) return;

    const formData = new FormData();
    formData.append('file', pdf);

    try {
      const response = await fetch('http://localhost:3000/api/hash/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await response.json();
      const ipfsHash = uploadResult.hash;

      console.log("✅ File berhasil diupload ke IPFS:", ipfsHash);

      // Rangkuman sementara
      const newSummary = {
        jumlah: 124,
        jenis: 5,
        pemilik: 20,
        terbit: '11/2/2023',
        sampai: '11/2/2028',
        ipfsHash
      };

      setSummary(newSummary);

      // Kirim metadata ke backend
      const mintResponse = await fetch('http://localhost:3000/api/hash/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSummary)
      });

      const mintResult = await mintResponse.json();
      const metadataHash = mintResult.metadataHash;

      if (!metadataHash) {
        console.error("❌ metadataHash undefined:", mintResult);
        throw new Error("Metadata hash tidak ditemukan di response backend");
      }

      console.log("✅ Metadata hash:", metadataHash);

      // Simpan IPFS metadata ke summary
      setSummary(prev => ({
        ...prev,
        ipfsHash: metadataHash // perbarui dari hash PDF → metadata
      }));

      setStep(2);
    } catch (err) {
      console.error("❌ Upload gagal:", err);
      alert('Upload gagal: ' + err.message);
    }
  };


  const handleMint = async () => {
    try {
      if (!summary) {
        alert('Summary belum tersedia');
        return;
      }

      // Upload metadata JSON ke IPFS via backend
      const response = await fetch('http://localhost:3000/api/hash/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      });

      const result = await response.json();

      if (!result || !result.metadataHash) {
        console.error('❌ metadataHash undefined:', result);
        throw new Error('Metadata hash tidak ditemukan di response backend');
      }

      const metadataHash = result.metadataHash;

      // Mint ke blockchain
      const txResult = await Web3Service.mintPermit(metadataHash);
      console.log('✅ Minting successful:', txResult);

      setHash(metadataHash);
      setTxHash(txResult.txHash);
      setTokenId(txResult.tokenId);
      setStep(3);
    } catch (err) {
      console.error('❌ Minting failed:', err);
      alert('Failed to mint NFT: ' + err.message);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        handleUpload({ target: { files: [file] } });
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, []);

  return (
    <div className="reg-flow">
      {/* Stepper */}
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

      {/* Step 1: Upload PDF */}
      {step === 1 && (
        <div className="step-panel">
          <div
            className={`upload-box ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>{isDragging ? 'Lepaskan file di sini' : 'Unggah PDF berisi detail perizinan'}</p>
            <p className="upload-hint">Drag & drop PDF atau</p>
            <label className="btn-primary">
              Pilih File PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Summary & Mint */}
      {step === 2 && summary && (
        <div className="step-panel mint-summary">
          <div className="summary-card">
            <h3>Rangkuman</h3>
            <div className="grid-two">
              <div><strong>{summary.jumlah}</strong><br />Jumlah Izin</div>
              <div><strong>{summary.jenis}</strong><br />Jenis Izin</div>
              <div><strong>{summary.pemilik}</strong><br />Pemilik Usaha</div>
            </div>
            <p>Terbit: {summary.terbit}<br />Hingga: {summary.sampai}</p>
            <p>IPFS Hash (PDF): {summary.ipfsHash}</p>
          </div>

          <div className="mint-card">
            <h3>Terbitkan NFT</h3>
            <p>Daftarkan detail izin ini ke blockchain sebagai NFT.</p>
            <button
              className="btn-primary"
              onClick={handleMint}
              disabled={!isWalletConnected}
            >
              {isWalletConnected ? 'Daftarkan ke Blockchain' : 'Connect Wallet First'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Sukses & QR */}
      {step === 3 && (
        <div className="step-panel success-card">
          <h3>Daftar ke Blockchain Sukses</h3>
          <div className="summary-card">
            <h3>QR Code</h3>
            <div style={{ }}>
              <QRCode
                value={JSON.stringify({
                  tokenId: tokenId?.toString(),
                  contract: Web3Service.contractAddress,
                  chainId: 31337
                })}
                size={128}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
          </div>
          {txHash && (
            <div className="hash-display">
              <p>Transaction Hash:</p>
              <code>{txHash}</code>
            </div>
          )}
          <button className="btn-primary1" onClick={() => window.open(`https://custom-block-explorer.vercel.app/tx/${txHash}`)}>
            Lihat di Blockchain Explorer
          </button>
        </div>
      )}
    </div>
  );
}

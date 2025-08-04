import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'react-qr-code';
import Web3Service from './Web3.js';
import './App.css';

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [hash, setHash] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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

  // Handler upload PDF
  const handleUpload = async (e) => {
    console.log('📥 handleUpload terpanggil');
    const pdf = e.target.files[0];
    if (!pdf) return;

    setFile(pdf);
    const formData = new FormData();
    formData.append('file', pdf);
    
    try {
      const response = await fetch('http://localhost:3000/api/hash/upload', {
        method: 'POST',
        body: formData,
      });

      const hash = (await response.text()).trim();
      console.log('✅ File terkirim, IPFS hash:', hash);
      setHash(hash);
      
      setSummary({
        jumlah: 124,
        jenis: 5,
        pemilik: 20,
        terbit: '11/2/2023',
        sampai: '11/2/2028',
        ipfsHash: hash
      });

      setStep(2);
    } catch (err) {
      console.error('❌ Upload gagal:', err);
    }
  };

  // Handler daftarkan ke blockchain
  const handleMint = async () => {
    try {
      if (!isWalletConnected) {
        const connected = await Web3Service.connectWallet();
        if (!connected) {
          alert('Please connect your wallet first');
          return;
        }
        setIsWalletConnected(true);
        setWalletAddress(Web3Service.account);
      }

      console.log('🔗 Minting to blockchain...');
      
      // Mint NFT directly using the IPFS hash from summary
      const transaction = await Web3Service.mintPermit(summary.ipfsHash);
      
      console.log('✅ Minting successful:', transaction);
      setHash(summary.ipfsHash);
      setStep(3);
    } catch (err) { 
      console.error('❌ Minting failed:', err);
      alert('Failed to mint NFT: ' + err.message);
    }
  };

  //drag an drop
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
          <div 
            className={`upload-box ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 386.883"><path fill-rule="nonzero" d="M377.763 115.7c-9.42 2.733-18.532 6.86-27.591 12.155-9.256 5.41-18.373 12.031-27.649 19.629l-19.849-22.742c16.721-15.527 33.187-26.464 49.108-33.514-13.06-22.39-31.538-38.532-52.418-48.549-21.339-10.238-45.242-14.171-68.507-11.922-23.123 2.234-45.56 10.619-64.123 25.025-21.451 16.646-37.775 41.521-44.034 74.469l-1.959 10.309-10.27 1.801c-27.993 4.909-49.283 18.793-62.859 36.776-7.186 9.518-12.228 20.161-14.969 31.19-2.728 10.979-3.193 22.399-1.243 33.525 3.291 18.766 13.592 36.737 31.669 50.382 5.467 4.128 11.376 7.709 17.886 10.48 6.215 2.647 13.017 4.612 20.558 5.686h78.258v30.246h-78.827l-1.891-.178c-11.099-1.413-20.982-4.186-29.914-7.99-8.994-3.829-16.989-8.65-24.264-14.142C20.256 299.753 6.183 275.02 1.628 249.05c-2.669-15.225-2.027-30.868 1.715-45.929 3.73-15.012 10.524-29.404 20.167-42.177 16.233-21.507 40.501-38.514 71.737-46.241 9.014-35.904 28.299-63.573 53.057-82.786C171.438 13.963 199.327 3.521 228.021.748c28.551-2.76 57.975 2.11 84.339 14.758 28.095 13.479 52.661 35.696 68.986 66.815 13.827-2.201 27.042-1.521 39.42 1.5 18.862 4.603 35.493 14.611 49.212 28.159 13.36 13.193 23.994 29.797 31.216 48.001 16.814 42.377 15.209 93.978-13.361 131.996-9.299 12.37-21.252 22.45-35.572 30.468-13.811 7.735-29.884 13.593-47.949 17.787l-3.368.414h-66.346V310.4h64.727c14.501-3.496 27.297-8.212 38.168-14.299 10.794-6.045 19.62-13.396 26.238-22.2 21.842-29.066 22.745-69.34 9.463-102.815-5.698-14.359-13.999-27.371-24.363-37.605-10.007-9.882-21.906-17.126-35.154-20.36-6.654-1.625-13.721-2.248-21.145-1.705l-14.769 4.284zM205.205 265.348c-5.288 6.391-14.756 7.285-21.148 1.997-6.391-5.288-7.285-14.757-1.997-21.148l59.645-72.019c5.288-6.392 14.757-7.285 21.148-1.998a15.053 15.053 0 012.707 2.921l60.072 72.279c5.287 6.359 4.42 15.802-1.939 21.09-6.359 5.287-15.801 4.42-21.089-1.939l-34.288-41.256.202 146.628c0 8.273-6.707 14.98-14.98 14.98-8.274 0-14.981-6.707-14.981-14.98l-.202-146.582-33.15 40.027z"/></svg>
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
            {/* IPFS Hash Text */}
            <p>IPFS Hash: {summary.ipfsHash}</p>
          </div>

          <div className="summary-card">
            <h3>QR Code</h3>
            {/* Dynamic QR Code */}
            <div style={{ marginTop: '50%' }}>
              <QRCode
                value={summary.ipfsHash}
                size={128}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
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


      {step === 3 && (
        <div className="step-panel success-card">
          <h3>Daftar ke Blockchain Sukses</h3>
          <img src="/images/success.png" alt="Sukses" className="success-icon"/>
          {hash && (
            <div className="hash-display">
              <p>Transaction Hash:</p>
              <code>{hash}</code>
            </div>
          )}
          <button className="btn-primary" onClick={() => window.open(`https://custom-block-explorer.vercel.app/tx/${hash}`)}>
            Lihat di Blockchain Explorer
          </button>
        </div>
      )}
    </div>
  );
}

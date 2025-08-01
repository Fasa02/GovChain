import React, { useState, useEffect } from 'react';
import Web3Service from './Web3.js';
import './App.css';

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [hash, setHash] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

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

      const data = await response.json();
      console.log('✅ File terkirim:', data);
      setHash(data.hash);
      
      setSummary({
        jumlah: 124,
        jenis: 5,
        pemilik: 20,
        terbit: '11/2/2023',
        sampai: '11/2/2028',
        ipfsHash: data.hash
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
      setHash(transaction.transactionHash);
      setStep(3);
    } catch (err) {
      console.error('❌ Minting failed:', err);
      alert('Failed to mint NFT: ' + err.message);
    }
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

      {/* Wallet Status */}
      <div className="wallet-status">
        {isWalletConnected ? (
          <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
        ) : (
          <button className="btn-connect" onClick={checkWalletConnection}>
            Connect Wallet
          </button>
        )}
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
            <p>IPFS Hash: {summary.ipfsHash}</p>
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
          <button className="btn-primary" onClick={() => window.open(`http://127.0.0.1:8545 `)}>
            Lihat di Blockchain Explorer
          </button>
        </div>
      )}
    </div>
  );
}
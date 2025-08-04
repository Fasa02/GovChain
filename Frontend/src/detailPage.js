import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Web3Service from './Web3';
import './App.css';

export default function DetailPage() {
  const { state } = useLocation();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermitDetails = async () => {
      try {
        if (!state?.code) {
          throw new Error('No QR code provided');
        }

        // Connect to Web3
        const connected = await Web3Service.connectWallet();
        if (!connected) {
          throw new Error('Failed to connect to blockchain');
        }

        // Fetch permit details from smart contract using the IPFS hash
        const ipfsHash = state.code;
        const permitDetails = await Web3Service.getPermitDetails(ipfsHash);

        setDetail({
          status: 'Asli, Terverifikasi di Blockchain',
          nft: permitDetails.tokenId,
          // wallet: permitDetails.verifier,
          // izin: permitDetails.permitNumber,
          // jenis: permitDetails.permitType,
          // pemilik: permitDetails.ownerName,
          // tanggal: permitDetails.issueDate,
          // berlaku: permitDetails.expiryDate,
          ipfsHash: ipfsHash
        });
      } catch (err) {
        console.error('Error fetching permit details:', err);
        setError(err.message);
        setDetail({
          status: 'Palsu, Tidak Ada di Blockchain',
          // nft: '–',
          // wallet: '–',
          // izin: state?.code || '–',
          // jenis: '–',
          // pemilik: '–',
          // tanggal: '–',
          // berlaku: '–'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermitDetails();
  }, [state]);

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Memverifikasi di Blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <h2>Detail Perizinan</h2>
      <div className="detail-card">
        <div className={`status ${detail.status.includes('Palsu') ? 'invalid' : 'valid'}`}>
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
        {detail.status.includes('Asli') && (
          <button 
            className="btn btn-secondary"
            onClick={() => window.open(`https://custom-block-explorer.vercel.app/tx/${detail.ipfsHash}`)}
          >
            Lihat di Blockchain Explorer
          </button>
        )}
      </div>
    </div>
  );
}
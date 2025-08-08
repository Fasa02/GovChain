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
        if (!state?.tokenId || !state?.contract || !state?.chainId) {
          throw new Error('QR Code tidak lengkap');
        }

      // Koneksi ke Web3
      const connected = await Web3Service.connectWallet();
      if (!connected) throw new Error('Gagal konek wallet');

      // Ambil detail dari tokenId
      const permitDetails = await Web3Service.getPermitDetailsByTokenId(state.tokenId);

        setDetail({
          status: 'Asli, Terverifikasi di Blockchain',
          nft: state.tokenId,
          // wallet: permitDetails.verifier,
          // izin: permitDetails.permitNumber,
          // jenis: permitDetails.permitType,
          pemilik: permitDetails.owner,
          // tanggal: permitDetails.issueDate,
          // berlaku: permitDetails.expiryDate,
          ipfsHash: permitDetails.ipfsHash,
          txHash: state.txHash,
          meta: permitDetails.metadata
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
        </dl>
        {detail.status.includes('Asli') && (
          <button 
            className="btn btn-secondary"
            onClick={() => window.open(`https://custom-block-explorer.vercel.app/tx/${detail.txHash}`)}
          >
            Lihat di Blockchain Explorer
          </button>
        )}
      </div>
    </div>
  );
}
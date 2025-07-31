import React, { useState, useEffect } from 'react';
import { useNavigate }           from 'react-router-dom';
import { Html5Qrcode }           from 'html5-qrcode';
import './App.css';

export default function ScanQR() {
  const [qrData, setQrData] = useState(null);
  const [mode, setMode]     = useState(null); // null | 'camera'
  const navigate            = useNavigate();

  useEffect(() => {
    if (mode === 'camera') {
      const scanner = new Html5Qrcode('qr-scanner');
      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        decoded => {
          setQrData(decoded);
          scanner.stop();
        },
        () => {}
      ).catch(console.error);
      return () => { scanner.stop().catch(()=>{}); };
    }
  }, [mode]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    Html5Qrcode
      .scanFileV2({ file, qrbox: 250 })
     .then(decoded => setQrData(decoded))
      .catch(() => alert('QR tidak terbaca'));
  };

  return (
    <div className="scan-page">
      <h2>Scan QR</h2>
      <p>Lakukan verifikasi izin usaha dengan mudah.</p>

      {!qrData ? (
        <div className="scan-actions">
          {!mode && (
            <>
              <button className="btn btn-primary" onClick={() => setMode('camera')}>
                Ambil Gambar
              </button>
              <label className="btn btn-secondary">
                Unggah QR
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
            </>
          )}
          {mode === 'camera' && (
            <div id="qr-scanner" style={{ width: 300, margin: '0 auto' }} />
          )}
        </div>
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => navigate('/detail', { state: { code: qrData } })}
        >
          Lanjut
        </button>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import './App.css';

export default function ScanQR() {
  const [qrData, setQrData] = useState(null);
  const [mode, setMode] = useState(null);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    let scanner = null;

    const initializeScanner = async () => {
      if (mode === 'camera') {
        try {
          scanner = new Html5Qrcode('qr-scanner');
          scannerRef.current = scanner;

          await scanner.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 }
            },
            (decodedText, decodedResult) => {
              console.log("📦 Data hasil scan:", decodedText);
              setQrData(decodedText);
              setMode(null);

              try {
                const parsed = JSON.parse(decodedText);
                if (!parsed.tokenId || !parsed.contract || !parsed.chainId) {
                  throw new Error("QR Code tidak lengkap");
                }

                // Navigasi ke halaman detail dengan state dari QR
                navigate("/detail", { state: parsed });
              } catch (err) {
                alert("QR Code tidak valid!");
                console.error(err);
              }
            },
            (error) => {
              // Optional: log error scanning
              // console.warn("Scan error:", error);
            }
          );
        } catch (err) {
          console.error('Error starting scanner:', err);
          setMode(null);
        }
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(err => console.log('Error stopping scanner:', err));
        scannerRef.current = null;
      }
    };
  }, [mode, navigate]);


  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await Html5Qrcode.scanFile(file, true);
      setQrData(result);
    } catch (error) {
      alert('QR tidak terbaca');
      console.error('Error scanning file:', error);
    }
  };

  const handleNavigate = () => {
    if (qrData) {
      try {
        const parsed = JSON.parse(qrData);
        navigate('/detail', {
          state: {
            tokenId: parsed.tokenId,
            contract: parsed.contract,
            chainId: parsed.chainId
          }
        });
      } catch (err) {
        alert("QR Code tidak valid!");
        console.error(err);
      }
    }
  };

  return (
    <div className="scan-page">
      <h2>Scan QR Code</h2>
      <p>Lakukan verifikasi izin dengan mudah.</p>

      <div className="scan-actions">
        {!qrData && !mode && (
          <>
            <button className="button1" onClick={() => setMode('camera')}>
              Ambil Gambar
            </button>
            <label className="button2">
              Unggah QR
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                hidden
              />
            </label>
          </>
        )}

        {mode === 'camera' && (
          <div 
            id="qr-scanner" 
            style={{ 
              width: '300px', 
              height: '300px', 
              margin: '0 auto',
              position: 'relative' 
            }} 
          />
        )}

        {qrData && (
          <div className="scan-result">
            <p>QR Code terdeteksi!</p>
            <button
              className="btn btn-primary"
              onClick={handleNavigate}
            >
              Lihat Detail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
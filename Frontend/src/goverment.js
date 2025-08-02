import React from 'react';
import './App.css';
import ScanQR from './ScanQR';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';


const Hero = () => (
  <section className="Hero">
    <div className="Hero-text">
      <h1> Perizinan UMKM<br/>
    Transparan, Akuntabel<br/>
    Dengan Blockchain</h1>
      <p>Ucapkan selamat tinggal pada keraguan dan proses yang rumit. Dengan GovChain Permit, pastikan keaslian surat izin dari Pemerintah Kota secara instan menggunakan teknologi blockchain yang transparan dan tidak dapat diubah.</p>
      <div className="Hero-buttons">
        <a href="/daftar" className="primary">Buat Izin</a>
        <a href="#dashboard" className="secondary">Dashboard</a>
      </div>
    </div>
    <div className="Hero-image">
      <img src="/images/Illustration.png" alt="Ilustrasi user dengan laptop dan blockchain" />
    </div>
  </section>
);

const Partners = () => (
  <section className="partners" id="partners">
    <div className="container">
      <h2>Didukung Oleh</h2>
      <div className="partners-logos">{[1,2,3,4,5].map(i => <img key={i} src={`/images/logo${i}.png`} alt={`Logo ${i}`} />)}</div>
    </div>
  </section>
);

const FeatureCard = ({ img, title, children }) => (
  <div className="feature-card">
    <img src={img} alt={title} />
    <h3>{title}</h3>
    <p>{children} v  </p>
  </div>
);

const WhyBlockchain = () => (
  <section className="why" id="why-blockchain">
    <div className="container">
      <h2>Mengapa Blockchain?</h2>
      <p>Secara sederhana, bayangkan blockchain sebagai sebuah buku besar digital yang super aman. Teknologi ini adalah fondasi yang membuat setiap verifikasi di GovChain Permit memiliki integritas tertinggi.</p>
      <div className="features">
        <FeatureCard img="/images/silang.png" title="Tidak dapat diubah">Sekali sebuah catatan izin dicatat, ia tidak dapat dihapus atau diubah. Ini menciptakan bukti digital permanen yang mustahil untuk dipalsukan.</FeatureCard>
        <FeatureCard img="/images/desentral.png" title="Teredesentralisasi">Catatan tidak disimpan di satu server pusat, melainkan disebar di banyak titik— membuatnya sangat tahan terhadap kegagalan dan serangan siber.</FeatureCard>
        <FeatureCard img="/images/transparan.png" title="Transparan">Semua pihak yang berwenang dapat melihat dan memverifikasi catatan izin dengan jelas, menciptakan jejak audit yang masuk akal dan meningkatkan akuntabilitas.</FeatureCard>
      </div>
    </div>
  </section>
);

function MethodCard({ img, title, onClick, description, clickable }) {
  return (
    <div
      className={`method-card ${clickable ? 'clickable' : ''}`}
      onClick={clickable ? onClick : undefined}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <img src={img} alt={title} className="mb-4 h-16 w-16 mx-auto" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-3 text-gray-600 text-sm">
          {description}
        </p>
      )}
    </div>
  );
}


function FiturPemerintah() {
  return (
    <section className="for-government">
      <div className="fg-container">
        <span className="fg-label">Untuk Pemerintah</span>
        <h2 className="fg-title">Fitur GovChain Permit</h2>
        <p className="fg-subtitle">
          Modernisasi Tata Kelola Perizinan Anda dengan Fitur yang Andal dan Efisien.
        </p>
        <div className="fg-grid">
          <MethodCard
            img="/images/keamanan.svg"
            title="Keamanan Arsip"
            description="Hilangkan risiko kerentanan atau kehilangan arsip fisik. Setiap izin tercatat secara digital di blockchain, memastikan salinan asli selalu tersedia saat dokumen asli tidak tersedia."
          />
          <MethodCard
            img="/images/masal.svg"
            title="Pencatatan Izin Massal"
            description="Hemat waktu dan minimalkan entri manual. Sistem kami mampu memproses batch izin sekaligus—otomatisasi pencatatan hash digital yang cepat dan akurat."
          />
          <MethodCard
            img="/images/transfer.svg"
            title="Mudah Transfer Kepemilikan Izin"
            description="Optimalisasi seluruh proses pengalihan izin untuk klien, mitra, dan internal instansi. Dengan satu platform, kelola transfer izin serta laporan status dengan mudah."
          />
          <MethodCard
            img="/images/laporan.svg"
            title="Dasbor Analitik & Laporan"
            description="Pantau seluruh aktivitas perizinan real‑time dari dashboard terpadu. Insight lengkap membantu instansi meningkatkan akuntabilitas dan mempercepat pengambilan keputusan."
          />
        </div>
      </div>
    </section>
  );
}

function MulaiMenggunakan() {
  const navigate = useNavigate();
  return (
    <section className="get-started">
      <div className="gs-container">
        <h2 className="gs-title">Mulai Menggunakan GovChain Permit</h2>
        <div className="gs-buttons">
          <button className="gs-primary" onClick={() => navigate('/buat-izin')}>
            Buat Izin
          </button>
          <button className="gs-secondary" onClick={() => navigate('/dashboard')}>
            Menuju Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}


export default function App() {
  return (
    <>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Partners />
                <WhyBlockchain />
                 <FiturPemerintah />
                <MulaiMenggunakan />
              </>
            }
          />
          <Route path="/scan"       element={<ScanQR />} />
        </Routes>
      </main>
    </>
  );
}
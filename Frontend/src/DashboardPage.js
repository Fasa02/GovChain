// DashboardPage.jsx
import React from 'react';
import Sidebar from './Sidebar';
import './App.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h1 className="title">Dashboard</h1>

        <div className="summary-section">
          <div className="card">
            <div className="value">36.6k</div>
            <div className="label">Total Pemohon</div>
          </div>
          <div className="card">
            <div className="value">1.520</div>
            <div className="label">Total Izin Diterbitkan</div>
          </div>
          <div className="card">
            <div className="value">6</div>
            <div className="label">Total Jenis Izin</div>
          </div>
        </div>

        <div className="shortcut-section">
          <button className="shortcut-button orange">Daftarkan Izin ke Blockchain</button>
          <button className="shortcut-button gold">Lihat Semua Izin</button>
        </div>

        <div className="activity-section">
          <h2>Aktivitas On-Chain</h2>
          <div className="activity-placeholder"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;



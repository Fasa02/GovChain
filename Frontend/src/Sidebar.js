// Sidebar.jsx
import React, { useState } from 'react';
import './App.css';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="logo">🌐</div>
      <ul className="menu">
        <li className="active">Dashboard</li>
        <li>Manajemen Izin</li>
        <li>Terbitkan Email Pemohon</li>
        <li>Pengaturan</li>
      </ul>
      <div className="bottom-info">
        <div className="user-box">
          Selamat Datang, <br /> 0xe34...EDA
        </div>
        <button className="disconnect-btn">Disconnect</button>
      </div>
    </div>
  );
};

export default Sidebar;

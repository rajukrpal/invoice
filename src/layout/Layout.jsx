

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../home/Home';
import Invoice from '../invoice/Invoice';
import Setting from '../setteng/Setting';


const Layout = ({ darkMode, toggleDarkMode  }) => {
  return (
    <div className={`App ${darkMode ? 'dark-theme ' : ''}`}>
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/invoices" element={<Invoice darkMode={darkMode} />} />
        <Route path="/settings" element={<Setting darkMode={darkMode} />} />
      </Routes>
    </div>
  );
};

export default Layout;





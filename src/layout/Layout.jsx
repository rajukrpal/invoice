

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../home/Home';
import NavBar from '../navBar/NavBar';

const Layout = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={`App ${darkMode ? 'dark-theme' : ''}`}>
      {/* <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
      </Routes>
    </div>
  );
};

export default Layout;





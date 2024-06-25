

import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArticleIcon from '@mui/icons-material/Article';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const NavBar = () => {
  const [showLogo, setShowLogo] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle visibility of logo and menu on small screens
  const toggleMenu = () => {
    setShowLogo(!showLogo);
    setShowMenu(!showMenu);
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full shadow">
      <div className="container mx-auto flex py-4 w-full justify-between ">
        {/* Logo section */}
        <div className={`w-52  font-medium ${showLogo ? '' : 'hidden'} md:flex `}>
          <Link to={"/"} className="flex items-center">
            <ArticleIcon /> Invoice Generator
          </Link>
        </div>
        
        {/* Menu section */}
        <div className={`flex justify-between md:hidden`}>
          {!isSidebarOpen ? (
            <button onClick={toggleSidebar}><MenuIcon /></button>
          ) : (
            <button onClick={toggleSidebar}><CloseIcon /></button>
          )}
        </div>

        {/* Sidebar section */}
        <div className={`absolute top-0 left-0 h-full bg-white z-10 overflow-y-auto md:hidden ${isSidebarOpen ? 'w-52' : 'w-0'} transition-all duration-300`}>
          <ul className="pt-4 pl-4 ">
            <li><Link to={"/"} onClick={() => { toggleMenu(); toggleSidebar(); }}>Home</Link></li>
            <li><Link to={'invoices'} onClick={() => { toggleMenu(); toggleSidebar(); }}>Invoices</Link></li>
            <li><Link to={'settings'} onClick={() => { toggleMenu(); toggleSidebar(); }}>Settings</Link></li>
          </ul>
        </div>

        {/* Main menu section */}
        <div className={`flex justify-between w-full ${showMenu ? '' : 'hidden'} md:flex`}>
          <ul className="flex gap-5 items-center">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={'invoices'}>Invoices</Link></li>
            <li><Link to={'settings'}>Settings</Link></li>
          </ul>
          <button onClick={toggleMenu}><WbSunnyIcon /> <ArrowDropDownIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;



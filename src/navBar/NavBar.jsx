


import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const NavBar = ({ toggleDarkMode  }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize darkMode state based on localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null && (savedMode === 'true' || savedMode === 'false')) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(false); // Default to light mode if localStorage value is invalid
      localStorage.setItem('darkMode', JSON.stringify(false));
    }
  }, []);

  // Toggle dark mode and update localStorage
  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const toggleMenu = () => {
    setShowLogo(!showLogo);
    setShowMenu(!showMenu);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Apply dark theme to body based on darkMode state
  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <>
    <div className={`p-4 costom-dark-mod-input shadow-lg ${darkMode ? 'dark-theme' : ''}`}>
      <div className="container mx-auto flex py-4 px-4 w-full justify-between">
        {/* Logo section */}
        <div className={`w-52 font-medium ${showLogo ? '' : 'hidden'} md:flex`}>
          <Link to={'/'} className="flex items-center">
            <ArticleIcon /> Invoice Generator
          </Link>
        </div>

        {/* Menu section */}
        <div className={`flex justify-between md:hidden `}>
          {!isSidebarOpen ? (
            <button onClick={toggleSidebar}>
              <MenuIcon />
            </button>
          ) : (
            <button onClick={toggleSidebar}>
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Sidebar section */}
        <div
          className={`absolute top-0 left-0 h-full bg-white z-10 overflow-y-auto md:hidden ${
            isSidebarOpen ? 'w-52 z-20 costom-dark-mod' : 'w-0'
          } transition-all duration-300`}
        >
          <ul className="pt-4 pl-4">
            <li className='py-1'>
              <NavLink
              
                to={'/'}
                onClick={() => {
                  toggleMenu();
                  toggleSidebar();
                }}
                activeClassName="active"
              >
                Home
              </NavLink>
            </li>
            <li className='py-1'>
              <NavLink
                to={'/invoices'}
                onClick={() => {
                  toggleMenu();
                  toggleSidebar();
                }}
                activeClassName="active"
              >
                Invoices
              </NavLink>
            </li>
            <li className='py-1'>
              <NavLink
                to={'/settings'}
                onClick={() => {
                  toggleMenu();
                  toggleSidebar();
                }}
                activeClassName="active"
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Main menu section */}
        <div className={`flex justify-between w-full ${showMenu ? '' : 'hidden'} md:flex`}>
          <ul className="flex gap-5 items-center">
            <li>
              <NavLink
               to={'/'}
               activeClassName="active"
               >Home
               </NavLink>
            </li>
            <li>
              <NavLink
               to={'/invoices'}
               activeClassName="active"
               >Invoices
               </NavLink>
            </li>
            <li>
              <NavLink
               to={'/settings'}
               activeClassName="active"
               >Settings
               </NavLink>
            </li>
          </ul>
          <div>
            <FormGroup>
              <FormControlLabel
                control={<MaterialUISwitch checked={darkMode} onChange={handleDarkModeToggle} />}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NavBar;




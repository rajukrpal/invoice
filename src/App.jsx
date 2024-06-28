

// import React from 'react'
// import { BrowserRouter  ,Routes ,Route } from 'react-router-dom'
// import Home from './home/Home'
// import Testing from './Testing'

// const App = () => {
//   return (
//     <div>
//       <BrowserRouter >
//         <Routes>
//           <Route path='/' element={<Home />} />
//           <Route path='/testing' element={<Testing />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default App









// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import NavBar from '../src/navBar/NavBar';
// import Home from '../src/home/Home';
// import './index.css'; 

// const App = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode); 
//   };

//   return (
//     <Router>
//       <div className={`App ${darkMode ? 'dark-theme' : ''}`}>
//         <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> {/* Pass state and toggle function to NavBar */}
//         <Routes>
//           <Route path="/" element={<Home darkMode={darkMode} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;





import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import Layout from './layout/Layout';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); 
  };

  return (
    <Router>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </Router>
  );
};

export default App;





import React from 'react'
import { BrowserRouter  ,Routes ,Route } from 'react-router-dom'
import Home from './home/Home'
import Testing from './Testing'

const App = () => {
  return (
    <div>
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/testing' element={<Testing />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

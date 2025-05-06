import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Home from './pages/home'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div>
      <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

    </Router>
  )
}

export default App

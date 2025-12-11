import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './routes/HomePage'
import MechanicsPage from './routes/MechanicsPage'
import BuilderPage from './routes/BuilderPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mechanics" element={<MechanicsPage />} />
      {/* Legacy route redirect for backwards compatibility */}
      <Route path="/builder" element={<Navigate to="/mechanics" replace />} />
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

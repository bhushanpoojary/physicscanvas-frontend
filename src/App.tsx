import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './routes/HomePage'
import MechanicsPage from './routes/MechanicsPage'
import RelativityPage from './routes/RelativityPage'
import { QuantumWavePage } from './routes/QuantumWavePage'
import { UncertaintyPage } from './routes/UncertaintyPage'
import { CollisionPage } from './labs/collisions/CollisionPage'
import { ComingSoonPage } from './routes/ComingSoonPage'
import BuilderPage from './routes/BuilderPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mechanics" element={<MechanicsPage />} />
      <Route path="/relativity" element={<RelativityPage />} />
      <Route path="/quantum-wave" element={<QuantumWavePage />} />
      <Route path="/uncertainty" element={<UncertaintyPage />} />
      
      {/* New Classical Mechanics Labs */}
      <Route path="/collisions" element={<CollisionPage />} />
      <Route path="/rotational" element={<ComingSoonPage />} />
      <Route path="/oscillations" element={<ComingSoonPage />} />
      <Route path="/chaos" element={<ComingSoonPage />} />
      <Route path="/orbital" element={<ComingSoonPage />} />
      
      {/* Legacy route redirect for backwards compatibility */}
      <Route path="/builder" element={<Navigate to="/mechanics" replace />} />
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

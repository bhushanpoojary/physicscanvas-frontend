import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import BuilderPage from './routes/BuilderPage'
import './App.css'

// Landing page component
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pc-landing">
      <header className="pc-landing-header">
        <h1 className="pc-landing-title">PhysicsCanvas</h1>
      </header>
      <main className="pc-landing-content">
        <p className="pc-landing-tagline">
          Create interactive physics simulations for your classroom.
        </p>
        <button 
          className="pc-btn pc-btn-primary pc-btn-large"
          onClick={() => navigate('/builder')}
        >
          Open Builder
        </button>
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<BuilderPage />} />
    </Routes>
  )
}

export default App

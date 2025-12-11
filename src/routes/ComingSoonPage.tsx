import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import { LABS } from '../labs/common/types';

export const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Find the lab based on current route
  const currentLab = LABS.find(lab => lab.route === location.pathname);

  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '2rem',
        textAlign: 'center',
        background: '#0a0a0a'
      }}>
        <div style={{
          fontSize: '6rem',
          marginBottom: '1.5rem'
        }}>
          {currentLab?.icon || '🚧'}
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#fff'
        }}>
          {currentLab?.name || 'Lab'} - Coming Soon!
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#bbb',
          maxWidth: '600px',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {currentLab?.description || 'This lab is currently under development.'}
        </p>

        <div style={{
          padding: '1.5rem',
          background: '#1a1a1a',
          border: '2px solid #333',
          borderRadius: '12px',
          maxWidth: '500px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: '#4a90e2' }}>
            🔨 Currently Implementing
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#999', margin: 0 }}>
            We're working hard to bring you this simulation. Check back soon!
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: currentLab?.color || '#4a90e2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${currentLab?.color || '#4a90e2'}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Back to All Labs
        </button>

        {currentLab?.tags && (
          <div style={{
            marginTop: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            maxWidth: '600px'
          }}>
            {currentLab.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: '#222',
                  color: '#888',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #333'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

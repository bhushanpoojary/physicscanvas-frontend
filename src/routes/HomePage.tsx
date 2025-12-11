import React, { useState, useMemo } from 'react';
import LabCard from '../labs/common/LabCard';
import { LABS } from '../labs/common/types';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter labs based on search query
  const filteredLabs = useMemo(() => {
    if (!searchQuery.trim()) {
      return LABS;
    }
    
    const query = searchQuery.toLowerCase();
    return LABS.filter(lab => 
      lab.name.toLowerCase().includes(query) ||
      lab.description.toLowerCase().includes(query) ||
      lab.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="pc-landing">
      <header className="pc-landing-header">
        <h1 className="pc-landing-title">PhysicsCanvas</h1>
      </header>
      <main className="pc-landing-content">
        <p className="pc-landing-tagline">
          Create interactive physics simulations for your classroom.
        </p>
        
        {/* Search Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          padding: '0 1rem'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              position: 'absolute',
              left: '1rem',
              fontSize: '1.2rem',
              color: '#888'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search labs... (e.g., 'quantum', 'collision', 'orbital')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 3rem',
                fontSize: '1rem',
                border: '2px solid #444',
                borderRadius: '12px',
                background: '#1a1a1a',
                color: '#e0e0e0',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1',
                }}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <h2 className="pc-labs-heading">
          {searchQuery ? `Found ${filteredLabs.length} lab${filteredLabs.length !== 1 ? 's' : ''}` : 'Choose Your Physics Lab'}
        </h2>
        
        {filteredLabs.length > 0 ? (
          <div className="pc-labs-grid">
            {filteredLabs.map(lab => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#888'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '1.1rem' }}>No labs found matching "{searchQuery}"</p>
            <p style={{ fontSize: '0.9rem' }}>Try searching for: quantum, collision, orbital, chaos, waves</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;

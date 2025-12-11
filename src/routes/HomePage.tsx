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
        <div className="pc-landing-header-content">
          <h1 className="pc-landing-title">
            <span className="pc-title-icon">⚛️</span>
            PhysicsCanvas
          </h1>
          <p className="pc-landing-subtitle">Interactive Physics Simulations</p>
        </div>
      </header>
      <main className="pc-landing-content">
        <div className="pc-hero-section">
          <h2 className="pc-hero-title">
            Create interactive physics simulations for your classroom
          </h2>
          <p className="pc-hero-description">
            Explore classical mechanics, quantum physics, and relativity with beautiful, 
            interactive visualizations designed for teaching and learning.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="pc-search-wrapper">
          <div className="pc-search-container-home">
            <span className="pc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search labs... (e.g., 'quantum', 'collision', 'orbital')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pc-search-input-home"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="pc-search-clear-home"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="pc-labs-section">
          <h2 className="pc-labs-heading">
            {searchQuery ? (
              <>
                <span className="pc-heading-icon">📊</span>
                Found {filteredLabs.length} lab{filteredLabs.length !== 1 ? 's' : ''}
              </>
            ) : (
              <>
                <span className="pc-heading-icon">🔬</span>
                Choose Your Physics Lab
              </>
            )}
          </h2>
          
          {filteredLabs.length > 0 ? (
            <div className="pc-labs-grid">
              {filteredLabs.map(lab => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          ) : (
            <div className="pc-no-results-home">
              <div className="pc-no-results-icon">🔍</div>
              <h3 className="pc-no-results-title">No labs found</h3>
              <p className="pc-no-results-text">
                No labs found matching "<strong>{searchQuery}</strong>"
              </p>
              <p className="pc-no-results-hint">
                Try searching for: <span>quantum</span>, <span>collision</span>, 
                <span>orbital</span>, <span>chaos</span>, <span>waves</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;

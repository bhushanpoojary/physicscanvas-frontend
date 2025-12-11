import React from 'react';
import LabCard from '../labs/common/LabCard';
import { LABS } from '../labs/common/types';

const HomePage: React.FC = () => {
  return (
    <div className="pc-landing">
      <header className="pc-landing-header">
        <h1 className="pc-landing-title">PhysicsCanvas</h1>
      </header>
      <main className="pc-landing-content">
        <p className="pc-landing-tagline">
          Create interactive physics simulations for your classroom.
        </p>
        <h2 className="pc-labs-heading">Choose Your Physics Lab</h2>
        <div className="pc-labs-grid">
          {LABS.map(lab => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;

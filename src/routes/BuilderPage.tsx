import React from 'react';
import Header from '../components/layout/Header';
import ThreePaneLayout from '../components/layout/ThreePaneLayout';
import { useSimulationController } from '../physics/useSimulationController';

const BuilderPage: React.FC = () => {
  const simulation = useSimulationController({
    width: 900,
    height: 500,
    gravityEnabled: true,
  });

  return (
    <>
      <Header />
      <ThreePaneLayout simulation={simulation} />
    </>
  );
};

export default BuilderPage;

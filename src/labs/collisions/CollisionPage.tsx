import React from 'react';
import Header from '../../components/layout/Header';
import { CollisionCanvas } from './CollisionCanvas';
import { CollisionTools } from './CollisionTools';
import { CollisionProperties } from './CollisionProperties';
import { useCollisionController } from './useCollisionController';

export const CollisionPage: React.FC = () => {
  const controller = useCollisionController();

  return (
    <>
      <Header labName="Collision Lab" />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <CollisionTools
            state={controller.state}
            onTogglePause={controller.togglePause}
            onReset={controller.reset}
            onSetCollisionType={controller.setCollisionType}
            onLoadPreset={controller.loadPreset}
          />
        </aside>
        <main className="pc-canvas">
          <CollisionCanvas
            state={controller.state}
            canvasRef={controller.canvasRef}
            onAddBall={controller.addBall}
            onSelectBall={controller.selectBall}
            selectedBallId={controller.selectedBallId}
          />
        </main>
        <aside className="pc-properties">
          <CollisionProperties
            state={controller.state}
            selectedBallId={controller.selectedBallId}
            onToggleDisplay={controller.toggleDisplay}
            onUpdateBallVelocity={controller.updateBallVelocity}
            onDeleteBall={controller.deleteBall}
          />
        </aside>
      </div>
    </>
  );
};

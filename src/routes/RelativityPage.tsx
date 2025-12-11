import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useRelativityController } from '../labs/relativity/useRelativityController';
import RelativityTools from '../labs/relativity/RelativityTools';
import MinkowskiCanvas from '../labs/relativity/MinkowskiCanvas';
import RelativityProperties from '../labs/relativity/RelativityProperties';
import type { RelativityToolType, ScenePresetId } from '../labs/relativity/types';

const RelativityPage: React.FC = () => {
  const controller = useRelativityController();
  const [currentTool, setCurrentTool] = useState<RelativityToolType | null>(null);
  const [currentPreset, setCurrentPreset] = useState<ScenePresetId>('empty');

  const handleLoadPreset = (presetId: ScenePresetId) => {
    setCurrentPreset(presetId);
    controller.loadPreset(presetId);
    setCurrentTool(null); // Clear tool selection
  };

  const selectedType = controller.state.selection.type;

  // Get properties for selected object
  const observerProperties = selectedType === 'observer' && controller.state.selection.id
    ? controller.getObserverProperties(controller.state.selection.id)
    : null;

  const eventProperties = selectedType === 'event' && controller.state.selection.id
    ? controller.getEventProperties(controller.state.selection.id)
    : null;

  return (
    <>
      <Header labName="Relativity Lab" />
      <div className="pc-builder-layout">
        <aside className="pc-sidebar">
          <RelativityTools
            currentTool={currentTool}
            onSelectTool={setCurrentTool}
            onLoadPreset={handleLoadPreset}
            currentPreset={currentPreset}
          />
        </aside>

        <main className="pc-canvas">
          <div className="pc-canvas-content">
            <div className="pc-canvas-header">
              <h2 className="pc-canvas-title">Minkowski Spacetime Diagram</h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={controller.state.showGrid}
                    onChange={controller.toggleGrid}
                  />
                  Grid
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={controller.state.showLightCone}
                    onChange={controller.toggleLightCone}
                  />
                  Light Cone
                </label>
              </div>
            </div>

            <div className="pc-canvas-workspace">
              <MinkowskiCanvas
                state={controller.state}
                onAddObject={controller.addObject}
                onSelectObject={controller.selectObject}
                currentTool={currentTool}
              />
            </div>

            <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
              <p style={{ margin: 0 }}>
                {currentTool ? (
                  <>Click on the canvas to add a <strong>{currentTool}</strong></>
                ) : (
                  <>Select a tool from the left panel or click on objects to interact</>
                )}
              </p>
            </div>
          </div>
        </main>

        <aside className="pc-properties">
          <RelativityProperties
            selectedType={selectedType}
            observerProperties={observerProperties}
            eventProperties={eventProperties}
            onUpdateObserverVelocity={controller.updateObserverVelocity}
            onUpdateEventCoordinates={controller.updateEventCoordinates}
            onDeleteSelected={controller.deleteSelected}
          />
        </aside>
      </div>
    </>
  );
};

export default RelativityPage;

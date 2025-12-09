import React from 'react';
import SidebarTools from '../builder/SidebarTools';
import CanvasArea from '../builder/CanvasArea';
import PropertiesPanel from '../builder/PropertiesPanel';

const ThreePaneLayout: React.FC = () => {
  return (
    <div className="pc-builder-layout">
      <aside className="pc-sidebar">
        <SidebarTools />
      </aside>
      <main className="pc-canvas">
        <CanvasArea />
      </main>
      <aside className="pc-properties">
        <PropertiesPanel />
      </aside>
    </div>
  );
};

export default ThreePaneLayout;

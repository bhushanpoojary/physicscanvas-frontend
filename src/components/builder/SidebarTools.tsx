import React from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
}

const tools: Tool[] = [
  { id: 'block', name: 'Block (mass)', description: "Use for basic Newton's laws demos." },
  { id: 'spring', name: 'Spring', description: 'Add springs for oscillation simulations.' },
  { id: 'inclined-plane', name: 'Inclined Plane', description: 'Study forces on slopes.' },
  { id: 'pendulum', name: 'Pendulum', description: 'Explore periodic motion.' },
  { id: 'force-arrow', name: 'Force Arrow', description: 'Visualize force vectors.' },
];

const SidebarTools: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, toolId: string) => {
    e.dataTransfer.setData('toolType', toolId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="pc-sidebar-content">
      <h2 className="pc-sidebar-title">Tools</h2>
      <div className="pc-tools-list">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="pc-tool-card"
            draggable
            onDragStart={(e) => handleDragStart(e, tool.id)}
          >
            <div className="pc-tool-name">{tool.name}</div>
            <div className="pc-tool-description">{tool.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarTools;

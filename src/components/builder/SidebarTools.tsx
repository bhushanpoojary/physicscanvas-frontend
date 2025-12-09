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
  const handleToolClick = (toolId: string, toolName: string) => {
    console.log(`Tool clicked: ${toolName} (${toolId})`);
  };

  return (
    <div className="pc-sidebar-content">
      <h2 className="pc-sidebar-title">Tools</h2>
      <div className="pc-tools-list">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="pc-tool-card"
            onClick={() => handleToolClick(tool.id, tool.name)}
          >
            <div className="pc-tool-name">{tool.name}</div>
            <div className="pc-tool-description">{tool.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarTools;

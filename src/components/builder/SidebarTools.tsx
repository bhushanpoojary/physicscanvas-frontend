import React, { useRef } from 'react';

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

// Helper function to draw tool preview
const drawToolPreview = (toolId: string, size: number = 60): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, size, size);

  switch (toolId) {
    case 'block':
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);
      ctx.strokeStyle = '#2c5aa0';
      ctx.lineWidth = 2;
      ctx.strokeRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);
      break;

    case 'spring':
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const springX = size / 2;
      const springTop = size * 0.15;
      const springBottom = size * 0.85;
      const coils = 6;
      const coilWidth = size * 0.15;
      ctx.moveTo(springX, springTop);
      for (let i = 0; i < coils; i++) {
        const y = springTop + (springBottom - springTop) * (i / coils);
        ctx.lineTo(springX + (i % 2 === 0 ? coilWidth : -coilWidth), y);
      }
      ctx.lineTo(springX, springBottom);
      ctx.stroke();
      break;

    case 'inclined-plane':
      ctx.fillStyle = '#95a5a6';
      ctx.beginPath();
      ctx.moveTo(size * 0.1, size * 0.8);
      ctx.lineTo(size * 0.9, size * 0.8);
      ctx.lineTo(size * 0.9, size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7f8c8d';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    case 'pendulum':
      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(size / 2, size * 0.2);
      ctx.lineTo(size / 2, size * 0.6);
      ctx.stroke();
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.arc(size / 2, size * 0.7, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d68910';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;

    case 'force-arrow':
      ctx.strokeStyle = '#27ae60';
      ctx.fillStyle = '#27ae60';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(size * 0.2, size / 2);
      ctx.lineTo(size * 0.7, size / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size * 0.7, size / 2);
      ctx.lineTo(size * 0.6, size * 0.4);
      ctx.lineTo(size * 0.8, size / 2);
      ctx.lineTo(size * 0.6, size * 0.6);
      ctx.closePath();
      ctx.fill();
      break;
  }

  return canvas;
};

const SidebarTools: React.FC = () => {
  const dragImageRef = useRef<HTMLCanvasElement | null>(null);

  const handleDragStart = (e: React.DragEvent, toolId: string) => {
    e.dataTransfer.setData('toolType', toolId);
    e.dataTransfer.effectAllowed = 'copy';

    // Create a larger preview for dragging
    const dragPreview = drawToolPreview(toolId, 80);
    dragImageRef.current = dragPreview;
    
    // Set the drag image to the preview canvas
    e.dataTransfer.setDragImage(dragPreview, 40, 40);
  };

  return (
    <div className="pc-sidebar-content">
      <h2 className="pc-sidebar-title">Tools</h2>
      <div className="pc-tools-list">
        {tools.map((tool) => {
          const iconCanvas = drawToolPreview(tool.id, 40);
          return (
            <div
              key={tool.id}
              className="pc-tool-card"
              draggable
              onDragStart={(e) => handleDragStart(e, tool.id)}
            >
              <div className="pc-tool-card-header">
                <div className="pc-tool-icon">
                  <img 
                    src={iconCanvas.toDataURL()} 
                    alt={tool.name}
                    width={40}
                    height={40}
                    draggable={false}
                  />
                </div>
                <div className="pc-tool-info">
                  <div className="pc-tool-name">{tool.name}</div>
                  <div className="pc-tool-description">{tool.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarTools;

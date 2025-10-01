import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

type Action = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

type Props = {
  actions: Action[];
};

const DraggableFAB: React.FC<Props> = ({ actions }) => {
  const fabRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 16 - 56, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(true);

  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasDragged: false,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!fabRef.current || (e.target as HTMLElement).closest('button') !== fabRef.current?.querySelector('.fab-main-button')) {
        if (!(e.target as HTMLElement).closest('.fab-action-button')) {
            setIsOpen(false);
        }
        return;
    }
    
    e.preventDefault();
    fabRef.current.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    setIsSnapping(false);
    
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      hasDragged: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    if (!dragInfo.current.hasDragged && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      dragInfo.current.hasDragged = true;
      if(isOpen) setIsOpen(false); // Close menu when drag starts
    }

    let newX = dragInfo.current.initialX + dx;
    let newY = dragInfo.current.initialY + dy;

    const fabWidth = fabRef.current?.offsetWidth ?? 64;
    const fabHeight = fabRef.current?.offsetHeight ?? 64;
    newX = Math.max(16, Math.min(newX, window.innerWidth - fabWidth - 16));
    newY = Math.max(16, Math.min(newY, window.innerHeight - fabHeight - 16));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    fabRef.current?.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    setIsSnapping(true);

    if (!dragInfo.current.hasDragged) {
      setIsOpen(prev => !prev);
    } else {
      const fabWidth = fabRef.current?.offsetWidth ?? 64;
      if (position.x + fabWidth / 2 < window.innerWidth / 2) {
        setPosition({ x: 16, y: position.y });
      } else {
        setPosition({ x: window.innerWidth - fabWidth - 16, y: position.y });
      }
    }
  };

  const fabStyle: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isSnapping ? 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none',
  };

  return (
    <div
      ref={fabRef}
      className="fixed top-0 left-0 z-50 select-none touch-none"
      style={fabStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {isOpen && (
        <div className="absolute bottom-full mb-4 flex flex-col items-center gap-4">
          {actions.map((action, index) => (
            <div key={index} className="flex flex-col items-center gap-1 group relative">
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 fab-action-button"
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}
      <button className="w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-indigo-700 transition-transform duration-300 ease-in-out transform active:scale-95 fab-main-button">
        <Plus size={32} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
};

export default DraggableFAB;
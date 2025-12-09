import React from 'react';
import { Bell } from 'lucide-react';

interface RightPanelProps {
  className?: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col h-full pl-4 ${className}`}>
        {/* Header Section of Right Panel */}
        <div className="flex justify-end items-center mb-10 pt-2">
            <button className="p-2 rounded-full hover:bg-theme-card transition relative border border-transparent hover:border-theme-border">
                <Bell size={22} className="text-theme-text-muted hover:text-white" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-theme-accent-solid rounded-full shadow-glow"></span>
            </button>
        </div>
    </div>
  );
};

export default RightPanel;
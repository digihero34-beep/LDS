import React from 'react';

interface ConfidenceMeterProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ level }) => {
  let percentage = 60;
  let color = '#f59e0b';
  let label = 'MED';

  if (level === 'HIGH') {
    percentage = 95;
    color = '#10b981';
    label = 'HIGH';
  } else if (level === 'LOW') {
    percentage = 35;
    color = '#f43f5e';
    label = 'LOW';
  }

  return (
    <div className="flex items-center space-x-2 font-mono text-[11px] text-[#94a3b8]">
      <span className="text-[10px] text-[#64748b]">CONF:</span>
      <div className="w-16 h-1.5 bg-[#263244] rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
};

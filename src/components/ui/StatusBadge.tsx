import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const norm = status.toUpperCase();

  let colorClasses = 'bg-[#1e293b] text-[#94a3b8] border-[#263244]';

  if (norm === 'PASS' || norm === 'STRONG' || norm === 'COMPLETED' || norm === 'IMPROVED') {
    colorClasses = 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30';
  } else if (norm === 'ADEQUATE' || norm === 'WARN' || norm === 'SUBMITTED' || norm === 'EVALUATING') {
    colorClasses = 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30';
  } else if (norm === 'NEEDS_ATTENTION' || norm === 'MEDIUM') {
    colorClasses = 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30';
  } else if (norm === 'FAIL' || norm === 'FAILED' || norm === 'INCOMPLETE' || norm === 'REGRESSED' || norm === 'HARD') {
    colorClasses = 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30';
  } else if (norm === 'DRAFT' || norm === 'EASY') {
    colorClasses = 'bg-[#1e293b] text-[#94a3b8] border-[#263244]';
  }

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${colorClasses} ${sizeClasses} ${className}`}
    >
      {norm}
    </span>
  );
};

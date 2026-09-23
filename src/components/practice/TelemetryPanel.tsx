'use client';

import React from 'react';
import { ClassDesign, Relationship } from '@/domain/submission/types';

interface TelemetryPanelProps {
  classes: ClassDesign[];
  relationships: Relationship[];
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ classes, relationships }) => {
  const totalMethods = classes.reduce((sum, c) => sum + c.methods.length, 0);
  const totalDeps = classes.reduce((sum, c) => sum + c.dependencies.length, 0);
  const interfaces = classes.filter((c) => c.type === 'INTERFACE');
  const abstractClasses = classes.filter((c) => c.type === 'ABSTRACT_CLASS');

  return (
    <div className="border border-[#263244] bg-[#0f141c] rounded p-4 text-xs font-mono space-y-4">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between border-b border-[#263244] pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-[#10b981] animate-pulse">●</span>
          <span className="font-bold text-[#f8fafc] text-xs">STRUCTURAL TELEMETRY &amp; GRAPH</span>
        </div>
        <span className="text-[10px] text-[#64748b]">SYS:LIVE_ANALYSIS</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 rounded bg-[#161e2e] border border-[#263244]">
          <span className="text-[10px] text-[#64748b] block">CLASSES</span>
          <span className="text-sm font-bold text-[#f8fafc] font-tabular">{classes.length}</span>
        </div>
        <div className="p-2.5 rounded bg-[#161e2e] border border-[#263244]">
          <span className="text-[10px] text-[#64748b] block">INTERFACES</span>
          <span className="text-sm font-bold text-[#38bdf8] font-tabular">
            {interfaces.length + abstractClasses.length}
          </span>
        </div>
        <div className="p-2.5 rounded bg-[#161e2e] border border-[#263244]">
          <span className="text-[10px] text-[#64748b] block">METHODS</span>
          <span className="text-sm font-bold text-[#f8fafc] font-tabular">{totalMethods}</span>
        </div>
        <div className="p-2.5 rounded bg-[#161e2e] border border-[#263244]">
          <span className="text-[10px] text-[#64748b] block">DEPENDENCIES</span>
          <span className="text-sm font-bold text-[#f59e0b] font-tabular">{totalDeps}</span>
        </div>
      </div>

      {/* Connectivity Map */}
      <div>
        <div className="text-[10px] text-[#64748b] uppercase mb-1.5 flex items-center justify-between">
          <span>RELATIONSHIP EDGES ({relationships.length})</span>
          <span className="text-[9px] text-[#38bdf8]">// COUPLING GRAPH</span>
        </div>

        {relationships.length === 0 ? (
          <div className="text-center py-3 text-[#64748b] bg-[#161e2e] rounded border border-dashed border-[#263244]">
            No relationships declared yet.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {relationships.map((rel, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-[#161e2e] border border-[#263244] flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[#38bdf8] font-semibold">{rel.fromClass}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e293b] text-[#94a3b8] border border-[#263244]">
                    {rel.type}
                  </span>
                  <span className="text-[#dee2ee] font-semibold">{rel.toClass}</span>
                </div>
                <span className="text-[10px] text-[#64748b] max-w-[200px] truncate" title={rel.rationale}>
                  {rel.rationale}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

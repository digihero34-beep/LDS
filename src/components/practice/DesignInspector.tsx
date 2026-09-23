'use client';

import React from 'react';
import { DesignSignal } from '@/infrastructure/evaluator/DeterministicEvaluator';
import { StatusBadge } from '../ui/StatusBadge';

interface DesignInspectorProps {
  signals: DesignSignal[];
  readinessScore: number;
  totalSignals: number;
  saveStatus: 'SAVED' | 'SAVING' | 'DIRTY';
  lastSavedAt?: Date | null;
  onSaveDraft: () => void;
  onSubmitReview: () => void;
  isSubmitting?: boolean;
}

export const DesignInspector: React.FC<DesignInspectorProps> = ({
  signals,
  readinessScore,
  totalSignals,
  saveStatus,
  lastSavedAt,
  onSaveDraft,
  onSubmitReview,
  isSubmitting = false,
}) => {
  const readinessPercent = totalSignals > 0 ? Math.round((readinessScore / totalSignals) * 100) : 0;

  return (
    <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#263244] bg-[#161e2e]/70 flex flex-col h-full overflow-y-auto">
      {/* Inspector Header */}
      <div className="p-4 border-b border-[#263244] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-[#38bdf8] font-mono text-xs">//</span>
          <h2 className="font-sans font-bold text-sm tracking-tight text-[#f8fafc]">
            DESIGN INSPECTOR
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] border border-[#263244]">
          PRE-CHECK
        </span>
      </div>

      {/* Review Readiness Meter */}
      <div className="p-4 border-b border-[#263244] bg-[#0f141c]/50">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-[#94a3b8]">REVIEW READINESS</span>
          <span className="text-[#f8fafc] font-bold">
            {readinessScore} / {totalSignals} SIGNALS
          </span>
        </div>
        <div className="w-full h-2 bg-[#1e293b] rounded-sm overflow-hidden mb-1.5">
          <div
            className={`h-full rounded-sm transition-all duration-300 ${
              readinessPercent >= 80 ? 'bg-[#10b981]' : readinessPercent >= 50 ? 'bg-[#f59e0b]' : 'bg-[#f43f5e]'
            }`}
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-[#64748b] font-mono">
          Deterministic pre-checks help verify completeness before review.
        </p>
      </div>

      {/* Signals List */}
      <div className="p-4 flex-1 space-y-3">
        <div className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">
          DESIGN SIGNALS
        </div>

        {signals.length === 0 ? (
          <div className="text-xs font-mono text-[#64748b] p-3 text-center border border-dashed border-[#263244] rounded">
            Begin drafting your design to observe signals.
          </div>
        ) : (
          signals.map((sig) => (
            <div
              key={sig.id}
              className="p-2.5 rounded bg-[#1e293b]/40 border border-[#263244] text-xs font-mono flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#dee2ee] flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      sig.status === 'PASS'
                        ? 'bg-[#10b981]'
                        : sig.status === 'WARN'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#f43f5e]'
                    }`}
                  />
                  {sig.label}
                </span>
                <StatusBadge status={sig.status} size="sm" />
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans pl-3">{sig.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Persistence & Action Rail */}
      <div className="p-4 border-t border-[#263244] bg-[#0f141c]/80 space-y-3">
        {/* Autosave Status */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748b] flex items-center gap-2">
            {saveStatus === 'SAVED' ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
            ) : saveStatus === 'SAVING' ? (
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#f59e0b] border-t-transparent animate-spin inline-block" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] opacity-80" />
            )}
            <span
              className={`transition-colors duration-200 ${
                saveStatus === 'SAVED'
                  ? 'text-[#10b981]'
                  : saveStatus === 'SAVING'
                  ? 'text-[#f59e0b]'
                  : 'text-[#94a3b8]'
              }`}
            >
              {saveStatus === 'SAVED'
                ? 'Saved (Live Sync)'
                : saveStatus === 'SAVING'
                ? 'Saving draft...'
                : 'Unsaved changes'}
            </span>
          </span>
          {lastSavedAt && (
            <span className="text-[10px] text-[#64748b]">
              {new Date(lastSavedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="flex-1 py-2 px-3 text-xs font-mono font-medium rounded bg-[#1e293b] hover:bg-[#263348] text-[#f8fafc] border border-[#263244] transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={onSubmitReview}
            disabled={isSubmitting}
            className="flex-1 py-2 px-3 text-xs font-mono font-medium rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Design →'}
          </button>
        </div>
      </div>
    </aside>
  );
};

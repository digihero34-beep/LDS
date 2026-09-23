'use client';

import React from 'react';
import { DeterministicInspectionResult } from '@/infrastructure/evaluator/DeterministicEvaluator';
import { SubmissionPayload } from '@/domain/submission/types';

interface PreFlightModalProps {
  isOpen: boolean;
  problemTitle: string;
  attemptNumber: number;
  payload: SubmissionPayload;
  inspection: DeterministicInspectionResult;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting?: boolean;
}

export const PreFlightModal: React.FC<PreFlightModalProps> = ({
  isOpen,
  problemTitle,
  attemptNumber,
  payload,
  inspection,
  onClose,
  onConfirmSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const hasBlocking = !inspection.isValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl border border-[#303e54] bg-[#161e2e] rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#263244] bg-[#1e293b]/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#38bdf8] font-mono text-sm">//</span>
            <div>
              <h2 className="font-sans font-bold text-base text-[#f8fafc]">
                SUBMISSION PRE-FLIGHT CHECK
              </h2>
              <p className="text-[11px] font-mono text-[#94a3b8]">
                {problemTitle} — Attempt #{attemptNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#f8fafc] text-sm font-mono px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          {/* Evidence Inventory Cards */}
          <div>
            <div className="text-[11px] text-[#64748b] uppercase tracking-wider mb-2">
              EVIDENCE CAPTURED
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded bg-[#0f141c] border border-[#263244]">
                <span className="text-[10px] text-[#64748b] block">REQUIREMENTS</span>
                <span className="text-base font-bold text-[#38bdf8] font-tabular">
                  {payload.requirementsUnderstanding ? '✓ CAPTURED' : '✗ EMPTY'}
                </span>
              </div>
              <div className="p-3 rounded bg-[#0f141c] border border-[#263244]">
                <span className="text-[10px] text-[#64748b] block">CLASSES</span>
                <span className="text-base font-bold text-[#f8fafc] font-tabular">
                  {payload.classes.length} DEFINED
                </span>
              </div>
              <div className="p-3 rounded bg-[#0f141c] border border-[#263244]">
                <span className="text-[10px] text-[#64748b] block">RELATIONSHIPS</span>
                <span className="text-base font-bold text-[#f8fafc] font-tabular">
                  {payload.relationships.length} CONNECTED
                </span>
              </div>
              <div className="p-3 rounded bg-[#0f141c] border border-[#263244]">
                <span className="text-[10px] text-[#64748b] block">TRADE-OFFS</span>
                <span className="text-base font-bold text-[#f8fafc] font-tabular">
                  {payload.designDecisions.length} EXPLAINED
                </span>
              </div>
              <div className="p-3 rounded bg-[#0f141c] border border-[#263244]">
                <span className="text-[10px] text-[#64748b] block">EDGE CASES</span>
                <span className="text-base font-bold text-[#f8fafc] font-tabular">
                  {payload.edgeCases.length} COVERED
                </span>
              </div>
              <div className="p-3 rounded bg-[#0f141c] border border-[#263244]">
                <span className="text-[10px] text-[#64748b] block">ASSUMPTIONS</span>
                <span className="text-base font-bold text-[#f8fafc] font-tabular">
                  {payload.assumptions.length} STATED
                </span>
              </div>
            </div>
          </div>

          {/* Blocking Errors or Warnings */}
          {hasBlocking ? (
            <div className="p-3 rounded bg-[#f43f5e]/10 border border-[#f43f5e]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#f43f5e] font-bold">
                <span>⚠</span> BLOCKING GAPS BEFORE SUBMISSION
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#f43f5e] font-sans">
                {inspection.blockingErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 rounded bg-[#10b981]/10 border border-[#10b981]/30 flex items-center gap-2 text-[#10b981]">
              <span>✓</span>
              <span>All deterministic pre-checks passed. Design is ready for rubric review.</span>
            </div>
          )}

          {/* Warnings List if any */}
          {inspection.signals.some((s) => s.status === 'WARN') && (
            <div className="p-3 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/25 space-y-1">
              <div className="text-[#f59e0b] font-bold">△ NON-BLOCKING OBSERVATIONS</div>
              <ul className="list-disc pl-5 space-y-0.5 text-[#f59e0b] font-sans text-[11px]">
                {inspection.signals
                  .filter((s) => s.status === 'WARN')
                  .map((w, idx) => (
                    <li key={idx}>{w.message}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#263244] bg-[#0f141c] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono rounded bg-[#1e293b] hover:bg-[#263348] text-[#f8fafc] border border-[#263244] transition-colors"
          >
            Keep Editing
          </button>
          <button
            onClick={onConfirmSubmit}
            disabled={hasBlocking || isSubmitting}
            className="px-4 py-2 text-xs font-mono font-bold rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Evaluating Design...' : 'Confirm & Submit for Review →'}
          </button>
        </div>
      </div>
    </div>
  );
};

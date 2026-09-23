'use client';

import React, { useState } from 'react';
import { CriterionFeedback } from '@/domain/evaluation/types';
import { StatusBadge } from './StatusBadge';
import { ConfidenceMeter } from './ConfidenceMeter';

interface EvidenceBlockProps {
  feedback: CriterionFeedback;
  index: number;
}

export const EvidenceBlock: React.FC<EvidenceBlockProps> = ({ feedback, index }) => {
  const [expanded, setExpanded] = useState(true);

  const isAttention = feedback.rating === 'NEEDS_ATTENTION' || feedback.rating === 'INCOMPLETE';
  const accentColor = isAttention ? '#f59e0b' : '#10b981';

  return (
    <div className="border border-[#263244] bg-[#161e2e] rounded hover:border-[#38bdf8]/40 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      {/* Block Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 bg-[#1e293b]/50 hover:bg-[#1e293b]/80 border-b border-[#263244] flex items-center justify-between cursor-pointer select-none transition-colors duration-150"
      >
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs text-[#64748b] w-6">0{index + 1}</span>
          <div className="w-1.5 h-4 rounded-sm transition-transform duration-200 group-hover:scale-y-110" style={{ backgroundColor: accentColor }} />
          <h3 className="font-sans font-semibold text-sm text-[#f8fafc]">{feedback.criterion}</h3>
        </div>

        <div className="flex items-center space-x-4">
          <ConfidenceMeter level={feedback.confidence} />
          <StatusBadge status={feedback.rating} />
          <span className={`text-[#64748b] hover:text-[#38bdf8] text-xs font-mono transition-transform duration-200 inline-block ${expanded ? 'rotate-180' : 'rotate-0'}`}>
            ▼
          </span>
        </div>
      </div>

      {/* Block Body */}
      {expanded && (
        <div className="p-4 space-y-3.5 text-xs font-mono animate-fade-in-up">
          {/* Assessment */}
          <div>
            <div className="text-[10px] text-[#64748b] tracking-wider uppercase mb-1">OBSERVED</div>
            <p className="text-[#dee2ee] font-sans leading-relaxed">{feedback.assessment}</p>
          </div>

          {/* Evidence */}
          <div className="p-2.5 rounded bg-[#0f141c] border border-[#263244] group hover:border-[#38bdf8]/50 transition-colors">
            <div className="text-[10px] text-[#38bdf8] tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <span className="animate-pulse">//</span> SUBMITTED EVIDENCE
            </div>
            <code className="text-[#38bdf8] text-xs break-all font-mono selection:bg-[#38bdf8]/20">{feedback.evidence}</code>
          </div>

          {/* Why It Matters */}
          <div>
            <div className="text-[10px] text-[#64748b] tracking-wider uppercase mb-1">WHY IT MATTERS</div>
            <p className="text-[#94a3b8] font-sans leading-relaxed">{feedback.whyItMatters}</p>
          </div>

          {/* Concern */}
          {feedback.concern && feedback.concern !== 'None observed.' && feedback.concern !== 'None.' && (
            <div className="p-2.5 rounded bg-[#f59e0b]/5 border border-[#f59e0b]/20 hover:border-[#f59e0b]/40 transition-colors">
              <div className="text-[10px] text-[#f59e0b] tracking-wider uppercase mb-1">ARCHITECTURAL CONCERN</div>
              <p className="text-[#f59e0b] font-sans text-xs leading-relaxed">{feedback.concern}</p>
            </div>
          )}

          {/* Suggested Change */}
          <div className="p-2.5 rounded bg-[#10b981]/5 border border-[#10b981]/20 hover:border-[#10b981]/40 transition-colors">
            <div className="text-[10px] text-[#10b981] tracking-wider uppercase mb-1">RECOMMENDED REVISION</div>
            <p className="text-[#10b981] font-sans text-xs leading-relaxed">{feedback.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

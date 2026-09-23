'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AttemptComparisonResult } from '@/application/history/compareAttempts';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function AttemptComparisonPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 font-mono text-xs text-[#94a3b8]">
          Loading attempt comparison...
        </div>
      }
    >
      <ComparisonContent />
    </React.Suspense>
  );
}

function ComparisonContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const [comparison, setComparison] = useState<AttemptComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to) {
      setError("Please specify both 'from' and 'to' attempt parameters in the URL.");
      setLoading(false);
      return;
    }

    fetch(`/api/attempts/compare?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setComparison(json.data);
        else setError(json.error || 'Failed to compare attempts');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [from, to]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 font-mono text-xs text-[#94a3b8]">
        Analyzing structural &amp; evaluation diff between attempts...
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 font-mono text-xs text-[#f43f5e]">
        <div>{error || 'Unable to generate comparison.'}</div>
        <Link href="/" className="text-[#38bdf8] hover:underline">
          ← Return to Dashboard
        </Link>
      </div>
    );
  }

  const { baseAttempt, targetAttempt, classesDiff, criteriaDiff, summary, nextChallenge } = comparison;

  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="border-b border-[#263244] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs text-[#64748b]">
            <Link href="/" className="hover:text-[#94a3b8]">
              WORKBENCH
            </Link>
            <span>/</span>
            <span className="text-[#38bdf8]">REVISION_DIFF_INSPECTOR</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#f8fafc] tracking-tight">
            See what changed.
          </h1>

          <div className="flex items-center space-x-3 text-xs">
            <span className="p-1 px-2 rounded bg-[#1e293b] text-[#dee2ee] border border-[#263244]">
              BASE: Attempt #{baseAttempt.attemptNumber}
            </span>
            <span className="text-[#64748b]">→</span>
            <span className="p-1 px-2 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 font-bold">
              REVISION: Attempt #{targetAttempt.attemptNumber}
            </span>
          </div>
        </div>

        <Link
          href={`/problems/${baseAttempt.problemId}/history`}
          className="px-4 py-2 rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] text-xs border border-[#263244] transition-colors shrink-0"
        >
          View Timeline →
        </Link>
      </div>

      {/* Narrative Diff Summary Banner */}
      <section className="p-4 rounded bg-[#161e2e] border border-[#263244] text-xs font-mono space-y-1">
        <span className="text-[10px] text-[#38bdf8] uppercase block font-bold">// ARCHITECTURAL DELTA</span>
        <p className="text-[#dee2ee] font-sans text-sm leading-relaxed">{summary}</p>
      </section>

      {/* Structural Classes Diff */}
      <section className="space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#263244] pb-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#38bdf8]">//</span>
            <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              Entity &amp; Class Evolution
            </h2>
          </div>
          <span className="text-[#64748b]">{classesDiff.length} ENTITIES ANALYZED</span>
        </div>

        <div className="space-y-3">
          {classesDiff.map((cd, idx) => {
            const isAdded = cd.changeType === 'ADDED';
            const isRemoved = cd.changeType === 'REMOVED';
            const isModified = cd.changeType === 'MODIFIED';

            let tagColor = 'bg-[#1e293b] text-[#94a3b8] border-[#263244]';
            if (isAdded) tagColor = 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30';
            if (isRemoved) tagColor = 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30';
            if (isModified) tagColor = 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30';

            return (
              <div
                key={idx}
                className="p-4 rounded bg-[#161e2e] border border-[#263244] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-sm text-[#f8fafc] font-sans">{cd.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tagColor}`}>
                      {cd.changeType}
                    </span>
                  </div>
                </div>

                {cd.details && (
                  <ul className="space-y-1 font-sans text-xs text-[#dee2ee] pl-2 border-l-2 border-[#263244]">
                    {cd.details.map((detail, dIdx) => (
                      <li key={dIdx} className={detail.startsWith('+') ? 'text-[#10b981]' : detail.startsWith('-') ? 'text-[#f43f5e]' : ''}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Evaluation Rubric Dimension Evolution */}
      <section className="space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#263244] pb-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#10b981]">//</span>
            <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              Evaluation Rubric Evolution
            </h2>
          </div>
          <span className="text-[#64748b]">RATINGS COMPARISON</span>
        </div>

        <div className="space-y-2.5">
          {criteriaDiff.map((crit, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded bg-[#161e2e] border border-[#263244] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-[#f8fafc] font-sans text-sm block">
                  {crit.criterion}
                </span>
                {crit.afterEvidence && (
                  <span className="text-[11px] text-[#64748b] block font-mono">
                    Evidence: {crit.afterEvidence}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#64748b]">BEFORE:</span>
                  <StatusBadge status={crit.beforeRating || 'N/A'} size="sm" />
                </div>
                <span className="text-[#64748b]">→</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#38bdf8]">AFTER:</span>
                  <StatusBadge status={crit.afterRating || 'N/A'} size="sm" />
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                    crit.status === 'IMPROVED'
                      ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                      : crit.status === 'REGRESSED'
                      ? 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30'
                      : 'bg-[#1e293b] text-[#94a3b8] border-[#263244]'
                  }`}
                >
                  {crit.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Design Challenge Callout Banner */}
      <section className="p-6 rounded bg-[#161e2e] border border-[#6366f1]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono shadow-lg">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2 text-[#38bdf8] text-xs font-bold uppercase">
            <span>⚡</span>
            <span>NEXT ARCHITECTURAL CHALLENGE</span>
          </div>
          <p className="text-sm font-sans text-[#f8fafc] leading-relaxed">
            {nextChallenge}
          </p>
        </div>

        <Link
          href={`/problems/${baseAttempt.problemId}`}
          className="px-5 py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs transition-colors shrink-0 shadow-md text-center"
        >
          Try Again →
        </Link>
      </section>
    </div>
  );
}

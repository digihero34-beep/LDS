'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AttemptHistoryItem } from '@/application/history/getAttemptHistory';
import { ProblemSnapshot } from '@/domain/problem/types';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function AttemptHistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [problem, setProblem] = useState<ProblemSnapshot | null>(null);
  const [history, setHistory] = useState<AttemptHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt selection for comparison
  const [selectedAttemptA, setSelectedAttemptA] = useState<string>('');
  const [selectedAttemptB, setSelectedAttemptB] = useState<string>('');

  useEffect(() => {
    // 1. Fetch Problem
    fetch(`/api/problems/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProblem(json.data);
      });

    // 2. Fetch Attempts History
    fetch(`/api/problems/${params.id}/attempts`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setHistory(json.data);
          if (json.data.length >= 2) {
            setSelectedAttemptA(json.data[1].attempt.id);
            setSelectedAttemptB(json.data[0].attempt.id);
          } else if (json.data.length === 1) {
            setSelectedAttemptA(json.data[0].attempt.id);
          }
        } else {
          setError(json.error || 'Failed to load history');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleStartAttempt = async () => {
    if (!problem) return;
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to create attempt');
      router.push(`/practice/${json.data.attempt.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error starting attempt');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 font-mono text-xs text-[#94a3b8]">
        Loading engineering revision timeline...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="border-b border-[#263244] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#64748b]">
            <Link href={`/problems/${problem?.slug || ''}`} className="hover:text-[#94a3b8]">
              {problem?.title || 'Problem'}
            </Link>
            <span>/</span>
            <span className="text-[#38bdf8]">REVISION_TIMELINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#f8fafc] tracking-tight">
            Attempt History Timeline
          </h1>

          <p className="text-xs sm:text-sm text-[#94a3b8] font-sans max-w-2xl">
            Engineering progression: see how responsibility boundaries, pricing extraction, and edge-case
            coverage improved across iterative practice sessions.
          </p>
        </div>

        <button
          onClick={handleStartAttempt}
          className="px-5 py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-mono font-bold text-xs transition-colors shrink-0 shadow-md"
        >
          + Start New Attempt
        </button>
      </div>

      {/* Comparison Selector Rail (if 2+ attempts exist) */}
      {history.length >= 2 && (
        <section className="p-4 rounded bg-[#161e2e] border border-[#263244] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#38bdf8] font-bold">// COMPARE REVISIONS:</span>
            <select
              value={selectedAttemptA}
              onChange={(e) => setSelectedAttemptA(e.target.value)}
              className="h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#dee2ee]"
            >
              {history.map((h) => (
                <option key={h.attempt.id} value={h.attempt.id}>
                  Attempt #{h.attempt.attemptNumber} ({new Date(h.attempt.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
            <span className="text-[#64748b]">vs</span>
            <select
              value={selectedAttemptB}
              onChange={(e) => setSelectedAttemptB(e.target.value)}
              className="h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#dee2ee]"
            >
              {history.map((h) => (
                <option key={h.attempt.id} value={h.attempt.id}>
                  Attempt #{h.attempt.attemptNumber} ({new Date(h.attempt.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/attempts/compare?from=${selectedAttemptA}&to=${selectedAttemptB}`}
            className="px-4 py-2 rounded bg-[#38bdf8] hover:bg-[#00a6e0] text-[#00354a] font-bold text-center transition-colors"
          >
            Launch Diff Inspector →
          </Link>
        </section>
      )}

      {/* History Timeline */}
      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#263244] rounded bg-[#161e2e]/50 font-mono text-xs text-[#64748b]">
            No previous attempts recorded for this problem yet. Your first submission will establish the baseline.
          </div>
        ) : (
          history.map((item, idx) => {
            const isLatest = idx === 0;
            return (
              <div
                key={item.attempt.id}
                className={`p-5 rounded border ${
                  isLatest ? 'border-[#38bdf8]/50 bg-[#161e2e]' : 'border-[#263244] bg-[#161e2e]/70'
                } space-y-4 font-mono transition-colors`}
              >
                {/* Timeline Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#263244] pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-[#f8fafc] font-sans">
                      ATTEMPT #{item.attempt.attemptNumber}
                    </span>
                    <StatusBadge status={item.attempt.status} />
                    {isLatest && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                        LATEST REVISION
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-[#64748b]">
                    {new Date(item.attempt.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Major Improvement & Concern */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#0f141c] border border-[#263244] space-y-1">
                    <span className="text-[10px] text-[#10b981] font-bold uppercase block">
                      ✓ MAJOR IMPROVEMENT
                    </span>
                    <p className="text-[#dee2ee] font-sans text-xs">
                      {item.majorImprovement || 'Established initial domain object structure.'}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#0f141c] border border-[#263244] space-y-1">
                    <span className="text-[10px] text-[#f59e0b] font-bold uppercase block">
                      △ REMAINING CONCERN
                    </span>
                    <p className="text-[#94a3b8] font-sans text-xs">
                      {item.remainingConcern || 'Continue refining concurrency and extensibility.'}
                    </p>
                  </div>
                </div>

                {/* Evidence Metrics */}
                {item.submission && (
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#94a3b8] pt-1">
                    <span>
                      Classes:{' '}
                      <strong className="text-[#f8fafc]">{item.submission.classes.length}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Relationships:{' '}
                      <strong className="text-[#f8fafc]">
                        {item.submission.relationships.length}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Trade-offs:{' '}
                      <strong className="text-[#f8fafc]">
                        {item.submission.designDecisions.length}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Edge cases:{' '}
                      <strong className="text-[#f8fafc]">
                        {item.submission.edgeCases.length}
                      </strong>
                    </span>
                  </div>
                )}

                {/* Card Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                  {item.attempt.status === 'COMPLETED' ? (
                    <Link
                      href={`/attempts/${item.attempt.id}/evaluation`}
                      className="px-3.5 py-1.5 rounded bg-[#1e293b] hover:bg-[#263348] text-[#38bdf8] border border-[#263244] transition-colors"
                    >
                      View Full Review →
                    </Link>
                  ) : (
                    <Link
                      href={`/practice/${item.attempt.id}`}
                      className="px-3.5 py-1.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors"
                    >
                      Resume Draft →
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AttemptSnapshot } from '@/domain/attempt/Attempt';
import { EvaluationSnapshot } from '@/domain/evaluation/types';
import { ProblemSnapshot } from '@/domain/problem/types';
import { SubmissionSnapshot } from '@/domain/submission/types';
import { EvidenceBlock } from '@/components/ui/EvidenceBlock';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function EvaluationPage({ params }: { params: { attemptId: string } }) {
  const router = useRouter();

  const [attempt, setAttempt] = useState<AttemptSnapshot | null>(null);
  const [problem, setProblem] = useState<ProblemSnapshot | null>(null);
  const [submission, setSubmission] = useState<SubmissionSnapshot | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttemptData = () => {
    setLoading(true);
    fetch(`/api/attempts/${params.attemptId}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`Failed to load attempt (${res.status})`);
        }
      })
      .then(async (json) => {
        if (!json.success) throw new Error(json.error || 'Failed to load attempt');
        const att: AttemptSnapshot = json.data.attempt;
        setAttempt(att);
        setSubmission(json.data.submission);
        setEvaluation(json.data.evaluation);

        // Fetch problem
        const probRes = await fetch(`/api/problems/${att.problemId}`);
        if (probRes.ok) {
          const probJson = await probRes.json().catch(() => null);
          if (probJson?.success) setProblem(probJson.data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttemptData();
  }, [params.attemptId]);

  // Handle Retry Evaluation for FAILED attempts (Screen 3)
  const handleRetryEvaluation = async () => {
    setRetrying(true);
    setError(null);

    try {
      const res = await fetch(`/api/attempts/${params.attemptId}/evaluation/retry`, {
        method: 'POST',
      });
      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Server returned status ${res.status}`);
      }
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Retry failed');
      }
      setEvaluation(json.data);
      // Refresh full attempt status
      fetchAttemptData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  // Handle "Create Improved Attempt" CTA
  const handleCreateImprovedAttempt = async () => {
    if (!problem) return;
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to create new attempt');
      router.push(`/practice/${json.data.attempt.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create attempt');
    }
  };

  const [evalStep, setEvalStep] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setEvalStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(timer);
  }, [loading]);

  if (loading) {
    const steps = [
      { id: '01', title: 'Validating UML class graph & relationship integrity' },
      { id: '02', title: 'Inspecting Single Responsibility & interface boundaries' },
      { id: '03', title: 'Stress-testing concurrency, race conditions & edge cases' },
      { id: '04', title: 'Synthesizing evidence-backed refactor suggestions' },
    ];

    return (
      <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative overflow-hidden border border-[#263244] bg-[#161e2e]/90 rounded-lg p-6 max-w-xl w-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {/* Laser Scanline Beam */}
          <div className="animate-scanline" />

          {/* Scanner Header */}
          <div className="flex items-center justify-between border-b border-[#263244] pb-3 mb-5">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
              </span>
              <span className="text-[#38bdf8] font-mono text-xs font-bold tracking-wider">
                // AST EVALUATION IN PROGRESS
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#64748b] bg-[#0f141c] px-2 py-0.5 rounded border border-[#263244]">
              STAGE {evalStep + 1} OF 4
            </span>
          </div>

          {/* Evaluation Step Ticker */}
          <div className="space-y-3 font-mono text-xs">
            {steps.map((step, idx) => {
              const isCompleted = idx < evalStep;
              const isCurrent = idx === evalStep;

              return (
                <div
                  key={step.id}
                  className={`flex items-start space-x-3 p-2.5 rounded transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#1e293b] border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                      : isCompleted
                      ? 'bg-[#0f141c]/40 border border-[#263244]/50'
                      : 'opacity-40 border border-transparent'
                  }`}
                >
                  <span
                    className={`text-xs font-bold shrink-0 ${
                      isCompleted
                        ? 'text-[#10b981]'
                        : isCurrent
                        ? 'text-[#38bdf8] animate-pulse'
                        : 'text-[#64748b]'
                    }`}
                  >
                    {isCompleted ? '✓' : isCurrent ? '▶' : '○'}
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <span
                      className={`${
                        isCurrent
                          ? 'text-[#f8fafc] font-semibold'
                          : isCompleted
                          ? 'text-[#94a3b8]'
                          : 'text-[#64748b]'
                      }`}
                    >
                      [{step.id}] {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-[#38bdf8] uppercase tracking-wider animate-pulse ml-2">
                        ANALYZING...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal Footer */}
          <div className="mt-5 pt-3 border-t border-[#263244] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span>EVALUATING ARCHITECTURAL SOUNDNESS</span>
              <span className="animate-cursor-blink text-[#38bdf8] font-bold">_</span>
            </span>
            <span>GROQ + AST ENGINE</span>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: EVALUATION FAILURE RESILIENCE STATE
  if (attempt?.status === 'FAILED' || evaluation?.status === 'FAILED') {
    return (
      <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex flex-col justify-center space-y-6">
        <div className="border border-[#f43f5e]/40 bg-[#161e2e] rounded-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 text-[#f43f5e]">
            <span className="text-2xl font-mono">⚠</span>
            <div>
              <h1 className="font-sans font-bold text-xl text-[#f8fafc]">
                Evaluation Could Not Be Completed
              </h1>
              <p className="text-xs font-mono text-[#94a3b8]">
                {problem?.title} — Attempt #{attempt?.attemptNumber}
              </p>
            </div>
          </div>

          {/* Reassurance Message */}
          <div className="p-4 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-xs font-mono text-[#10b981] space-y-1">
            <span className="font-bold block">✓ YOUR DESIGN WAS SAVED SAFELY</span>
            <p className="text-[#dee2ee] font-sans">
              Your submitted classes, relationships, and trade-offs are durably persisted in the database.
              A temporary issue occurred with the evaluator engine, but no learner work has been lost.
            </p>
          </div>

          {/* State Timeline */}
          <div>
            <span className="text-[10px] font-mono text-[#64748b] uppercase block mb-2">
              LIFECYCLE RESILIENCE TRACE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0f141c] border border-[#10b981]/40 text-[#10b981]">
                <span className="block text-[10px]">STAGE 01</span>
                <span>Submitted ✓</span>
              </div>
              <div className="p-2.5 rounded bg-[#0f141c] border border-[#10b981]/40 text-[#10b981]">
                <span className="block text-[10px]">STAGE 02</span>
                <span>Saved to DB ✓</span>
              </div>
              <div className="p-2.5 rounded bg-[#0f141c] border border-[#f43f5e]/40 text-[#f43f5e]">
                <span className="block text-[10px]">STAGE 03</span>
                <span>Evaluating ✕</span>
              </div>
              <div className="p-2.5 rounded bg-[#0f141c] border border-[#38bdf8]/40 text-[#38bdf8]">
                <span className="block text-[10px]">STAGE 04</span>
                <span>Retry Ready ↺</span>
              </div>
            </div>
          </div>

          {evaluation?.failureReason && (
            <div className="p-3 rounded bg-[#0f141c] border border-[#263244] text-xs font-mono text-[#f43f5e]">
              <span className="text-[10px] text-[#64748b] block mb-1">FAILURE DETAIL:</span>
              {evaluation.failureReason}
            </div>
          )}

          {error && (
            <div className="text-xs font-mono text-[#f43f5e]">
              Error: {error}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={handleRetryEvaluation}
              disabled={retrying}
              className="px-5 py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors disabled:opacity-50"
            >
              {retrying ? 'Retrying Evaluation...' : 'Retry Evaluation ↺'}
            </button>
            <Link
              href={`/practice/${params.attemptId}`}
              className="px-4 py-2.5 rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] border border-[#263244] transition-colors"
            >
              Return to Practice Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 9: EVALUATION & EXPLAINABLE FEEDBACK
  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="border-b border-[#263244] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-[#38bdf8] font-bold">// DESIGN REVIEW</span>
            <span className="text-[#64748b]">|</span>
            <span className="text-[#94a3b8]">{problem?.title}</span>
            <span className="text-[#64748b]">|</span>
            <span className="text-[#dee2ee]">ATTEMPT #{attempt?.attemptNumber}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#f8fafc] tracking-tight">
            Architectural Evaluation &amp; Evidence
          </h1>

          <p className="text-xs sm:text-sm text-[#94a3b8] font-sans max-w-2xl">
            Objective evaluation based on submitted evidence. Ratings reflect modularity, single-responsibility
            boundaries, coupling, and extensibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
          <Link
            href={`/problems/${problem?.id}/history`}
            className="px-3.5 py-2 rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] border border-[#263244] transition-colors"
          >
            History Timeline
          </Link>
          <button
            onClick={handleCreateImprovedAttempt}
            className="px-4 py-2 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors shadow-md"
          >
            Create Improved Attempt →
          </button>
        </div>
      </div>

      {/* FEEDBACK SUMMARY: Strengths & Next Priority Changes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <section className="p-5 rounded bg-[#161e2e] border border-[#263244] space-y-3">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#10b981]">
            <span>✓</span>
            <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              What You Did Well
            </h2>
          </div>

          <ul className="space-y-2 text-xs font-sans text-[#dee2ee]">
            {evaluation?.strengths && evaluation.strengths.length > 0 ? (
              evaluation.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#10b981] font-mono">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-[#64748b] font-mono">Initial domain structure captured.</li>
            )}
          </ul>
        </section>

        {/* Priority Improvements */}
        <section className="p-5 rounded bg-[#161e2e] border border-[#263244] space-y-3">
          <div className="flex items-center space-x-2 font-mono text-xs text-[#f59e0b]">
            <span>△</span>
            <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              Priority Next Changes
            </h2>
          </div>

          <ul className="space-y-2 text-xs font-sans text-[#f8fafc]">
            {evaluation?.priorityImprovements && evaluation.priorityImprovements.length > 0 ? (
              evaluation.priorityImprovements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#f59e0b] font-mono">{idx + 1}.</span>
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-[#64748b] font-mono">No major blockers identified.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Criterion-Level Status Dashboard Row */}
      <section className="p-4 rounded bg-[#161e2e] border border-[#263244] space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748b] uppercase tracking-wider">
            RUBRIC DIMENSION BREAKDOWN (VERSION: {evaluation?.rubricVersion})
          </span>
          <span className="text-[#38bdf8] text-[11px]">
            EVALUATOR: {evaluation?.evaluatorType}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {evaluation?.criteria.map((c) => (
            <div
              key={c.id}
              className="p-2.5 rounded bg-[#0f141c] border border-[#263244] flex flex-col justify-between space-y-1"
            >
              <span className="text-[11px] text-[#94a3b8] font-sans truncate" title={c.criterion}>
                {c.criterion}
              </span>
              <StatusBadge status={c.rating} size="sm" />
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Evidence Blocks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[#38bdf8] text-xs">//</span>
            <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              Evidence-Based Feedback Details
            </h2>
          </div>
          <span className="text-xs text-[#64748b]">
            {evaluation?.criteria.length} CRITERIA EVALUATED
          </span>
        </div>

        <div className="space-y-4">
          {evaluation?.criteria.map((crit, idx) => (
            <EvidenceBlock key={crit.id} feedback={crit} index={idx} />
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="p-6 rounded bg-[#161e2e] border border-[#263244] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <h3 className="font-sans font-bold text-base text-[#f8fafc]">
            Ready to iterate on this design?
          </h3>
          <p className="text-xs text-[#94a3b8] font-sans mt-0.5">
            Refactor responsibility boundaries and address the suggested changes in Attempt #
            {(attempt?.attemptNumber || 1) + 1}.
          </p>
        </div>

        <button
          onClick={handleCreateImprovedAttempt}
          className="px-6 py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs transition-colors shrink-0 shadow-md"
        >
          Create Improved Attempt →
        </button>
      </div>
    </div>
  );
}

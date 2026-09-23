'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProblemSnapshot } from '@/domain/problem/types';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [problem, setProblem] = useState<ProblemSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/problems/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProblem(json.data);
        else setError(json.error || 'Problem not found');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleStartPractice = async () => {
    if (!problem) return;
    setStarting(true);
    setError(null);

    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id }),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || 'Failed to initialize attempt');
      }

      router.push(`/practice/${json.data.attempt.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error starting practice');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 font-mono text-xs text-[#94a3b8]">
        Loading architectural specification...
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 font-mono text-xs text-[#f43f5e]">
        <div>{error || 'Problem specification could not be found.'}</div>
        <Link href="/problems" className="text-[#38bdf8] hover:underline">
          ← Back to Problem Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-mono text-[#64748b]">
        <Link href="/problems" className="hover:text-[#94a3b8] transition-colors">
          PROBLEMS
        </Link>
        <span>/</span>
        <span className="text-[#38bdf8]">{problem.slug.toUpperCase()}</span>
      </div>

      {/* Header & Primary CTA */}
      <div className="border-b border-[#263244] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <StatusBadge status={problem.difficulty} />
            <span className="text-[#94a3b8] px-2 py-0.5 rounded bg-[#161e2e] border border-[#263244]">
              ⏱ {problem.estimatedMinutes} MIN ALLOCATED
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#f8fafc] tracking-tight">
            {problem.title}
          </h1>

          <p className="text-sm text-[#dee2ee] font-sans leading-relaxed">
            {problem.summary}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 font-mono text-xs shrink-0">
          <Link
            href={`/problems/${problem.id}/history`}
            className="px-4 py-2.5 rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] border border-[#263244] transition-colors text-center"
          >
            Attempt History
          </Link>
          <button
            onClick={handleStartPractice}
            disabled={starting}
            className="px-6 py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors shadow-md disabled:opacity-50 text-center"
          >
            {starting ? 'Initializing Attempt...' : 'Start Practice →'}
          </button>
        </div>
      </div>

      {/* Specification Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Requirements & Constraints */}
        <div className="lg:col-span-2 space-y-6">
          {/* Functional Requirements */}
          <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#263244] pb-2 font-mono text-xs text-[#38bdf8]">
              <span>//</span>
              <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
                Problem Requirements
              </h2>
            </div>

            <div className="space-y-3">
              {problem.requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded bg-[#0f141c] border border-[#263244] text-xs font-mono flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#38bdf8] block">[{req.category}]</span>
                    <p className="text-[#dee2ee] font-sans text-xs leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      req.priority === 'MUST_HAVE'
                        ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                        : 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30'
                    }`}
                  >
                    {req.priority}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Architectural Constraints */}
          <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#263244] pb-2 font-mono text-xs text-[#f59e0b]">
              <span>//</span>
              <h2 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
                Architectural Constraints
              </h2>
            </div>

            <div className="space-y-2.5">
              {problem.constraints.map((con) => (
                <div
                  key={con.id}
                  className="p-3 rounded bg-[#0f141c] border border-[#263244] text-xs font-mono space-y-1"
                >
                  <span className="text-[10px] text-[#f59e0b] font-bold">TYPE: {con.type}</span>
                  <p className="text-[#94a3b8] font-sans text-xs leading-relaxed">
                    {con.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Rubric & Design Evidence Expectations */}
        <div className="space-y-6">
          <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4 text-xs font-mono">
            <div className="flex items-center space-x-2 border-b border-[#263244] pb-2 text-[#10b981]">
              <span>//</span>
              <h3 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
                Expected Design Evidence
              </h3>
            </div>

            <p className="text-[#94a3b8] font-sans text-xs leading-relaxed">
              In your structured design sheet, demonstrate competence across the following dimensions:
            </p>

            <ul className="space-y-2.5 text-[#dee2ee]">
              <li className="flex items-start gap-2">
                <span className="text-[#10b981]">✓</span>
                <div>
                  <strong className="text-white block font-sans">Responsibility Boundaries</strong>
                  <span className="text-[11px] text-[#64748b]">Avoid God objects; single responsibility per class.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981]">✓</span>
                <div>
                  <strong className="text-white block font-sans">Coupling &amp; DIP</strong>
                  <span className="text-[11px] text-[#64748b]">Program to interfaces rather than concrete types.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981]">✓</span>
                <div>
                  <strong className="text-white block font-sans">Extensibility &amp; OCP</strong>
                  <span className="text-[11px] text-[#64748b]">Support future variants without modifying coordinator code.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#10b981]">✓</span>
                <div>
                  <strong className="text-white block font-sans">Edge Cases &amp; Concurrency</strong>
                  <span className="text-[11px] text-[#64748b]">Detail race conditions and recovery behaviors.</span>
                </div>
              </li>
            </ul>

            <div className="border-t border-[#263244] pt-4">
              <button
                onClick={handleStartPractice}
                disabled={starting}
                className="w-full py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors shadow-md disabled:opacity-50"
              >
                {starting ? 'Initializing Attempt...' : 'Start Practice Workspace →'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

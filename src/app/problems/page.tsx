'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProblemSnapshot } from '@/domain/problem/types';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function ProblemLibraryPage() {
  const [problems, setProblems] = useState<ProblemSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

  useEffect(() => {
    fetch('/api/problems')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProblems(json.data);
      })
      .catch((err) => console.error('Failed to load problems:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDifficulty =
      difficultyFilter === 'ALL' || p.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="border-b border-[#263244] pb-6 space-y-2">
        <div className="text-[11px] font-mono text-[#38bdf8] uppercase tracking-wider flex items-center gap-2">
          <span>//</span> ARCHITECT SPECIFICATION DIRECTORY
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#f8fafc] tracking-tight">
          Choose something to design.
        </h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] font-sans max-w-2xl">
          Turn functional requirements and scale constraints into clear objects, single responsibilities,
          polymorphic interfaces, and documented trade-offs.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems, skills, patterns..."
            className="w-full h-9 px-3 pl-8 rounded bg-[#161e2e] border border-[#263244] text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
          />
          <span className="absolute left-2.5 top-2.5 text-[#64748b]">⌕</span>
        </div>

        {/* Difficulty Filters */}
        <div className="flex items-center space-x-1 p-1 rounded bg-[#161e2e] border border-[#263244]">
          {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                difficultyFilter === diff
                  ? 'bg-[#6366f1] text-white font-bold'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded bg-[#161e2e]/50 border border-[#263244] animate-pulse" />
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#263244] rounded bg-[#161e2e]/40 font-mono text-xs text-[#64748b]">
          No problems matched your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className="border border-[#263244] bg-[#161e2e] rounded hover:border-[#38bdf8]/50 transition-colors p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <StatusBadge status={prob.difficulty} />
                    <span className="text-[#94a3b8] px-2 py-0.5 rounded bg-[#0f141c] border border-[#263244]">
                      ⏱ {prob.estimatedMinutes} MIN
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#64748b]">
                    SPEC_ID: {prob.slug.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-lg font-bold font-sans text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors">
                  {prob.title}
                </h2>

                <p className="text-xs text-[#94a3b8] font-sans leading-relaxed line-clamp-3">
                  {prob.summary}
                </p>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prob.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0f141c] text-[#94a3b8] border border-[#263244]"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-[#263244] flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/problems/${prob.id}/history`}
                  className="text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
                >
                  Revision History →
                </Link>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/problems/${prob.slug}`}
                    className="px-3 py-1.5 rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] border border-[#263244] transition-colors"
                  >
                    View Brief
                  </Link>
                  <Link
                    href={`/problems/${prob.slug}`}
                    className="px-3.5 py-1.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors"
                  >
                    Start Practice →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

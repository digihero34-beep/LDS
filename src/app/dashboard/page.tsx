import Link from 'next/link';
import { getProblemsUseCase } from '@/infrastructure/services';
import { prisma } from '@/infrastructure/db/prisma';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const problems = await getProblemsUseCase.execute();
  const recommendedProblem = problems.find((p) => p.slug === 'parking-lot') || problems[0];

  // Fetch recent attempts with their evaluation summaries
  const recentAttempts = await prisma.attempt.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      problem: true,
      evaluations: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#263244] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono text-[#38bdf8] uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            ENGINEERING WORKBENCH // COGNITIVE LLD PRACTICE
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[#f8fafc] tracking-tight">
            Continue your next design.
          </h1>
          <p className="text-xs sm:text-sm text-[#94a3b8] font-sans mt-1 max-w-2xl">
            LLD is not about finding the one correct class diagram. It is about understanding requirements,
            making architectural decisions, explaining trade-offs, and improving through repeated practice.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <Link
            href="/problems"
            className="px-3.5 py-2 rounded bg-[#1e293b] hover:bg-[#263348] text-[#f8fafc] border border-[#263244] transition-colors"
          >
            Problem Library ({problems.length})
          </Link>
          <Link
            href="/problems/parking-lot"
            className="px-3.5 py-2 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors shadow-sm"
          >
            Start Practice →
          </Link>
        </div>
      </div>

      {/* Hero Recommended Problem Card */}
      {recommendedProblem && (
        <section className="border border-[#263244] bg-[#161e2e] rounded-md p-6 sm:p-8 relative overflow-hidden group hover:border-[#38bdf8]/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-[#64748b]">
            RECOMMENDED_SPEC // 01
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <StatusBadge status={recommendedProblem.difficulty} />
              <span className="text-[#94a3b8] px-2 py-0.5 rounded bg-[#0f141c] border border-[#263244]">
                ⏱ {recommendedProblem.estimatedMinutes} MIN
              </span>
              <span className="text-[#38bdf8] px-2 py-0.5 rounded bg-[#0f141c] border border-[#263244]">
                OBJECT-ORIENTED DESIGN
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#f8fafc] tracking-tight">
              {recommendedProblem.title}
            </h2>

            <p className="text-sm text-[#dee2ee] font-sans leading-relaxed">
              {recommendedProblem.summary}
            </p>

            {/* Skills & Evaluation Dimensions */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {recommendedProblem.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#0f141c] text-[#94a3b8] border border-[#263244]"
                >
                  #{skill}
                </span>
              ))}
            </div>

            {/* Action Triggers */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href={`/problems/${recommendedProblem.slug}`}
                className="px-5 py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-mono font-bold text-xs tracking-wider transition-colors shadow-md"
              >
                START PRACTICE →
              </Link>
              <Link
                href={`/problems/${recommendedProblem.id}/history`}
                className="px-4 py-2.5 rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] font-mono text-xs border border-[#263244] transition-colors"
              >
                Inspect Revision History
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Two-Column Grid: Recent Attempt Records & Practice Momentum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Design Work */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#263244] pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-[#38bdf8] font-mono text-xs">//</span>
              <h3 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
                Recent Design Records
              </h3>
            </div>
            <Link
              href="/problems"
              className="text-xs font-mono text-[#38bdf8] hover:underline"
            >
              View All Problems →
            </Link>
          </div>

          <div className="space-y-3">
            {recentAttempts.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#263244] rounded bg-[#161e2e]/50 font-mono text-xs text-[#64748b]">
                No design attempts yet. Your first design becomes the baseline for improvement.
              </div>
            ) : (
              recentAttempts.map((att) => {
                const latestEval = att.evaluations[0];
                return (
                  <div
                    key={att.id}
                    className="p-4 rounded border border-[#263244] bg-[#161e2e] hover:border-[#38bdf8]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-bold text-[#f8fafc] text-sm font-sans">
                          {att.problem.title}
                        </span>
                        <span className="text-[#94a3b8] px-1.5 py-0.5 rounded bg-[#0f141c] border border-[#263244]">
                          ATTEMPT #{att.attemptNumber}
                        </span>
                        <StatusBadge status={att.status} />
                      </div>
                      {latestEval?.summary && (
                        <p className="text-[11px] text-[#94a3b8] font-sans line-clamp-1">
                          {latestEval.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {att.status === 'COMPLETED' ? (
                        <Link
                          href={`/attempts/${att.id}/evaluation`}
                          className="px-3 py-1.5 rounded bg-[#1e293b] hover:bg-[#263348] text-[#38bdf8] border border-[#263244] transition-colors"
                        >
                          Review Feedback
                        </Link>
                      ) : (
                        <Link
                          href={`/practice/${att.id}`}
                          className="px-3 py-1.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-colors"
                        >
                          Continue Draft
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Col: Practice Momentum & Core Principles */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#263244] pb-2">
            <span className="text-[#10b981] font-mono text-xs">//</span>
            <h3 className="font-sans font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              Practice Momentum
            </h3>
          </div>

          <div className="p-4 rounded border border-[#263244] bg-[#161e2e] space-y-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#64748b] block mb-1">DESIGN WORKSPACE ARCHITECTURE</span>
              <div className="text-sm font-bold text-[#f8fafc] font-tabular">
                3-ZONE WORKBENCH
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans mt-0.5">
                Specification on left, structured design sheet in center, real-time deterministic signals on right.
              </p>
            </div>

            <div className="border-t border-[#263244] pt-3">
              <span className="text-[10px] text-[#64748b] block mb-1">EVALUATION PHILOSOPHY</span>
              <div className="text-sm font-bold text-[#10b981]">
                EVIDENCE OVER SCORES
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans mt-0.5">
                Reviews explain what was submitted, what was observed, why it matters, and actionable changes.
              </p>
            </div>

            <div className="border-t border-[#263244] pt-3">
              <span className="text-[10px] text-[#64748b] block mb-1">FAST COMPARISON</span>
              <Link
                href="/attempts/compare?from=att-parking-lot-01&to=att-parking-lot-02"
                className="block p-2 rounded bg-[#0f141c] hover:border-[#38bdf8] border border-[#263244] text-[#38bdf8] transition-colors"
              >
                Compare Parking Lot #01 vs #02 →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

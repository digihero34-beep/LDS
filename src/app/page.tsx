import Link from 'next/link';
import { getProblemsUseCase } from '@/infrastructure/services';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const problems = await getProblemsUseCase.execute();
  const parkingLot = problems.find((p) => p.slug === 'parking-lot') || problems[0];

  return (
    <div className="flex-1 bg-[#0a0e17] text-[#f8fafc] font-sans antialiased overflow-x-hidden selection:bg-[#6366f1]/30 selection:text-[#c0c1ff]">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-workbench-grid pointer-events-none opacity-40 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-24">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
          {/* Subheader Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] font-mono text-[11px] tracking-wider uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            OBJECT-ORIENTED RIGOR V 1.34 — DETERMINISTIC ENGINE
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-white leading-[1.15]">
            Master Low-Level Design through{' '}
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
              Deterministic Evidence
            </span>
            , not Guesswork.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            An engineering workbench for software architects. Model real-world systems, pass concurrency and
            Single Responsibility rules, and review your object-oriented architecture through explainable evaluation.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
            <Link
              href={parkingLot ? `/problems/${parkingLot.slug}` : '/problems'}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-all shadow-lg shadow-[#6366f1]/25 flex items-center justify-center gap-2 group"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Start First Practice Session</span>
            </Link>

            <Link
              href="/problems"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#161e2e] hover:bg-[#1e293b] text-[#dee2ee] border border-[#263244] transition-all hover:border-[#38bdf8]/50 flex items-center justify-center gap-2"
            >
              <span>Explore Problem Catalog</span>
              <span className="text-[#38bdf8]">→</span>
            </Link>
          </div>

          {/* Metrics / Ticker Line */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#64748b]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#10b981]">›# 24</span>
              <span>Quantum Concurrency Rules</span>
            </div>
            <span className="hidden sm:inline text-[#263244]">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#38bdf8]">› 84</span>
              <span>Verified Problem Specs</span>
            </div>
            <span className="hidden sm:inline text-[#263244]">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#a855f7]">› 99.4ms</span>
              <span>Retry Resilience</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. INTERACTIVE PRACTICE WORKSPACE PREVIEW (HERO MOCKUP)                   */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          {/* Top Bar Label */}
          <div className="flex items-center justify-between text-xs font-mono px-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] text-[10px] uppercase font-bold border border-[#263244]">
                LIVE DEMO PREVIEW
              </span>
              <span className="text-[#94a3b8] font-bold">Interactive Practice Workspace Preview</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#64748b]">
              <span>SPEC: ID_LLD_SYSTEM_DESIGN_01</span>
              <span className="px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-semibold">
                STATUS: ACTIVE
              </span>
            </div>
          </div>

          {/* Main Workbench Window Frame */}
          <div className="border border-[#263244] rounded-lg bg-[#0f141c] shadow-2xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="h-10 bg-[#161e2e] border-b border-[#263244] px-4 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
                </div>
                <div className="px-3 py-1 rounded bg-[#0f141c] text-[#38bdf8] text-[11px] border border-[#263244] flex items-center gap-2">
                  <span>PARKING_LOT_SYSTEM_V2.LLD.schema.ts</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#64748b]">
                <span className="hidden sm:inline">Auto-save: <span className="text-[#10b981]">ON</span></span>
                <span>LATENCY: <span className="text-[#38bdf8]">12ms</span></span>
              </div>
            </div>

            {/* 3-Column Workbench Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] divide-y lg:divide-y-0 lg:divide-x divide-[#263244]">
              {/* Left Column: Problem Specs (3 Cols) */}
              <div className="lg:col-span-3 p-4 bg-[#111722] space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2">
                  <span className="text-[#94a3b8] font-bold uppercase tracking-wider text-[11px]">Problem Specs</span>
                  <span className="text-[10px] text-[#38bdf8]">[v1.4]</span>
                </div>

                <div className="space-y-3">
                  <div className="p-2.5 rounded bg-[#161e2e] border border-[#263244] space-y-1">
                    <span className="text-[10px] text-[#64748b] block">ACTIVE SPECIFICATION</span>
                    <span className="text-[#f8fafc] font-bold block text-sm">PARKING_LOT_V2</span>
                    <span className="text-[11px] text-[#94a3b8] font-sans block">
                      Multi-level lot with dynamic vehicle allocations and fee contracts.
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <span className="text-[10px] text-[#64748b] uppercase tracking-wider block">CONSTRAINTS</span>
                    <div className="p-2 rounded bg-[#0f141c] border border-[#263244] space-y-1.5">
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <span>✓</span>
                        <span className="text-[#dee2ee] text-[10px]">Multi-level vehicle slot allocation</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <span>✓</span>
                        <span className="text-[#dee2ee] text-[10px]">Dynamic Tariff Strategy (Tiered)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#10b981]">
                        <span>✓</span>
                        <span className="text-[#dee2ee] text-[10px]">Concurrency Lock (Mutex safety)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#f59e0b]">
                        <span>○</span>
                        <span className="text-[#94a3b8] text-[10px]">Eviction / Overflow Policy</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2 rounded bg-[#1e293b] hover:bg-[#263244] text-[#dee2ee] text-[11px] border border-[#263244] transition-colors flex items-center justify-center gap-1.5 font-bold">
                    <span>+</span>
                    <span>Add Class Model</span>
                  </button>
                </div>
              </div>

              {/* Center Column: Architectural Model Canvas (6 Cols) */}
              <div className="lg:col-span-6 p-4 sm:p-6 bg-[#0f141c] space-y-4 font-mono flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#64748b] border-b border-[#263244] pb-2">
                  <span className="text-[#38bdf8] font-bold">CANVAS: STRUCTURAL</span>
                  <span>ZOOM: 100%</span>
                </div>

                {/* UML Class Card Diagram */}
                <div className="space-y-4">
                  <div className="border border-[#38bdf8]/50 rounded bg-[#161e2e] shadow-lg p-3 sm:p-4 space-y-2 max-w-md mx-auto">
                    <div className="flex items-center justify-between border-b border-[#263244] pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#38bdf8] text-[10px]">«Class»</span>
                        <span className="font-bold text-[#f8fafc] text-xs">ParkingLot</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#64748b]">
                        <span className="px-1.5 py-0.5 rounded bg-[#0f141c] border border-[#263244]">AGGREGATE</span>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1 text-[#94a3b8]">
                      <div>- levels: <span className="text-[#38bdf8]">List&lt;ParkingLevel&gt;</span></div>
                      <div>- activeAllocations: <span className="text-[#38bdf8]">ConcurrentMap&lt;UUID, Spot&gt;</span></div>
                      <div>- pricingStrategy: <span className="text-[#818cf8]">TariffStrategy</span></div>
                    </div>

                    <div className="border-t border-[#263244] pt-2 text-[11px] space-y-1 text-[#dee2ee]">
                      <div>+ parkVehicle(v: <span className="text-[#38bdf8]">Vehicle</span>): <span className="text-[#10b981]">Ticket</span></div>
                      <div>+ processExit(ticketId: <span className="text-[#38bdf8]">UUID</span>): <span className="text-[#10b981]">Receipt</span></div>
                    </div>
                  </div>

                  {/* Connectors & Sub-Interfaces */}
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-[11px]">
                    <div className="p-2.5 rounded bg-[#161e2e]/70 border border-[#263244] space-y-1">
                      <div className="text-[10px] text-[#818cf8] font-bold">«Enum» VehicleType</div>
                      <div className="text-[#94a3b8] text-[10px]">• COMPACT</div>
                      <div className="text-[#94a3b8] text-[10px]">• LARGE</div>
                      <div className="text-[#94a3b8] text-[10px]">• MOTORCYCLE</div>
                    </div>

                    <div className="p-2.5 rounded bg-[#161e2e]/70 border border-[#263244] space-y-1">
                      <div className="text-[10px] text-[#10b981] font-bold">«Interface» TariffStrategy</div>
                      <div className="text-[#dee2ee] text-[10px]">+ calculateFee(t: Ticket): USD</div>
                    </div>
                  </div>
                </div>

                {/* Footer Validation Status */}
                <div className="pt-2 border-t border-[#263244] flex items-center justify-between text-[11px] text-[#64748b]">
                  <span className="flex items-center gap-1.5 text-[#10b981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    DOT / MERMAID GRAPH: PARSED &amp; VALIDATED
                  </span>
                  <span>ENTITIES: 3 | EDGES: 2</span>
                </div>
              </div>

              {/* Right Column: Signals Inspector (3 Cols) */}
              <div className="lg:col-span-3 p-4 bg-[#111722] space-y-4 font-mono text-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#263244] pb-2">
                    <span className="text-[#94a3b8] font-bold uppercase tracking-wider text-[11px]">Signals Inspector</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] text-[10px] border border-[#10b981]/30">
                      3 OF 8 PASSED
                    </span>
                  </div>

                  {/* Diagnostic Cards */}
                  <div className="space-y-2.5">
                    {/* Card 1 */}
                    <div className="p-2.5 rounded bg-[#161e2e] border border-[#10b981]/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#10b981] font-bold text-[10px]">SOLID: RESPONSIBILITY</span>
                        <span className="text-[10px] text-[#10b981] font-bold">PASS</span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] font-sans">
                        Single Responsibility verified for Level and VehicleAllocation. No god classes.
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-2.5 rounded bg-[#161e2e] border border-[#10b981]/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#10b981] font-bold text-[10px]">COUPLING: INTERDEPENDENCE</span>
                        <span className="text-[10px] text-[#10b981] font-bold">PASS</span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] font-sans">
                        Tariff calculation decoupled via Strategy pattern. Afferent coupling: 0.12.
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-2.5 rounded bg-[#161e2e] border border-[#f43f5e]/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#f43f5e] font-bold text-[10px]">CONCURRENCY SAFETY</span>
                        <span className="text-[10px] text-[#f43f5e] font-bold">ATTENTION</span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] font-sans">
                        Race condition detected on spot decrement during concurrent gate arrival.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href={parkingLot ? `/practice/preview-demo` : '/problems'}
                  className="w-full py-2.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white text-center text-[11px] font-bold tracking-wider transition-colors shadow-sm block"
                >
                  Run Pre-Flight Inspection →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. DETERMINISTIC ARCHITECTURE PIPELINE (4 STEPS)                         */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-left space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono text-[#38bdf8] uppercase tracking-wider font-semibold block flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
              </span>
              THE 4-STAGE ARCHITECTURAL PIPELINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
              Deterministic Architecture Circuit
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-sans">
              Replace superficial whiteboards and subjective interviews with verifiable engineering disciplines:
              AST analysis, rule compliance, and concurrency proofs.
            </p>
          </div>

          {/* Animated Circuit Wire Vector (Visible on larger screens) */}
          <div className="relative py-2">
            <svg className="hidden lg:block w-full h-6 overflow-visible" viewBox="0 0 1000 24" fill="none">
              {/* Circuit background bus */}
              <line x1="125" y1="12" x2="875" y2="12" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
              {/* Flowing animated signal current */}
              <line
                x1="125"
                y1="12"
                x2="875"
                y2="12"
                stroke="url(#circuit-grad)"
                strokeWidth="2.5"
                className="animate-circuit-flow"
              />
              <defs>
                <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="35%" stopColor="#6366f1" />
                  <stop offset="70%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              {/* Bus node gates */}
              <circle cx="125" cy="12" r="5" fill="#0f141c" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="375" cy="12" r="5" fill="#0f141c" stroke="#6366f1" strokeWidth="2" />
              <circle cx="625" cy="12" r="5" fill="#0f141c" stroke="#10b981" strokeWidth="2" />
              <circle cx="875" cy="12" r="5" fill="#0f141c" stroke="#a855f7" strokeWidth="2" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Step 1 */}
            <div className="group p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#38bdf8] hover:bg-[#161e2e] hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#38bdf8]">
                <span className="font-bold">01 / PLAN &amp; SPEC</span>
                <span className="group-hover:translate-x-1 transition-transform">↳</span>
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc] font-sans group-hover:text-[#38bdf8] transition-colors">
                Specs &amp; Decomposition
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Transform fuzzy requirements into typed domain constraints, invariant assertions, and explicit concurrency expectations.
              </p>
              <div className="pt-2 text-[11px] text-[#38bdf8] flex items-center gap-1">
                <span>Explore Specs</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#6366f1] hover:bg-[#161e2e] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#818cf8]">
                <span className="font-bold">02 / ARCHITECT</span>
                <span className="group-hover:translate-x-1 transition-transform">↳</span>
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc] font-sans group-hover:text-[#818cf8] transition-colors">
                Structure Modeling
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Define entity responsibilities, interfaces, and inheritance hierarchy graphs using rigorous UML schemas instead of vague text.
              </p>
              <div className="pt-2 text-[11px] text-[#818cf8] flex items-center gap-1">
                <span>Model Canvas</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#10b981] hover:bg-[#161e2e] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#10b981]">
                <span className="font-bold">03 / VERIFY</span>
                <span className="group-hover:translate-x-1 transition-transform">↳</span>
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc] font-sans group-hover:text-[#10b981] transition-colors">
                AST &amp; Concurrency Rules
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Automated static analysis evaluates Single Responsibility, race conditions, leak detection, and cyclical dependencies.
              </p>
              <div className="pt-2 text-[11px] text-[#10b981] flex items-center gap-1">
                <span>Pre-Check Framework</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#a855f7] hover:bg-[#161e2e] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#a855f7]">
                <span className="font-bold">04 / ITERATE</span>
                <span className="group-hover:translate-x-1 transition-transform">↳</span>
              </div>
              <h3 className="font-bold text-sm text-[#f8fafc] font-sans group-hover:text-[#a855f7] transition-colors">
                Explainable Feedback &amp; Diff
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Receive concrete observations, citations, prioritized refactoring actions, and side-by-side attempt progression metrics.
              </p>
              <div className="pt-2 text-[11px] text-[#a855f7] flex items-center gap-1">
                <span>Attempt Diff Tooling</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. EVIDENCE & PHILOSOPHY SECTION ("REVIEW LIKE A MENTOR")                */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-[11px] font-mono text-[#10b981] uppercase tracking-wider font-semibold">
              EVALUATION ENGINE SANITY CHECK
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
              &quot;Review like a mentor, improve through evidence.&quot;
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-sans">
              No subjective grades or generic LLM summaries. Every finding cites an immutable structural rule and an actionable refactor.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono">
            {/* Left Box: Traditional Prep Flaw vs Architect Standard (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Flaw Card */}
              <div className="p-5 rounded-lg border border-[#f43f5e]/30 bg-[#161e2e]/60 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#f43f5e] font-bold text-sm">
                  <span>✕</span>
                  <span>Traditional Interview Prep Flaw</span>
                </div>
                <div className="space-y-2 text-[#94a3b8] text-[11px] font-sans">
                  <div>• Vague feedback: &quot;6/10 — good structure but needs improvement&quot;.</div>
                  <div>• Hides concurrency bugs in code — misses race conditions and deadlock hazards.</div>
                  <div>• Zero architectural checks on OOP relationship coupling or SRP violations.</div>
                </div>
              </div>

              {/* Standard Card */}
              <div className="p-5 rounded-lg border border-[#10b981]/40 bg-[#161e2e]/90 space-y-3 text-xs shadow-lg">
                <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                  <span>✓</span>
                  <span>The Architect Standard</span>
                </div>
                <div className="space-y-2 text-[#dee2ee] text-[11px] font-sans">
                  <div>• Generates detailed citation-level AST tree code tracing with live class analysis.</div>
                  <div>• Linting multi-pattern and Open-Closed principles across boundary checks.</div>
                  <div>• Thread-safety simulation testing with synthetic parallel workloads.</div>
                </div>
              </div>
            </div>

            {/* Right Box: Evidence Card Mockup (7 Cols) */}
            <div className="lg:col-span-7 border border-[#263244] rounded-lg bg-[#111722] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#263244] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#38bdf8] font-bold">EVALUATION_REPORT:</span>
                  <span className="text-[#f8fafc]">ATTEMPT_PARKING_LOT_V2</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f43f5e]/10 text-[#f43f5e] text-[10px] border border-[#f43f5e]/30 font-bold">
                  SEVERITY: HIGH
                </span>
              </div>

              {/* Code Citation Block */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#64748b] uppercase">VIOLATION CODE SNIPPET (EXCERPT)</span>
                <div className="p-3 rounded bg-[#0a0e17] border border-[#263244] text-[11px] space-y-1 font-mono">
                  <div className="text-[#64748b]">// In PaymentClient.ts</div>
                  <div>public processPayment(amount: number) &#123;</div>
                  <div className="pl-4 text-[#f43f5e] bg-[#f43f5e]/10 py-0.5 rounded">
                    this.httpClient.post(&#39;gateway/charge&#39;); // DIRECT VENDOR COUPLING
                  </div>
                  <div className="pl-4">return callReceipt();</div>
                  <div>&#125;</div>
                </div>
              </div>

              {/* Observation & Suggestion Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#38bdf8] font-bold">[WHAT IS OBSERVED]</span>
                  <p className="text-[11px] text-[#94a3b8] font-sans">
                    PaymentClient binds object state directly to third-party payment vendor HTTP endpoints.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#f43f5e] font-bold">[WHY IT MATTERS]</span>
                  <p className="text-[11px] text-[#94a3b8] font-sans">
                    A failure in the third party breaks internal transaction processing and prevents multi-tenant payment routing.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#10b981] font-bold">[RECOMMENDED REFACTOR]</span>
                  <p className="text-[11px] text-[#dee2ee] font-sans">
                    Inject <span className="text-[#38bdf8] font-mono">PaymentGateway</span> interface and delegate HTTP logic to an infrastructure <span className="text-[#38bdf8] font-mono">StripeGateway</span> adapter.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#263244] pt-3 flex items-center justify-between text-[10px] text-[#64748b]">
                <span>RULE REF: LLD-STRATEGY-PATTERN-SPEC-02</span>
                <span className="text-[#38bdf8] hover:underline cursor-pointer">Apply this Refactor →</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PRODUCTION-GRADE PROBLEM SPECS                                        */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#263244] pb-4 font-mono">
            <div>
              <span className="text-[11px] text-[#38bdf8] uppercase tracking-wider font-semibold block">
                TARGETS / EXERCISES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
                Production-Grade Problem Specs
              </h2>
            </div>
            <Link href="/problems" className="text-xs text-[#38bdf8] hover:underline">
              Browse All 84 Specs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Problem 1 */}
            <Link
              href="/problems/parking-lot"
              className="p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#38bdf8]/50 transition-all hover:bg-[#161e2e] space-y-3 group block"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#0f141c] text-[#38bdf8] border border-[#263244]">
                  CONCURRENCY &amp; LOCKING
                </span>
                <span className="text-[#64748b]">EST: 35 MIN</span>
              </div>
              <h3 className="font-bold text-base text-[#f8fafc] font-sans group-hover:text-[#38bdf8] transition-colors">
                Parking Lot Management
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Architect a multi-level automated parking garage. Handle concurrent entry gates, vehicle slot sizing, dynamic pricing rules, and atomic occupancy tracking.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Low Latency</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Strategy Pattern</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Mutex Locks</span>
              </div>
            </Link>

            {/* Problem 2 */}
            <Link
              href="/problems/elevator-system"
              className="p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#38bdf8]/50 transition-all hover:bg-[#161e2e] space-y-3 group block"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#0f141c] text-[#10b981] border border-[#263244]">
                  STATE MACHINES &amp; TIMERS
                </span>
                <span className="text-[#64748b]">EST: 40 MIN</span>
              </div>
              <h3 className="font-bold text-base text-[#f8fafc] font-sans group-hover:text-[#38bdf8] transition-colors">
                Multi-Car Elevator Dispatcher
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Design a controller for a 10-story tower with 4 cars. Implement SCAN elevator scheduling, load sensor thresholds, and emergency override states.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">SCAN Algorithm</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">State Pattern</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Load Balancing</span>
              </div>
            </Link>

            {/* Problem 3 */}
            <Link
              href="/problems/notification-service"
              className="p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#38bdf8]/50 transition-all hover:bg-[#161e2e] space-y-3 group block"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#0f141c] text-[#a855f7] border border-[#263244]">
                  RATE LIMITING &amp; QUEUES
                </span>
                <span className="text-[#64748b]">EST: 45 MIN</span>
              </div>
              <h3 className="font-bold text-base text-[#f8fafc] font-sans group-hover:text-[#38bdf8] transition-colors">
                In-Memory Rate Limiter
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Implement Sliding Window Log and Token Bucket rate limiting algorithms. Support dynamic client tiering, concurrent window sliding, and thread-safe eviction.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Sliding Window</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Decorator Pattern</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">High Throughput</span>
              </div>
            </Link>

            {/* Problem 4 */}
            <Link
              href="/problems/vending-machine"
              className="p-5 rounded-lg border border-[#263244] bg-[#161e2e]/70 hover:border-[#38bdf8]/50 transition-all hover:bg-[#161e2e] space-y-3 group block"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#0f141c] text-[#f59e0b] border border-[#263244]">
                  HARDWARE &amp; REALTIME
                </span>
                <span className="text-[#64748b]">EST: 30 MIN</span>
              </div>
              <h3 className="font-bold text-base text-[#f8fafc] font-sans group-hover:text-[#38bdf8] transition-colors">
                Vending Machine Transaction Engine
              </h3>
              <p className="text-xs text-[#94a3b8] font-sans leading-relaxed">
                Design an inventory-aware vending machine with physical hardware state handling, coin/bill escrow, change calculation, and transaction rollbacks.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Hardware Interface</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">State Pattern</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#0f141c] text-[#64748b] border border-[#263244]">Atomic Escrow</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. QUANTITATIVE IMPACT METRICS                                           */}
        {/* ========================================================================= */}
        <section className="border border-[#263244] rounded-lg bg-[#111722] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 font-mono">
            {/* Metric 1 */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider block">
                ARCHITECTURAL TELEMETRY
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#38bdf8]">
                -42.8%
              </div>
              <div className="font-bold text-xs text-[#f8fafc]">Coupling Density Reduction</div>
              <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                Average reduction in cyclic class dependencies observed over four consecutive design attempts per candidate.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#263244] pt-4 md:pt-0 md:pl-8">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider block">
                EVALUATION FIDELITY
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#10b981]">
                100%
              </div>
              <div className="font-bold text-xs text-[#f8fafc]">Deterministic Rule Coverage</div>
              <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                Zero hallucinated citations. Every design critique is mapped directly to AST software engineering standards and runnable LLD rules.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#263244] pt-4 md:pt-0 md:pl-8">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider block">
                VERIFICATION LATENCY
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#818cf8]">
                &lt; 18ms
              </div>
              <div className="font-bold text-xs text-[#f8fafc]">Sub-Second Feedback Loop</div>
              <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                Instantaneous static evaluation for immediate architectural feedback before human mentor or peer review.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. RAPID BOOTSTRAP CLI CALLOUT                                           */}
        {/* ========================================================================= */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#a855f7] uppercase tracking-wider font-semibold">
              RAPID BOOTSTRAP
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans text-white">
              Start your first architectural attempt in seconds.
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-sans max-w-xl mx-auto">
              Launch in your browser or initialize problem specifications directly in your terminal using the CLI.
            </p>
          </div>

          {/* Terminal Box */}
          <div className="max-w-xl mx-auto rounded-lg border border-[#263244] bg-[#0f141c] overflow-hidden shadow-2xl font-mono text-xs text-left">
            <div className="h-8 bg-[#161e2e] px-4 flex items-center justify-between border-b border-[#263244]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#64748b]/50" />
                <div className="w-2 h-2 rounded-full bg-[#64748b]/50" />
                <div className="w-2 h-2 rounded-full bg-[#64748b]/50" />
              </div>
              <span className="text-[10px] text-[#64748b]">bash — 80x24</span>
            </div>

            <div className="p-4 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#10b981] font-bold">$</span>
                <span className="text-[#f8fafc]">npx lld init parking_lot --template=clean</span>
              </div>
              <span className="text-[#64748b] hover:text-[#f8fafc] cursor-pointer text-xs">📋</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
            <Link
              href={parkingLot ? `/problems/${parkingLot.slug}` : '/problems'}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold transition-all shadow-lg shadow-[#6366f1]/25 flex items-center justify-center gap-2"
            >
              <span>Start Practice Workspace</span>
              <span>→</span>
            </Link>

            <Link
              href="/problems"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#161e2e] hover:bg-[#1e293b] text-[#dee2ee] border border-[#263244] transition-all hover:border-[#38bdf8]/50 flex items-center justify-center gap-2"
            >
              <span>Plan First on Whiteboard</span>
              <span>↗</span>
            </Link>
          </div>

          <p className="text-[11px] text-[#64748b] font-mono">
            No credit card required. Evaluator engine runs locally or in Neon cloud.
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 8. FOOTER                                                                 */}
        {/* ========================================================================= */}
        <footer className="border-t border-[#263244] pt-12 pb-8 space-y-12 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Info */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white font-sans">ARCHITECT</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] border border-[#263244]">
                  v1.34
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                An intentional design engineering workbench. Apply deterministic object-oriented architectures, eliminate thread-safety pitfalls, and learn solid architectural evidence.
              </p>
              <div className="pt-2 text-[10px] text-[#64748b] space-y-0.5">
                <div>SYSTEM: <span className="text-[#10b981]">HEALTHY</span></div>
                <div>PROJECT: <span className="text-[#38bdf8]">LLD_CORE_1</span></div>
              </div>
            </div>

            {/* Col 2: Specs */}
            <div className="space-y-3">
              <span className="font-bold text-[#f8fafc] text-xs uppercase tracking-wider block">
                WORKBENCH SPECS
              </span>
              <div className="space-y-2 text-[#94a3b8] text-[11px]">
                <div><Link href="/problems" className="hover:text-[#38bdf8] transition-colors">Catalog Directory</Link></div>
                <div><Link href="/practice/preview" className="hover:text-[#38bdf8] transition-colors">Interactive Workbench</Link></div>
                <div><Link href="/dashboard" className="hover:text-[#38bdf8] transition-colors">Telemetry Engine</Link></div>
                <div><Link href="/design-system" className="hover:text-[#38bdf8] transition-colors">AST Syntax Tree</Link></div>
                <div><Link href="/problems" className="hover:text-[#38bdf8] transition-colors">CLI Toolchain</Link></div>
              </div>
            </div>

            {/* Col 3: Rubric */}
            <div className="space-y-3">
              <span className="font-bold text-[#f8fafc] text-xs uppercase tracking-wider block">
                RUBRIC METRICS
              </span>
              <div className="space-y-2 text-[#94a3b8] text-[11px]">
                <div><Link href="/design-system" className="hover:text-[#38bdf8] transition-colors">Single Responsibility</Link></div>
                <div><Link href="/design-system" className="hover:text-[#38bdf8] transition-colors">Polymorphic Limits</Link></div>
                <div><Link href="/design-system" className="hover:text-[#38bdf8] transition-colors">Interface Invariants</Link></div>
                <div><Link href="/design-system" className="hover:text-[#38bdf8] transition-colors">Extensibility Ratios</Link></div>
                <div><Link href="/design-system" className="hover:text-[#38bdf8] transition-colors">Concurrency Invariants</Link></div>
              </div>
            </div>

            {/* Col 4: Platform */}
            <div className="space-y-3">
              <span className="font-bold text-[#f8fafc] text-xs uppercase tracking-wider block">
                PLATFORM &amp; GOVERNANCE
              </span>
              <div className="space-y-2 text-[#94a3b8] text-[11px]">
                <div><span className="hover:text-[#38bdf8] cursor-pointer">System Status</span></div>
                <div><span className="hover:text-[#38bdf8] cursor-pointer">Enterprise Sandboxes</span></div>
                <div><span className="hover:text-[#38bdf8] cursor-pointer">Security Sandbox</span></div>
                <div><span className="hover:text-[#38bdf8] cursor-pointer">Privacy Policy</span></div>
                <div><span className="hover:text-[#38bdf8] cursor-pointer">Terms of Service</span></div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#263244] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#64748b]">
            <div>© 2026 ARCHITECT WORKBENCH. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-4">
              <span>All Systems Nominal</span>
              <span>•</span>
              <span>LATENCY: 9ms</span>
              <span>•</span>
              <span className="text-[#10b981]">DETERMINISTIC EVALUATION</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

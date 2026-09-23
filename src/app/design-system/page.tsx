import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfidenceMeter } from '@/components/ui/ConfidenceMeter';

export default function DesignSystemPage() {
  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8 font-mono text-xs">
      {/* Header */}
      <div className="border-b border-[#263244] pb-6 space-y-2">
        <div className="text-[11px] text-[#38bdf8] uppercase tracking-wider flex items-center gap-2">
          <span>//</span> DESIGN SPECIFICATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#f8fafc] tracking-tight">
          Technical Workbench System
        </h1>
        <p className="text-xs text-[#94a3b8] font-sans max-w-2xl">
          Visual tokens, architectural typography, elevation hierarchy, and component contracts designed
          for senior software engineers practicing Low-Level Design.
        </p>
      </div>

      {/* Surface Elevation Tiers */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#f8fafc] font-sans uppercase tracking-wide">
          1. Surface Elevation Tiers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded bg-[#0f141c] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#64748b] block">CANVAS BASE</span>
            <span className="font-bold text-[#f8fafc]">#0F141C</span>
          </div>
          <div className="p-4 rounded bg-[#161e2e] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#64748b] block">ELEVATION 1 (MODULE)</span>
            <span className="font-bold text-[#f8fafc]">#161E2E</span>
          </div>
          <div className="p-4 rounded bg-[#1e293b] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#64748b] block">ELEVATION 2 (ENTITY)</span>
            <span className="font-bold text-[#f8fafc]">#1E293B</span>
          </div>
          <div className="p-4 rounded bg-[#263348] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#64748b] block">ELEVATION 3 (ACTIVE)</span>
            <span className="font-bold text-[#f8fafc]">#263348</span>
          </div>
        </div>
      </section>

      {/* Semantic Signal Accents */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#f8fafc] font-sans uppercase tracking-wide">
          2. Semantic Signal Accents
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded bg-[#161e2e] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#6366f1] block">PRIMARY</span>
            <span className="font-bold text-[#f8fafc]">#6366F1</span>
          </div>
          <div className="p-3 rounded bg-[#161e2e] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#38bdf8] block">CYAN (TYPE/LINK)</span>
            <span className="font-bold text-[#f8fafc]">#38BDF8</span>
          </div>
          <div className="p-3 rounded bg-[#161e2e] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#10b981] block">EMERALD (PASS)</span>
            <span className="font-bold text-[#f8fafc]">#10B981</span>
          </div>
          <div className="p-3 rounded bg-[#161e2e] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#f59e0b] block">AMBER (WARN)</span>
            <span className="font-bold text-[#f8fafc]">#F59E0B</span>
          </div>
          <div className="p-3 rounded bg-[#161e2e] border border-[#263244] space-y-1">
            <span className="text-[10px] text-[#f43f5e] block">ROSE (DEFECT)</span>
            <span className="font-bold text-[#f8fafc]">#F43F5E</span>
          </div>
        </div>
      </section>

      {/* Badges & Meters */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#f8fafc] font-sans uppercase tracking-wide">
          3. Badges &amp; Metrics
        </h2>
        <div className="p-5 rounded bg-[#161e2e] border border-[#263244] space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="STRONG" />
            <StatusBadge status="ADEQUATE" />
            <StatusBadge status="NEEDS_ATTENTION" />
            <StatusBadge status="INCOMPLETE" />
            <StatusBadge status="PASS" />
            <StatusBadge status="WARN" />
            <StatusBadge status="FAIL" />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#263244]">
            <ConfidenceMeter level="HIGH" />
            <ConfidenceMeter level="MEDIUM" />
            <ConfidenceMeter level="LOW" />
          </div>
        </div>
      </section>

      {/* Typography Specimens */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#f8fafc] font-sans uppercase tracking-wide">
          4. Typographic Hierarchy
        </h2>
        <div className="p-5 rounded bg-[#161e2e] border border-[#263244] space-y-4">
          <div>
            <span className="text-[10px] text-[#64748b] block font-mono">SPACE GROTESK // HEADLINES</span>
            <div className="text-2xl font-bold font-sans text-[#f8fafc]">
              Architecture Blueprint Specification
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block font-mono">JETBRAINS MONO // BODY &amp; SIGNATURES</span>
            <code className="text-xs text-[#38bdf8] font-mono block">
              + findAvailableSpot(vehicleType: VehicleType): ParkingSpot
            </code>
          </div>
        </div>
      </section>

      <div className="pt-4 border-t border-[#263244] flex items-center justify-between">
        <Link href="/" className="text-[#38bdf8] hover:underline">
          ← Return to Dashboard
        </Link>
        <span className="text-[#64748b]">LLD PRACTICE PLATFORM // ARCHITECT WORKBENCH</span>
      </div>
    </div>
  );
}

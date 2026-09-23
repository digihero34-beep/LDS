'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AttemptSnapshot } from '@/domain/attempt/Attempt';
import { ProblemSnapshot } from '@/domain/problem/types';
import {
  ClassDesign,
  DesignDecision,
  EdgeCase,
  Relationship,
  SubmissionPayload,
  SubmissionSnapshot,
} from '@/domain/submission/types';
import { DeterministicEvaluator, DeterministicInspectionResult } from '@/infrastructure/evaluator/DeterministicEvaluator';
import { DesignInspector } from '@/components/practice/DesignInspector';
import { PreFlightModal } from '@/components/practice/PreFlightModal';
import { ClassEditorModal } from '@/components/practice/ClassEditorModal';
import { RelationshipEditorModal } from '@/components/practice/RelationshipEditorModal';
import { TelemetryPanel } from '@/components/practice/TelemetryPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';

const deterministicEvaluator = new DeterministicEvaluator();

export default function PracticeWorkspacePage({ params }: { params: { attemptId: string } }) {
  const router = useRouter();

  // Core Data State
  const [attempt, setAttempt] = useState<AttemptSnapshot | null>(null);
  const [problem, setProblem] = useState<ProblemSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form / Design Sheet State
  const [requirementsUnderstanding, setRequirementsUnderstanding] = useState('');
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [newAssumption, setNewAssumption] = useState('');
  const [classes, setClasses] = useState<ClassDesign[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [designDecisions, setDesignDecisions] = useState<DesignDecision[]>([]);
  const [edgeCases, setEdgeCases] = useState<EdgeCase[]>([]);

  // Telemetry Tab State
  const [activeCenterTab, setActiveCenterTab] = useState<'SHEET' | 'TELEMETRY'>('SHEET');

  // Modal States
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDesign | null>(null);

  const [relModalOpen, setRelModalOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<Relationship | null>(null);
  const [hoveredRel, setHoveredRel] = useState<Relationship | null>(null);

  const [preFlightOpen, setPreFlightOpen] = useState(false);

  // Autosave and Submission Status
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING' | 'DIRTY'>('SAVED');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref to hold current payload for debounced save
  const payloadRef = useRef<SubmissionPayload>({
    requirementsUnderstanding: '',
    assumptions: [],
    classes: [],
    relationships: [],
    designDecisions: [],
    edgeCases: [],
  });

  payloadRef.current = {
    requirementsUnderstanding,
    assumptions,
    classes,
    relationships,
    designDecisions,
    edgeCases,
  };

  // 1. Initial Load: Fetch Attempt, Submission, and Problem
  useEffect(() => {
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

        // Fetch corresponding problem
        const probRes = await fetch(`/api/problems/${att.problemId}`);
        if (probRes.ok) {
          const probJson = await probRes.json().catch(() => null);
          if (probJson?.success) setProblem(probJson.data);
        }

        // If existing submission draft exists, populate state
        const sub: SubmissionSnapshot | null = json.data.submission;
        if (sub) {
          setRequirementsUnderstanding(sub.requirementsUnderstanding || '');
          setAssumptions(sub.assumptions || []);
          setClasses(sub.classes || []);
          setRelationships(sub.relationships || []);
          setDesignDecisions(sub.designDecisions || []);
          setEdgeCases(sub.edgeCases || []);
          setLastSavedAt(new Date(sub.updatedAt));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.attemptId]);

  // 2. Compute Deterministic Signals Live
  const inspection: DeterministicInspectionResult = deterministicEvaluator.inspect({
    id: 'draft',
    attemptId: params.attemptId,
    version: 1,
    requirementsUnderstanding,
    assumptions,
    classes,
    relationships,
    designDecisions,
    edgeCases,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 3. Save Draft Handler (Manual or Debounced)
  const saveDraft = useCallback(async () => {
    if (attempt?.status !== 'DRAFT') return;
    setSaveStatus('SAVING');

    try {
      const res = await fetch(`/api/attempts/${params.attemptId}/draft`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadRef.current),
      });

      if (!res.ok) {
        setSaveStatus('DIRTY');
        return;
      }

      const rawText = await res.text();
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch {
        setSaveStatus('DIRTY');
        return;
      }

      if (!json.success) throw new Error(json.error || 'Failed to save draft');

      setSaveStatus('SAVED');
      setLastSavedAt(new Date());
    } catch (err) {
      console.error('Draft save failed:', err);
      setSaveStatus('DIRTY');
    }
  }, [attempt?.status, params.attemptId]);

  // Debounced Autosave Trigger on State Changes
  useEffect(() => {
    if (loading || attempt?.status !== 'DRAFT') return;
    setSaveStatus('DIRTY');

    const timer = setTimeout(() => {
      saveDraft();
    }, 2000); // 2-second debounce

    return () => clearTimeout(timer);
  }, [
    requirementsUnderstanding,
    assumptions,
    classes,
    relationships,
    designDecisions,
    edgeCases,
    saveDraft,
    loading,
    attempt?.status,
  ]);

  // 4. Final Submission Handler
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/attempts/${params.attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadRef.current),
      });

      const rawText = await res.text();
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Server returned an invalid response (${res.status} ${res.statusText || 'Error'}). Please check the server logs or try again.`
        );
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Submission failed with status ${res.status}`);
      }

      // Submission and evaluation succeeded, navigate to evaluation screen
      router.push(`/attempts/${params.attemptId}/evaluation`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setIsSubmitting(false);
      setPreFlightOpen(false);
    }
  };

  // Class Actions
  const handleSaveClass = (classDesign: ClassDesign) => {
    const existingIndex = classes.findIndex((c) => c.id === classDesign.id);
    if (existingIndex >= 0) {
      const updated = [...classes];
      updated[existingIndex] = classDesign;
      setClasses(updated);
    } else {
      setClasses([...classes, classDesign]);
    }
  };

  const handleDeleteClass = (id: string) => {
    const targetClass = classes.find((c) => c.id === id);
    setClasses(classes.filter((c) => c.id !== id));
    // Also prune relationships referencing this deleted class
    if (targetClass) {
      const name = targetClass.name.toLowerCase();
      setRelationships(
        relationships.filter(
          (r) => r.fromClass.toLowerCase() !== name && r.toClass.toLowerCase() !== name
        )
      );
    }
  };

  // Relationship Actions
  const handleSaveRelationship = (rel: Relationship) => {
    const existingIndex = relationships.findIndex((r) => r.id === rel.id);
    if (existingIndex >= 0) {
      const updated = [...relationships];
      updated[existingIndex] = rel;
      setRelationships(updated);
    } else {
      setRelationships([...relationships, rel]);
    }
  };

  const handleDeleteRelationship = (id: string) => {
    setRelationships(relationships.filter((r) => r.id !== id));
  };

  // Assumptions Actions
  const handleAddAssumption = () => {
    if (!newAssumption.trim()) return;
    setAssumptions([...assumptions, newAssumption.trim()]);
    setNewAssumption('');
  };

  // Decision & Edge Case Adders
  const handleAddDecision = () => {
    const newDec: DesignDecision = {
      id: `dec-${Date.now()}`,
      title: 'Design Pattern / Modularity Trade-off',
      decision: '',
      rationale: '',
    };
    setDesignDecisions([...designDecisions, newDec]);
  };

  const handleAddEdgeCase = () => {
    const newEdge: EdgeCase = {
      id: `edge-${Date.now()}`,
      scenario: '',
      expectedBehavior: '',
    };
    setEdgeCases([...edgeCases, newEdge]);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 font-mono text-xs text-[#94a3b8]">
        Mounting Engineering Design Review Workbench...
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 font-mono text-xs text-[#f43f5e]">
        <div>{error}</div>
        <Link href="/problems" className="text-[#38bdf8] hover:underline">
          ← Return to Problem Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f141c] overflow-hidden">
      {/* Sub-header Context Rail */}
      <div className="h-10 border-b border-[#263244] bg-[#161e2e]/90 px-4 flex items-center justify-between text-xs font-mono shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <Link href={`/problems/${problem?.slug || ''}`} className="text-[#38bdf8] hover:underline flex items-center gap-1">
            <span>←</span> {problem?.title || 'Problem'}
          </Link>
          <span className="text-[#64748b]">|</span>
          <span className="text-[#dee2ee] font-semibold">ATTEMPT #{attempt?.attemptNumber}</span>
          <StatusBadge status={attempt?.status || 'DRAFT'} size="sm" />
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Switcher between Design Sheet & Telemetry */}
          <div className="flex items-center space-x-1 p-0.5 rounded bg-[#0f141c] border border-[#263244]">
            <button
              onClick={() => setActiveCenterTab('SHEET')}
              className={`px-2.5 py-0.5 text-[11px] rounded transition-colors ${
                activeCenterTab === 'SHEET' ? 'bg-[#6366f1] text-white font-bold' : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              DESIGN SHEET
            </button>
            <button
              onClick={() => setActiveCenterTab('TELEMETRY')}
              className={`px-2.5 py-0.5 text-[11px] rounded transition-colors flex items-center gap-1 ${
                activeCenterTab === 'TELEMETRY' ? 'bg-[#6366f1] text-white font-bold' : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              TELEMETRY ({classes.length})
            </button>
          </div>

          <Link
            href={`/problems/${problem?.id}/history`}
            className="px-2.5 py-1 text-[11px] rounded bg-[#1e293b] hover:bg-[#263348] text-[#94a3b8] hover:text-[#f8fafc] border border-[#263244]"
          >
            History
          </Link>
        </div>
      </div>

      {/* Main 3-Column Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Problem Specification (Collapsible on mobile) */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[#263244] bg-[#161e2e]/50 flex flex-col h-auto lg:h-full overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[#263244] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[#38bdf8] font-mono text-xs">//</span>
              <h2 className="font-sans font-bold text-xs tracking-tight text-[#f8fafc] uppercase">
                Problem Specification
              </h2>
            </div>
            <StatusBadge status={problem?.difficulty || 'MEDIUM'} size="sm" />
          </div>

          <div className="p-4 space-y-5 text-xs font-mono">
            {/* Summary */}
            <div>
              <span className="text-[10px] text-[#64748b] uppercase block mb-1">CHALLENGE BRIEF</span>
              <p className="text-[#dee2ee] font-sans text-xs leading-relaxed">{problem?.summary}</p>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#38bdf8] uppercase block">FUNCTIONAL REQUIREMENTS</span>
              <div className="space-y-2">
                {problem?.requirements.map((req) => (
                  <div key={req.id} className="p-2.5 rounded bg-[#0f141c] border border-[#263244] space-y-1">
                    <span className="text-[9px] text-[#38bdf8] block font-mono">[{req.category}]</span>
                    <p className="text-[#dee2ee] font-sans text-[11px] leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#f59e0b] uppercase block">ARCHITECTURAL CONSTRAINTS</span>
              <div className="space-y-2">
                {problem?.constraints.map((con) => (
                  <div key={con.id} className="p-2.5 rounded bg-[#0f141c] border border-[#263244] space-y-1">
                    <span className="text-[9px] text-[#f59e0b] font-bold">TYPE: {con.type}</span>
                    <p className="text-[#94a3b8] font-sans text-[11px] leading-relaxed">
                      {con.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Structured Design Sheet or Telemetry */}
        <main className="flex-1 bg-[#0f141c] flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
          {error && (
            <div className="p-3 rounded bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-xs font-mono text-[#f43f5e]">
              ⚠ {error}
            </div>
          )}

          {activeCenterTab === 'TELEMETRY' ? (
            <div className="space-y-4">
              <TelemetryPanel classes={classes} relationships={relationships} />
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              {/* SECTION 1: Requirements Understanding */}
              <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#38bdf8] text-xs font-bold">SECTION 01 //</span>
                    <h3 className="font-sans font-bold text-sm text-[#f8fafc]">
                      Requirements Understanding
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#64748b]">REQUIRED</span>
                </div>
                <p className="text-xs text-[#94a3b8] font-sans">
                  Summarize the essential operations, scope, and non-functional goals of this LLD challenge.
                </p>
                <textarea
                  rows={4}
                  value={requirementsUnderstanding}
                  onChange={(e) => setRequirementsUnderstanding(e.target.value)}
                  placeholder="e.g. Design a multi-level parking lot handling vehicle entry, spot allocations, ticket generation, and fee calculation upon departure. Scalability target: 5 floors, concurrent gate check-ins."
                  className="w-full p-3 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] font-sans text-xs focus:outline-none focus:border-[#38bdf8] leading-relaxed"
                />
              </section>

              {/* SECTION 2: Assumptions */}
              <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#38bdf8] text-xs font-bold">SECTION 02 //</span>
                    <h3 className="font-sans font-bold text-sm text-[#f8fafc]">Assumptions</h3>
                  </div>
                  <span className="text-[10px] text-[#64748b]">{assumptions.length} STATED</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAssumption}
                    onChange={(e) => setNewAssumption(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAssumption())}
                    placeholder="e.g. Compact spots cannot accommodate large trucks; standard cash/card payments only."
                    className="flex-1 h-8 px-3 rounded bg-[#0f141c] border border-[#263244] text-xs text-[#f8fafc] font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleAddAssumption}
                    className="px-3.5 py-1 text-xs font-mono font-medium rounded bg-[#1e293b] hover:bg-[#263348] text-[#38bdf8] border border-[#263244]"
                  >
                    + Add Assumption
                  </button>
                </div>

                {assumptions.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {assumptions.map((assump, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-[#0f141c] border border-[#263244] flex items-center justify-between text-xs font-sans text-[#dee2ee]"
                      >
                        <span>• {assump}</span>
                        <button
                          onClick={() => setAssumptions(assumptions.filter((_, i) => i !== idx))}
                          className="text-[#f43f5e] font-mono text-xs hover:underline pl-3"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* SECTION 3: Classes & Interfaces */}
              <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#38bdf8] text-xs font-bold">SECTION 03 //</span>
                    <h3 className="font-sans font-bold text-sm text-[#f8fafc]">
                      Classes &amp; Entities ({classes.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingClass(null);
                      setClassModalOpen(true);
                    }}
                    className="px-3 py-1 text-xs font-mono font-bold rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors"
                  >
                    + Add Class / Interface
                  </button>
                </div>

                {classes.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#263244] rounded bg-[#0f141c]/50 text-xs font-mono text-[#64748b]">
                    No classes defined yet. Click "+ Add Class / Interface" to define your object model.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {classes.map((cls) => {
                      const isSource =
                        hoveredRel &&
                        hoveredRel.fromClass?.trim().toLowerCase() === cls.name?.trim().toLowerCase();
                      const isTarget =
                        hoveredRel &&
                        hoveredRel.toClass?.trim().toLowerCase() === cls.name?.trim().toLowerCase();
                      const isLinked = isSource || isTarget;

                      return (
                        <div
                          key={cls.id}
                          className={`p-3.5 rounded bg-[#0f141c] border transition-all duration-200 flex flex-col justify-between space-y-3 animate-fade-in-up ${
                            isLinked
                              ? 'ring-2 ring-[#38bdf8] border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.25)] scale-[1.015] bg-[#162032]'
                              : 'border-[#263244] hover:border-[#38bdf8]/40'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between font-mono text-xs">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[10px] text-[#38bdf8] bg-[#1e293b] px-1.5 py-0.5 rounded border border-[#263244]">
                                  &lt;&lt;{cls.type.toLowerCase()}&gt;&gt;
                                </span>
                                {isLinked && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 animate-pulse font-bold">
                                    {isSource ? '◀ SOURCE LINK' : '▶ TARGET LINK'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingClass(cls);
                                    setClassModalOpen(true);
                                  }}
                                  className="text-[#38bdf8] hover:underline text-[11px]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(cls.id)}
                                  className="text-[#f43f5e] hover:underline text-[11px]"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <h4 className="font-sans font-bold text-sm text-[#f8fafc]">{cls.name}</h4>

                            <p className="text-[11px] text-[#94a3b8] font-sans leading-relaxed">
                              <strong className="text-[#64748b] font-mono text-[10px] block uppercase">
                                RESPONSIBILITY:
                              </strong>
                              {cls.responsibility}
                            </p>

                            {cls.methods.length > 0 && (
                              <div className="text-[10px] font-mono text-[#dee2ee] bg-[#161e2e] p-2 rounded border border-[#263244] space-y-0.5">
                                {cls.methods.map((m, mIdx) => (
                                  <div key={mIdx}>
                                    + <span className="text-[#38bdf8]">{m.name}</span>({(m.parameters || []).join(', ')}): <span className="text-[#10b981]">{m.returnType}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {cls.dependencies.length > 0 && (
                              <div className="text-[10px] font-mono text-[#64748b] flex flex-wrap gap-1">
                                <span>DEPS:</span>
                                {cls.dependencies.map((d, dIdx) => (
                                  <span
                                    key={dIdx}
                                    className="text-[#dee2ee] bg-[#1e293b] px-1 rounded border border-[#263244]"
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* SECTION 4: Relationships */}
              <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#38bdf8] text-xs font-bold">SECTION 04 //</span>
                    <h3 className="font-sans font-bold text-sm text-[#f8fafc]">
                      Relationships ({relationships.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRel(null);
                      setRelModalOpen(true);
                    }}
                    className="px-3 py-1 text-xs font-mono font-bold rounded bg-[#1e293b] hover:bg-[#263348] text-[#38bdf8] border border-[#263244] transition-colors"
                  >
                    + Add Relationship
                  </button>
                </div>

                {relationships.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-[#263244] rounded bg-[#0f141c]/50 text-xs font-mono text-[#64748b]">
                    No relationships connected yet. e.g. ParkingLot CONTAINS Level; ParkingLot USES PricingStrategy.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {relationships.map((rel) => {
                      const isHovered = hoveredRel?.id === rel.id;
                      return (
                        <div
                          key={rel.id}
                          onMouseEnter={() => setHoveredRel(rel)}
                          onMouseLeave={() => setHoveredRel(null)}
                          className={`p-3 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono transition-all duration-200 animate-fade-in-up ${
                            isHovered
                              ? 'bg-[#1e293b] border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)] ring-1 ring-[#38bdf8]'
                              : 'bg-[#0f141c] border-[#263244] hover:border-[#38bdf8]/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-[#38bdf8] font-bold">{rel.fromClass}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] border border-[#263244]">
                              {rel.type}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#a855f7] border border-[#263244] font-bold">
                              {rel.multiplicity || '1:1'}
                            </span>
                            <span className="text-[#f8fafc] font-bold">{rel.toClass}</span>
                            <span className="text-[#64748b] hidden md:inline">—</span>
                            <span className="text-[#94a3b8] font-sans text-xs hidden md:inline">
                              {rel.rationale}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {isHovered && (
                              <span className="text-[10px] text-[#38bdf8] font-mono mr-1 hidden sm:inline">
                                ➔ HIGHLIGHTING SCHEMATIC
                              </span>
                            )}
                            <button
                              onClick={() => {
                                setEditingRel(rel);
                                setRelModalOpen(true);
                              }}
                              className="text-[#38bdf8] hover:underline text-[11px]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRelationship(rel.id)}
                              className="text-[#f43f5e] hover:underline text-[11px]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* SECTION 5: Design Decisions & Trade-offs */}
              <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#38bdf8] text-xs font-bold">SECTION 05 //</span>
                    <h3 className="font-sans font-bold text-sm text-[#f8fafc]">
                      Design Decisions &amp; Trade-offs
                    </h3>
                  </div>
                  <button
                    onClick={handleAddDecision}
                    className="px-3 py-1 text-xs font-mono font-medium rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] border border-[#263244]"
                  >
                    + Add Trade-off
                  </button>
                </div>

                <div className="space-y-3">
                  {designDecisions.map((dec, idx) => (
                    <div
                      key={dec.id}
                      className="p-3 rounded bg-[#0f141c] border border-[#263244] hover:border-[#38bdf8]/40 space-y-2 animate-fade-in-up transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={dec.title}
                          onChange={(e) => {
                            const updated = [...designDecisions];
                            updated[idx].title = e.target.value;
                            setDesignDecisions(updated);
                          }}
                          placeholder="Decision Title (e.g. Strategy Pattern for Pricing)"
                          className="font-bold text-xs text-[#38bdf8] bg-transparent border-b border-transparent focus:border-[#38bdf8] focus:outline-none w-2/3"
                        />
                        <button
                          onClick={() => setDesignDecisions(designDecisions.filter((_, i) => i !== idx))}
                          className="text-[#f43f5e] font-mono text-xs hover:underline"
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <textarea
                          rows={2}
                          value={dec.decision}
                          onChange={(e) => {
                            const updated = [...designDecisions];
                            updated[idx].decision = e.target.value;
                            setDesignDecisions(updated);
                          }}
                          placeholder="What decision or abstraction did you choose?"
                          className="p-2 rounded bg-[#161e2e] border border-[#263244] text-[#dee2ee] font-sans focus:outline-none focus:border-[#38bdf8]/50 transition-colors"
                        />
                        <textarea
                          rows={2}
                          value={dec.rationale}
                          onChange={(e) => {
                            const updated = [...designDecisions];
                            updated[idx].rationale = e.target.value;
                            setDesignDecisions(updated);
                          }}
                          placeholder="What was the rationale? What alternative was rejected?"
                          className="p-2 rounded bg-[#161e2e] border border-[#263244] text-[#dee2ee] font-sans focus:outline-none focus:border-[#38bdf8]/50 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 6: Edge Cases */}
              <section className="border border-[#263244] bg-[#161e2e] rounded p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#263244] pb-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#38bdf8] text-xs font-bold">SECTION 06 //</span>
                    <h3 className="font-sans font-bold text-sm text-[#f8fafc]">
                      Edge Cases &amp; Concurrency
                    </h3>
                  </div>
                  <button
                    onClick={handleAddEdgeCase}
                    className="px-3 py-1 text-xs font-mono font-medium rounded bg-[#1e293b] hover:bg-[#263348] text-[#dee2ee] border border-[#263244]"
                  >
                    + Add Edge Case
                  </button>
                </div>

                <div className="space-y-3">
                  {edgeCases.map((edge, idx) => (
                    <div
                      key={edge.id}
                      className="p-3 rounded bg-[#0f141c] border border-[#263244] hover:border-[#f59e0b]/40 space-y-2 animate-fade-in-up transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#f59e0b]">
                          SCENARIO #{idx + 1}
                        </span>
                        <button
                          onClick={() => setEdgeCases(edgeCases.filter((_, i) => i !== idx))}
                          className="text-[#f43f5e] font-mono text-xs hover:underline"
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <textarea
                          rows={2}
                          value={edge.scenario}
                          onChange={(e) => {
                            const updated = [...edgeCases];
                            updated[idx].scenario = e.target.value;
                            setEdgeCases(updated);
                          }}
                          placeholder="What failure mode or race condition could occur? (e.g. Simultaneous spot claim)"
                          className="p-2 rounded bg-[#161e2e] border border-[#263244] text-[#dee2ee] font-sans focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
                        />
                        <textarea
                          rows={2}
                          value={edge.expectedBehavior}
                          onChange={(e) => {
                            const updated = [...edgeCases];
                            updated[idx].expectedBehavior = e.target.value;
                            setEdgeCases(updated);
                          }}
                          placeholder="Expected handling & atomic mitigation strategy"
                          className="p-2 rounded bg-[#161e2e] border border-[#263244] text-[#dee2ee] font-sans focus:outline-none focus:border-[#f59e0b]/50 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>

        {/* RIGHT COLUMN: Design Inspector & Review Readiness */}
        <DesignInspector
          signals={inspection.signals}
          readinessScore={inspection.readinessScore}
          totalSignals={inspection.totalSignals}
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          onSaveDraft={saveDraft}
          onSubmitReview={() => setPreFlightOpen(true)}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Modals */}
      <ClassEditorModal
        isOpen={classModalOpen}
        initialClass={editingClass}
        onSave={handleSaveClass}
        onClose={() => setClassModalOpen(false)}
      />

      <RelationshipEditorModal
        isOpen={relModalOpen}
        availableClasses={classes.map((c) => c.name)}
        initialRelationship={editingRel}
        onSave={handleSaveRelationship}
        onClose={() => setRelModalOpen(false)}
      />

      <PreFlightModal
        isOpen={preFlightOpen}
        problemTitle={problem?.title || 'Problem'}
        attemptNumber={attempt?.attemptNumber || 1}
        payload={payloadRef.current}
        inspection={inspection}
        onClose={() => setPreFlightOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

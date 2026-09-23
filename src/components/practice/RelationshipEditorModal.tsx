'use client';

import React, { useState, useEffect } from 'react';
import { Relationship, RelationshipType } from '@/domain/submission/types';

interface RelationshipEditorModalProps {
  isOpen: boolean;
  availableClasses: string[];
  initialRelationship?: Relationship | null;
  onSave: (relationship: Relationship) => void;
  onClose: () => void;
}

export const RelationshipEditorModal: React.FC<RelationshipEditorModalProps> = ({
  isOpen,
  availableClasses,
  initialRelationship,
  onSave,
  onClose,
}) => {
  const [fromClass, setFromClass] = useState(
    initialRelationship?.fromClass || availableClasses[0] || ''
  );
  const [toClass, setToClass] = useState(
    initialRelationship?.toClass || availableClasses[1] || availableClasses[0] || ''
  );
  const [type, setType] = useState<RelationshipType>(
    initialRelationship?.type || 'USES'
  );
  const [multiplicity, setMultiplicity] = useState(
    initialRelationship?.multiplicity || '1:1'
  );
  const [rationale, setRationale] = useState(initialRelationship?.rationale || '');

  // Reset form whenever modal opens or initialRelationship changes
  useEffect(() => {
    if (isOpen) {
      if (initialRelationship) {
        setFromClass(initialRelationship.fromClass || availableClasses[0] || '');
        setToClass(initialRelationship.toClass || availableClasses[1] || availableClasses[0] || '');
        setType(initialRelationship.type || 'USES');
        setMultiplicity(initialRelationship.multiplicity || '1:1');
        setRationale(initialRelationship.rationale || '');
      } else {
        setFromClass(availableClasses[0] || '');
        setToClass(availableClasses[1] || availableClasses[0] || '');
        setType('USES');
        setMultiplicity('1:1');
        setRationale('');
      }
    }
  }, [isOpen, initialRelationship, availableClasses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromClass.trim() || !toClass.trim()) return;

    onSave({
      id: initialRelationship?.id || `rel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fromClass: fromClass.trim(),
      toClass: toClass.trim(),
      type,
      multiplicity: multiplicity.trim(),
      rationale: rationale.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md border border-[#303e54] bg-[#161e2e] rounded-md shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#263244] bg-[#1e293b]/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#38bdf8] font-mono text-sm">//</span>
            <h2 className="font-sans font-bold text-base text-[#f8fafc]">
              {initialRelationship ? 'EDIT RELATIONSHIP' : 'CONNECT ARCHITECTURAL ENTITIES'}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#f8fafc] text-sm font-mono px-2">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#64748b] uppercase block mb-1">SOURCE ENTITY (FROM)</label>
              {availableClasses.length > 0 ? (
                <select
                  value={fromClass}
                  onChange={(e) => setFromClass(e.target.value)}
                  className="w-full h-8 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc]"
                >
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={fromClass}
                  onChange={(e) => setFromClass(e.target.value)}
                  placeholder="e.g. ParkingLot"
                  className="w-full h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc]"
                />
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] uppercase block mb-1">TARGET ENTITY (TO)</label>
              {availableClasses.length > 0 ? (
                <select
                  value={toClass}
                  onChange={(e) => setToClass(e.target.value)}
                  className="w-full h-8 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc]"
                >
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={toClass}
                  onChange={(e) => setToClass(e.target.value)}
                  placeholder="e.g. Level"
                  className="w-full h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc]"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#64748b] uppercase block mb-1">RELATIONSHIP TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RelationshipType)}
                className="w-full h-8 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc]"
              >
                <option value="CONTAINS">CONTAINS (Composite / Has-A)</option>
                <option value="USES">USES (Association / Dep Inj)</option>
                <option value="IMPLEMENTS">IMPLEMENTS (Interface)</option>
                <option value="EXTENDS">EXTENDS (Inheritance)</option>
                <option value="DEPENDS_ON">DEPENDS_ON (Dependency)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] uppercase block mb-1">MULTIPLICITY / CARDINALITY</label>
              <select
                value={multiplicity}
                onChange={(e) => setMultiplicity(e.target.value)}
                className="w-full h-8 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc]"
              >
                <option value="1:1">1:1 (One-to-One)</option>
                <option value="1:N">1:N (One-to-Many)</option>
                <option value="N:1">N:1 (Many-to-One)</option>
                <option value="M:N">M:N (Many-to-Many)</option>
                <option value="0..1">0..1 (Optional One)</option>
                <option value="1..*">1..* (One or More)</option>
                <option value="*">* (Unbounded)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#64748b] uppercase block mb-1">
              ARCHITECTURAL RATIONALE
            </label>
            <textarea
              required
              rows={2}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Why does this relationship exist? What coupling trade-off is accepted?"
              className="w-full p-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] font-sans text-xs focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          <div className="pt-3 border-t border-[#263244] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold"
            >
              Save Relationship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

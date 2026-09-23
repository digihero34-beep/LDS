'use client';

import React, { useState, useEffect } from 'react';
import { ClassDesign, ClassType, MethodDefinition } from '@/domain/submission/types';

interface ClassEditorModalProps {
  isOpen: boolean;
  initialClass?: ClassDesign | null;
  onSave: (classDesign: ClassDesign) => void;
  onClose: () => void;
}

export const ClassEditorModal: React.FC<ClassEditorModalProps> = ({
  isOpen,
  initialClass,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialClass?.name || '');
  const [type, setType] = useState<ClassType>(initialClass?.type || 'CLASS');
  const [responsibility, setResponsibility] = useState(initialClass?.responsibility || '');
  const [dependenciesStr, setDependenciesStr] = useState(
    (initialClass?.dependencies || []).join(', ')
  );
  const [notes, setNotes] = useState(initialClass?.notes || '');

  // Methods list state
  const [methods, setMethods] = useState<MethodDefinition[]>(
    initialClass?.methods || []
  );
  const [methodName, setMethodName] = useState('');
  const [methodParams, setMethodParams] = useState('');
  const [methodReturnType, setMethodReturnType] = useState('void');

  // Reset form whenever modal opens or initialClass changes
  useEffect(() => {
    if (isOpen) {
      if (initialClass) {
        setName(initialClass.name || '');
        setType(initialClass.type || 'CLASS');
        setResponsibility(initialClass.responsibility || '');
        setDependenciesStr((initialClass.dependencies || []).join(', '));
        setNotes(initialClass.notes || '');
        setMethods(initialClass.methods || []);
      } else {
        setName('');
        setType('CLASS');
        setResponsibility('');
        setDependenciesStr('');
        setNotes('');
        setMethods([]);
      }
      setMethodName('');
      setMethodParams('');
      setMethodReturnType('void');
    }
  }, [isOpen, initialClass]);

  if (!isOpen) return null;

  const handleAddMethod = () => {
    if (!methodName.trim()) return;
    const parsedParams = methodParams
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    setMethods([
      ...methods,
      {
        name: methodName.trim(),
        returnType: methodReturnType.trim() || 'void',
        parameters: parsedParams,
      },
    ]);
    setMethodName('');
    setMethodParams('');
    setMethodReturnType('void');
  };

  const handleRemoveMethod = (index: number) => {
    setMethods(methods.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const deps = dependenciesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      id: initialClass?.id || `cls-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      type,
      responsibility: responsibility.trim(),
      methods,
      dependencies: deps,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg border border-[#303e54] bg-[#161e2e] rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#263244] bg-[#1e293b]/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#38bdf8] font-mono text-sm">//</span>
            <h2 className="font-sans font-bold text-base text-[#f8fafc]">
              {initialClass ? 'EDIT ENTITY SPECIFICATION' : 'NEW CLASS / INTERFACE'}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#f8fafc] text-sm font-mono px-2">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Name & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#64748b] uppercase block mb-1">ENTITY NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ParkingLot"
                className="w-full h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] uppercase block mb-1">STEREOTYPE / TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ClassType)}
                className="w-full h-8 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="CLASS">&lt;&lt;class&gt;&gt; Concrete Class</option>
                <option value="INTERFACE">&lt;&lt;interface&gt;&gt; Interface</option>
                <option value="ABSTRACT_CLASS">&lt;&lt;abstract&gt;&gt; Abstract Class</option>
              </select>
            </div>
          </div>

          {/* Responsibility */}
          <div>
            <label className="text-[10px] text-[#64748b] uppercase block mb-1">
              SINGLE RESPONSIBILITY (SRP)
            </label>
            <textarea
              required
              rows={2}
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              placeholder="What single, cohesive responsibility does this object own?"
              className="w-full p-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] font-sans text-xs focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Methods Section */}
          <div>
            <label className="text-[10px] text-[#64748b] uppercase block mb-1">
              METHODS &amp; OPERATIONS
            </label>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <input
                type="text"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                placeholder="Method (e.g. park)"
                className="col-span-5 h-7 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] text-xs focus:outline-none focus:border-[#38bdf8]"
              />
              <input
                type="text"
                value={methodParams}
                onChange={(e) => setMethodParams(e.target.value)}
                placeholder="Params (e.g. Vehicle)"
                className="col-span-4 h-7 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] text-xs focus:outline-none focus:border-[#38bdf8]"
              />
              <input
                type="text"
                value={methodReturnType}
                onChange={(e) => setMethodReturnType(e.target.value)}
                placeholder="Return type"
                className="col-span-2 h-7 px-2 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] text-xs focus:outline-none focus:border-[#38bdf8]"
              />
              <button
                type="button"
                onClick={handleAddMethod}
                className="col-span-1 h-7 flex items-center justify-center text-xs font-bold bg-[#1e293b] hover:bg-[#263348] text-[#38bdf8] border border-[#263244] rounded"
                title="Add Method"
              >
                +
              </button>
            </div>

            {methods.length > 0 && (
              <div className="p-2 rounded bg-[#0f141c] border border-[#263244] space-y-1 max-h-32 overflow-y-auto">
                {methods.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-[#dee2ee]">
                    <span>
                      + <span className="text-[#38bdf8]">{m.name}</span>({(m.parameters || []).join(', ')}): <span className="text-[#10b981]">{m.returnType}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMethod(idx)}
                      className="text-[#f43f5e] hover:underline"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dependencies */}
          <div>
            <label className="text-[10px] text-[#64748b] uppercase block mb-1">
              DEPENDENCIES (COMMA-SEPARATED)
            </label>
            <input
              type="text"
              value={dependenciesStr}
              onChange={(e) => setDependenciesStr(e.target.value)}
              placeholder="e.g. Level, PricingStrategy, Ticket"
              className="w-full h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-[#64748b] uppercase block mb-1">ARCHITECTURAL NOTES</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Injected via constructor; implements OCP"
              className="w-full h-8 px-2.5 rounded bg-[#0f141c] border border-[#263244] text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>

          {/* Actions */}
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
              Save Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

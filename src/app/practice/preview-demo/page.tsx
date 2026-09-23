'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PreviewDemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Mounting Demo Architecture Workbench...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initDemo() {
      try {
        setStatus('Loading Parking Lot problem specification...');
        const probRes = await fetch('/api/problems');
        const probData = await probRes.json();
        const problems = probData.data || [];
        const parkingLot = problems.find((p: any) => p.slug === 'parking-lot') || problems[0];

        if (!parkingLot) {
          throw new Error('Problem specification not found.');
        }

        setStatus('Initializing interactive session...');
        const attRes = await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problemId: parkingLot.id }),
        });
        const attData = await attRes.json();
        if (!attData.success) {
          throw new Error(attData.error || 'Failed to initialize session');
        }

        const attemptId = attData.data.attempt.id;

        setStatus('Populating sample architecture blueprint...');
        const demoPayload = {
          requirementsUnderstanding:
            'Design a multi-level parking lot management system handling entry, exit, spot allocation by vehicle type, ticket calculation, and payment processing.',
          assumptions: [
            'Compact spots cannot accommodate large trucks or buses.',
            'Standard automated payment terminals at all exit gates.',
          ],
          classes: [
            {
              id: 'cls-demo-1',
              name: 'ParkingLot',
              type: 'CLASS',
              responsibility: 'Coordinates parking floors, entrances, exits, and ticket issuance.',
              methods: [
                {
                  name: 'findAvailableSpot',
                  returnType: 'ParkingSpot',
                  parameters: ['vehicleType: VehicleType'],
                },
                {
                  name: 'issueTicket',
                  returnType: 'ParkingTicket',
                  parameters: ['vehicle: Vehicle'],
                },
              ],
              dependencies: ['Level', 'PricingStrategy'],
            },
            {
              id: 'cls-demo-2',
              name: 'Level',
              type: 'CLASS',
              responsibility: 'Maintains parking spots on a floor and tracks real-time capacity.',
              methods: [
                {
                  name: 'allocateSpot',
                  returnType: 'ParkingSpot',
                  parameters: ['type: VehicleType'],
                },
              ],
              dependencies: ['ParkingSpot'],
            },
            {
              id: 'cls-demo-3',
              name: 'PricingStrategy',
              type: 'INTERFACE',
              responsibility: 'Defines tariff calculation contract decoupled from parking lot lifecycle.',
              methods: [
                {
                  name: 'calculateFee',
                  returnType: 'number',
                  parameters: ['ticket: ParkingTicket', 'durationHours: number'],
                },
              ],
              dependencies: [],
            },
          ],
          relationships: [
            {
              id: 'rel-demo-1',
              fromClass: 'ParkingLot',
              toClass: 'Level',
              type: 'CONTAINS',
              multiplicity: '1:N',
              rationale: 'Parking lot manages multiple parking levels.',
            },
            {
              id: 'rel-demo-2',
              fromClass: 'ParkingLot',
              toClass: 'PricingStrategy',
              type: 'USES',
              multiplicity: '1:1',
              rationale: 'Delegates fee calculation to interchangeable pricing strategy.',
            },
          ],
          designDecisions: [
            {
              id: 'dec-demo-1',
              title: 'Strategy Pattern for Dynamic Pricing',
              decision: 'Extracted fee calculation to PricingStrategy interface.',
              rationale:
                'Decoupled billing logic from floor routing, allowing surge/flat pricing without modifying ParkingLot.',
            },
          ],
          edgeCases: [
            {
              id: 'edge-demo-1',
              scenario: 'Concurrent entry requests when only 1 spot remains.',
              expectedBehavior:
                'Atomic spot lock / compare-and-swap with rollback, gracefully redirecting second vehicle.',
            },
          ],
        };

        await fetch(`/api/attempts/${attemptId}/draft`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(demoPayload),
        });

        // Redirect to practice workspace
        router.replace(`/practice/${attemptId}`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to launch demo');
      }
    }

    initDemo();
  }, [router]);

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 font-mono text-xs text-[#f43f5e] bg-[#0f141c]">
        <div>{error}</div>
        <button
          onClick={() => router.push('/problems')}
          className="text-[#38bdf8] hover:underline"
        >
          ← Return to Problem Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f141c] bg-workbench-grid flex flex-col items-center justify-center p-8 space-y-4 font-mono text-xs text-[#94a3b8]">
      <div className="w-8 h-8 rounded-full border-2 border-[#38bdf8] border-t-transparent animate-spin" />
      <div className="text-[#f8fafc] font-bold">{status}</div>
      <div className="text-[11px] text-[#64748b]">ENGINEERING DESIGN REVIEW WORKBENCH</div>
    </div>
  );
}

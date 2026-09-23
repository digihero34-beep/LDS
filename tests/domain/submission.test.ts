import { describe, expect, it } from 'vitest';
import { Submission } from '../../src/domain/submission/Submission';

describe('Submission Domain Invariants', () => {
  it('validates a correct submission with unique classes and valid relationships', () => {
    const submission = new Submission(
      'sub-1',
      'att-1',
      1,
      'Designing a multi-floor parking lot system with vehicle hierarchy',
      ['Only small and medium vehicles on Level 1'],
      [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Coordinates entry, exit, and floor assignments',
          methods: [{ name: 'parkVehicle', returnType: 'Ticket', parameters: ['Vehicle'] }],
          dependencies: ['Level', 'PricingStrategy'],
        },
        {
          id: 'cls-2',
          name: 'Level',
          type: 'CLASS',
          responsibility: 'Tracks parking spots on a single floor',
          methods: [{ name: 'findAvailableSpot', returnType: 'ParkingSpot', parameters: ['VehicleType'] }],
          dependencies: ['ParkingSpot'],
        },
      ],
      [
        {
          id: 'rel-1',
          fromClass: 'ParkingLot',
          toClass: 'Level',
          type: 'CONTAINS',
          rationale: 'A parking lot has multiple floors/levels',
        },
      ],
      [
        {
          id: 'dec-1',
          title: 'Strategy Pattern for Pricing',
          decision: 'Extract fee calculation into PricingStrategy',
          rationale: 'Permits dynamic hourly and vehicle-specific rates without modifying ParkingLot',
        },
      ],
      [
        {
          id: 'edge-1',
          scenario: 'Lot is 100% full',
          expectedBehavior: 'Reject entry ticket request and illuminate FULL sign',
        },
      ]
    );

    const validation = submission.validateInvariants();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('detects case-insensitive duplicate class names', () => {
    const submission = new Submission(
      'sub-2',
      'att-1',
      1,
      'Requirements text',
      [],
      [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Main controller',
          methods: [],
          dependencies: [],
        },
        {
          id: 'cls-2',
          name: 'parkinglot',
          type: 'CLASS',
          responsibility: 'Duplicate lot',
          methods: [],
          dependencies: [],
        },
      ],
      [],
      [],
      []
    );

    const validation = submission.validateInvariants();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("Duplicate class name detected: 'parkinglot'")])
    );
  });

  it('detects relationship pointing to unknown class', () => {
    const submission = new Submission(
      'sub-3',
      'att-1',
      1,
      'Requirements text',
      [],
      [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Main controller',
          methods: [],
          dependencies: [],
        },
      ],
      [
        {
          id: 'rel-1',
          fromClass: 'ParkingLot',
          toClass: 'NonExistentClass',
          type: 'USES',
          rationale: 'Missing dependency target',
        },
      ],
      [],
      []
    );

    const validation = submission.validateInvariants();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("Relationship references unknown destination class 'NonExistentClass'")])
    );
  });

  it('detects classes without responsibilities', () => {
    const submission = new Submission(
      'sub-4',
      'att-1',
      1,
      'Requirements text',
      [],
      [
        {
          id: 'cls-1',
          name: 'Ticket',
          type: 'CLASS',
          responsibility: '',
          methods: [],
          dependencies: [],
        },
      ],
      [],
      [],
      []
    );

    const validation = submission.validateInvariants();
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toEqual(
      expect.arrayContaining([expect.stringContaining("Class 'Ticket' has no defined responsibility")])
    );
  });
});

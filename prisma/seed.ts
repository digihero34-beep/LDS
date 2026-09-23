import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LLD Practice Platform database...');

  // Clean existing records
  await prisma.feedback.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.attempt.deleteMany({});
  await prisma.problem.deleteMany({});
  await prisma.rubricRecord.deleteMany({});

  // 1. Seed Rubric
  await prisma.rubricRecord.create({
    data: {
      id: 'rubric-lld-core-v1',
      version: 'v1.0.0',
      name: 'Standard Low-Level Design Engineering Rubric',
      dimensions: JSON.stringify([
        { id: 'REQUIREMENT_UNDERSTANDING', name: 'Requirement Understanding', weight: 15 },
        { id: 'RESPONSIBILITY_BOUNDARIES', name: 'Responsibility Boundaries', weight: 20 },
        { id: 'COUPLING_COHESION', name: 'Coupling & Cohesion', weight: 15 },
        { id: 'ENCAPSULATION_INTERFACES', name: 'Encapsulation & Interfaces', weight: 10 },
        { id: 'ABSTRACTION_PATTERNS', name: 'Abstraction & Design Patterns', weight: 10 },
        { id: 'EXTENSIBILITY', name: 'Extensibility & Open-Closed', weight: 15 },
        { id: 'EDGE_CASES', name: 'Edge Cases & Reliability', weight: 10 },
        { id: 'EXPLANATION_QUALITY', name: 'Explanation & Trade-off Quality', weight: 5 },
      ]),
      active: true,
    },
  });

  // 2. Seed 4 Problems
  const parkingLot = await prisma.problem.create({
    data: {
      id: 'prob-parking-lot',
      slug: 'parking-lot',
      title: 'Design a Parking Lot',
      difficulty: 'MEDIUM',
      estimatedMinutes: 35,
      summary:
        'Architect a multi-level parking facility supporting various vehicle types, automated ticketing, dynamic pricing, and concurrent space allocation.',
      requirements: JSON.stringify([
        {
          id: 'req-1',
          category: 'FUNCTIONAL',
          description: 'The parking lot consists of multiple floors/levels with designated spots (Compact, Regular, Large, Electric).',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-2',
          category: 'FUNCTIONAL',
          description: 'Support multiple entry and exit gates where tickets are issued upon arrival and scanned upon departure.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-3',
          category: 'FUNCTIONAL',
          description: 'Calculate parking fees based on duration and vehicle classification with configurable pricing strategies.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-4',
          category: 'SCALE',
          description: 'Handle concurrent spot allocations safely so two drivers cannot be assigned the same parking spot simultaneously.',
          priority: 'SHOULD_HAVE',
        },
        {
          id: 'req-5',
          category: 'FUNCTIONAL',
          description: 'Display real-time availability boards at entrances per floor and spot category.',
          priority: 'SHOULD_HAVE',
        },
      ]),
      constraints: JSON.stringify([
        { id: 'con-1', type: 'MEMORY', description: 'In-memory state representation with clear domain isolation.' },
        { id: 'con-2', type: 'SOLID', description: 'Decouple fee calculations from core parking lot orchestration.' },
        { id: 'con-3', type: 'EXTENSIBILITY', description: 'Must support introducing new vehicle types without modifying existing classes.' },
      ]),
      skills: JSON.stringify(['Object-Oriented Design', 'Strategy Pattern', 'State Management', 'Concurrency Boundaries']),
      evaluationHints: JSON.stringify([
        'Ensure ParkingLot is not a God Object doing spot search, ticketing, and pricing.',
        'Use Strategy pattern for dynamic pricing calculations.',
        'Model spots and vehicles as clean hierarchies with polymorphism.',
      ]),
      active: true,
    },
  });

  const elevatorSystem = await prisma.problem.create({
    data: {
      id: 'prob-elevator-system',
      slug: 'elevator-system',
      title: 'Design an Elevator System',
      difficulty: 'HARD',
      estimatedMinutes: 45,
      summary:
        'Model a coordinated bank of multiple elevators servicing a high-rise building, balancing wait times, energy efficiency, and direction dispatching.',
      requirements: JSON.stringify([
        {
          id: 'req-1',
          category: 'FUNCTIONAL',
          description: 'A bank of N elevators servicing M floors with external hall buttons (UP/DOWN) and internal destination panels.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-2',
          category: 'FUNCTIONAL',
          description: 'Dispatcher algorithm to assign the optimal elevator car to an incoming hall request (e.g. SCAN / LOOK algorithm).',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-3',
          category: 'NON_FUNCTIONAL',
          description: 'Car capacity and weight limit enforcement with maintenance and emergency mode states.',
          priority: 'SHOULD_HAVE',
        },
      ]),
      constraints: JSON.stringify([
        { id: 'con-1', type: 'STATE', description: 'Model Elevator state machine explicitly (IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN).' },
        { id: 'con-2', type: 'ALGORITHM', description: 'Pluggable dispatching strategy to support various traffic optimization rules.' },
      ]),
      skills: JSON.stringify(['State Pattern', 'Strategy Pattern', 'Request Queueing', 'Concurrent Dispatching']),
      evaluationHints: JSON.stringify([
        'Decouple ElevatorCar mechanics from Dispatcher orchestration.',
        'Represent states as explicit State pattern classes or finite transitions.',
      ]),
      active: true,
    },
  });

  const vendingMachine = await prisma.problem.create({
    data: {
      id: 'prob-vending-machine',
      slug: 'vending-machine',
      title: 'Design a Vending Machine',
      difficulty: 'EASY',
      estimatedMinutes: 25,
      summary:
        'Implement the internal control system for an automated vending machine handling inventory selection, coin/card transactions, and item dispensing.',
      requirements: JSON.stringify([
        {
          id: 'req-1',
          category: 'FUNCTIONAL',
          description: 'Support item selection by code, inventory tracking, and out-of-stock validation.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-2',
          category: 'FUNCTIONAL',
          description: 'Accept multiple payment currencies/denominations, track inserted balance, and dispense exact change.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-3',
          category: 'FUNCTIONAL',
          description: 'Allow transaction cancellation with immediate refund of inserted balance prior to dispense.',
          priority: 'MUST_HAVE',
        },
      ]),
      constraints: JSON.stringify([
        { id: 'con-1', type: 'STATE', description: 'Strict State Pattern: ReadyState, DispensingState, CoinInsertedState, SoldOutState.' },
        { id: 'con-2', type: 'TRANSACTION', description: 'All-or-nothing item dispensing and money collection semantics.' },
      ]),
      skills: JSON.stringify(['State Pattern', 'Encapsulation', 'Inventory Management', 'Transaction Semantics']),
      evaluationHints: JSON.stringify([
        'Avoid massive switch-case statements in VendingMachine by delegating actions to State objects.',
        'Ensure exact change algorithm accounts for available coin tray denominations.',
      ]),
      active: true,
    },
  });

  const notificationService = await prisma.problem.create({
    data: {
      id: 'prob-notification-service',
      slug: 'notification-service',
      title: 'Design a Notification Service',
      difficulty: 'MEDIUM',
      estimatedMinutes: 35,
      summary:
        'Architect a multi-channel alerting and notification platform supporting SMS, Email, and Push providers with templating, rate limiting, and failover.',
      requirements: JSON.stringify([
        {
          id: 'req-1',
          category: 'FUNCTIONAL',
          description: 'Dispatch notifications across multiple channels (Email, SMS, Push Notification) with vendor failover.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-2',
          category: 'FUNCTIONAL',
          description: 'Dynamic message template rendering with localized variable substitutions.',
          priority: 'MUST_HAVE',
        },
        {
          id: 'req-3',
          category: 'NON_FUNCTIONAL',
          description: 'Per-user and per-channel rate limiting and user notification opt-in/opt-out preferences.',
          priority: 'SHOULD_HAVE',
        },
      ]),
      constraints: JSON.stringify([
        { id: 'con-1', type: 'EXTENSIBILITY', description: 'Add new third-party vendors (e.g. Twilio, SendGrid) without changing dispatch core.' },
        { id: 'con-2', type: 'RELIABILITY', description: 'Provider retry policy and dead-letter handling for failed deliveries.' },
      ]),
      skills: JSON.stringify(['Adapter Pattern', 'Template Method', 'Strategy Pattern', 'Rate Limiting']),
      evaluationHints: JSON.stringify([
        'Wrap vendor SDKs behind channel adapters with uniform interfaces.',
        'Use Strategy pattern for vendor selection and failover routing.',
      ]),
      active: true,
    },
  });

  // 3. Seed Demonstrable History for Parking Lot (Attempts #01 and #02)
  console.log('Seeding demonstrable attempt progression for Parking Lot...');

  // Attempt #01: Initial attempt with coupled fee calculation
  const attempt1 = await prisma.attempt.create({
    data: {
      id: 'att-parking-lot-01',
      problemId: parkingLot.id,
      attemptNumber: 1,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      submittedAt: new Date(Date.now() - 86400000 * 2 + 1800000),
      completedAt: new Date(Date.now() - 86400000 * 2 + 1830000),
    },
  });

  const sub1 = await prisma.submission.create({
    data: {
      id: 'sub-parking-lot-01',
      attemptId: attempt1.id,
      version: 1,
      requirementsUnderstanding: 'Basic parking lot system handling entry, spot allocation, and hourly payment.',
      assumptions: JSON.stringify(['Single hourly rate applies to all cars.', 'Payment is collected in cash or card at the gate.']),
      classes: JSON.stringify([
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Controls parking spots, issues tickets, and calculates customer fees.',
          methods: [
            { name: 'parkVehicle', returnType: 'Ticket', parameters: ['Vehicle'] },
            { name: 'unparkVehicle', returnType: 'void', parameters: ['Ticket'] },
            { name: 'calculateFee', returnType: 'double', parameters: ['Ticket', 'long hours'] },
          ],
          dependencies: ['ParkingSpot', 'Ticket'],
          notes: 'Fee calculation logic is written directly inside ParkingLot.',
        },
        {
          id: 'cls-2',
          name: 'ParkingSpot',
          type: 'CLASS',
          responsibility: 'Maintains occupied state and spot number.',
          methods: [
            { name: 'occupy', returnType: 'void', parameters: ['Vehicle'] },
            { name: 'vacate', returnType: 'void', parameters: [] },
          ],
          dependencies: ['Vehicle'],
        },
        {
          id: 'cls-3',
          name: 'Ticket',
          type: 'CLASS',
          responsibility: 'Stores entry timestamp and vehicle number.',
          methods: [{ name: 'getDuration', returnType: 'long', parameters: [] }],
          dependencies: [],
        },
      ]),
      relationships: JSON.stringify([
        { id: 'rel-1', fromClass: 'ParkingLot', toClass: 'ParkingSpot', type: 'CONTAINS', rationale: 'Parking lot manages spots.' },
        { id: 'rel-2', fromClass: 'ParkingLot', toClass: 'Ticket', type: 'USES', rationale: 'Issues tickets upon entry.' },
      ]),
      designDecisions: JSON.stringify([
        {
          id: 'dec-1',
          title: 'Direct Fee Calculation',
          decision: 'Placed fee formula inside ParkingLot.calculateFee()',
          rationale: 'Simple to access ticket timestamps and hourly rate in one place.',
        },
      ]),
      edgeCases: JSON.stringify([
        { id: 'edge-1', scenario: 'Parking lot is full', expectedBehavior: 'Return null ticket.' },
      ]),
    },
  });

  const eval1 = await prisma.evaluation.create({
    data: {
      id: 'eval-parking-lot-01',
      attemptId: attempt1.id,
      submissionId: sub1.id,
      evaluatorType: 'HYBRID_ENGINE_V1',
      rubricVersion: 'v1.0.0',
      status: 'COMPLETED',
      summary: 'Initial architecture established core entity relations, but violates SRP by bundling fee calculations in ParkingLot.',
      strengths: JSON.stringify(['Clean entry/exit ticketing lifecycle', 'Direct spot state management']),
      priorityImprovements: JSON.stringify([
        'Extract fee calculation from ParkingLot into a dedicated PricingStrategy boundary.',
        'Decompose parking spots into Level containers to support multi-floor facilities.',
      ]),
      startedAt: new Date(Date.now() - 86400000 * 2 + 1805000),
      completedAt: new Date(Date.now() - 86400000 * 2 + 1830000),
    },
  });

  await prisma.feedback.createMany({
    data: [
      {
        id: 'fb-1-1',
        evaluationId: eval1.id,
        criterion: 'Responsibility Boundaries',
        rating: 'NEEDS_ATTENTION',
        score: 6.0,
        assessment: 'ParkingLot carries multiple unrelated responsibilities including spatial coordination and financial billing.',
        evidence: 'ParkingLot.calculateFee(Ticket, long hours)',
        whyItMatters: 'Bundling pricing rules inside the main orchestration class couples business billing policies to spatial operations.',
        concern: 'Changing pricing tariffs, weekend discounts, or vehicle surcharges requires editing and re-testing the core parking lot coordinator.',
        suggestion: 'Introduce a separate PricingStrategy interface and inject pricing policies into fee processing.',
        confidence: 'HIGH',
      },
      {
        id: 'fb-1-2',
        evaluationId: eval1.id,
        criterion: 'Coupling & Cohesion',
        rating: 'NEEDS_ATTENTION',
        score: 6.5,
        assessment: 'Direct coupling between ParkingLot and specific spot types without floor or level grouping.',
        evidence: 'ParkingLot contains ParkingSpot[] directly',
        whyItMatters: 'Large parking structures require hierarchical querying (Level -> Spot) rather than a flat global array.',
        concern: 'Cannot scale to multi-floor navigation or display boards per floor.',
        suggestion: 'Introduce a Level abstraction between ParkingLot and ParkingSpot.',
        confidence: 'HIGH',
      },
      {
        id: 'fb-1-3',
        evaluationId: eval1.id,
        criterion: 'Requirement Understanding',
        rating: 'ADEQUATE',
        score: 7.5,
        assessment: 'Core requirements for parking and ticketing are satisfied, but multi-floor specifications were omitted.',
        evidence: 'Assumptions and classes assume single flat lot',
        whyItMatters: 'Failing to model levels makes capacity tracking per gate harder.',
        concern: 'Floor-based capacity is missing.',
        suggestion: 'Add Level domain entity and multi-floor spot allocation.',
        confidence: 'MEDIUM',
      },
    ],
  });

  // Attempt #02: Refactored with Strategy pattern and Level hierarchy
  const attempt2 = await prisma.attempt.create({
    data: {
      id: 'att-parking-lot-02',
      problemId: parkingLot.id,
      attemptNumber: 2,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      submittedAt: new Date(Date.now() - 86400000 * 1 + 2100000),
      completedAt: new Date(Date.now() - 86400000 * 1 + 2130000),
    },
  });

  const sub2 = await prisma.submission.create({
    data: {
      id: 'sub-parking-lot-02',
      attemptId: attempt2.id,
      version: 1,
      requirementsUnderstanding:
        'Multi-level parking structure with pluggable pricing strategies, vehicle polymorphism, and floor-level space allocation.',
      assumptions: JSON.stringify([
        'Vehicle types: Compact, Regular, Electric.',
        'Pricing strategies vary by duration (Flat hourly, Peak-time surge).',
        'Levels maintain local capacity counters.',
      ]),
      classes: JSON.stringify([
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Top-level facade coordinating multi-floor space searches and ticket operations.',
          methods: [
            { name: 'parkVehicle', returnType: 'Ticket', parameters: ['Vehicle'] },
            { name: 'unparkVehicle', returnType: 'Receipt', parameters: ['Ticket'] },
            { name: 'findAvailableSpot', returnType: 'ParkingSpot', parameters: ['VehicleType'] },
          ],
          dependencies: ['Level', 'PricingStrategy', 'Ticket'],
          notes: 'Fee calculation now delegates to PricingStrategy.',
        },
        {
          id: 'cls-2',
          name: 'Level',
          type: 'CLASS',
          responsibility: 'Tracks parking spots on a single floor and updates floor display panel.',
          methods: [
            { name: 'findSpot', returnType: 'ParkingSpot', parameters: ['VehicleType'] },
            { name: 'isFull', returnType: 'boolean', parameters: [] },
          ],
          dependencies: ['ParkingSpot'],
        },
        {
          id: 'cls-3',
          name: 'ParkingSpot',
          type: 'ABSTRACT_CLASS',
          responsibility: 'Represents an individual physical space with spot type compatibility checks.',
          methods: [
            { name: 'canFitVehicle', returnType: 'boolean', parameters: ['Vehicle'] },
            { name: 'occupy', returnType: 'void', parameters: ['Vehicle'] },
            { name: 'vacate', returnType: 'void', parameters: [] },
          ],
          dependencies: ['Vehicle'],
        },
        {
          id: 'cls-4',
          name: 'PricingStrategy',
          type: 'INTERFACE',
          responsibility: 'Contract for calculating parking cost given duration and vehicle type.',
          methods: [{ name: 'calculateFee', returnType: 'double', parameters: ['long durationMinutes', 'VehicleType'] }],
          dependencies: [],
          notes: 'Enables Open-Closed principle for future pricing rules.',
        },
        {
          id: 'cls-5',
          name: 'HourlyPricingStrategy',
          type: 'CLASS',
          responsibility: 'Concrete implementation calculating standard tiered hourly fee.',
          methods: [{ name: 'calculateFee', returnType: 'double', parameters: ['long durationMinutes', 'VehicleType'] }],
          dependencies: [],
        },
        {
          id: 'cls-6',
          name: 'Ticket',
          type: 'CLASS',
          responsibility: 'Immutable token recording entry time, assigned spot, and vehicle ID.',
          methods: [{ name: 'getDuration', returnType: 'long', parameters: [] }],
          dependencies: [],
        },
      ]),
      relationships: JSON.stringify([
        { id: 'rel-1', fromClass: 'ParkingLot', toClass: 'Level', type: 'CONTAINS', rationale: 'ParkingLot has multiple Level floors.' },
        { id: 'rel-2', fromClass: 'Level', toClass: 'ParkingSpot', type: 'CONTAINS', rationale: 'Level aggregates individual spots.' },
        { id: 'rel-3', fromClass: 'ParkingLot', toClass: 'PricingStrategy', type: 'USES', rationale: 'Delegates fee calculation.' },
        { id: 'rel-4', fromClass: 'HourlyPricingStrategy', toClass: 'PricingStrategy', type: 'IMPLEMENTS', rationale: 'Concrete strategy.' },
      ]),
      designDecisions: JSON.stringify([
        {
          id: 'dec-1',
          title: 'Strategy Pattern for Billing',
          decision: 'Extracted fee calculation into PricingStrategy interface.',
          rationale: 'Decoupled billing logic from floor routing, enabling surge and EV charging tariffs without changing ParkingLot.',
        },
        {
          id: 'dec-2',
          title: 'Hierarchical Level Structure',
          decision: 'Added Level container between ParkingLot and ParkingSpot.',
          rationale: 'Allows floor-specific queries and entry gate display boards.',
        },
      ]),
      edgeCases: JSON.stringify([
        { id: 'edge-1', scenario: 'All compact spots full, large spots available', expectedBehavior: 'Allow compact vehicle in large spot per policy.' },
        { id: 'edge-2', scenario: 'Lost ticket scenario', expectedBehavior: 'Fallback to maximum daily flat rate fee.' },
        { id: 'edge-3', scenario: 'Concurrency race on spot allocation', expectedBehavior: 'Synchronized spot occupancy check with atomic compare-and-set.' },
      ]),
    },
  });

  const eval2 = await prisma.evaluation.create({
    data: {
      id: 'eval-parking-lot-02',
      attemptId: attempt2.id,
      submissionId: sub2.id,
      evaluatorType: 'HYBRID_ENGINE_V1',
      rubricVersion: 'v1.0.0',
      status: 'COMPLETED',
      summary:
        'Significant architectural improvement over Attempt #01. Successfully decoupled pricing policy into Strategy pattern and established clean Level hierarchy.',
      strengths: JSON.stringify([
        'Excellent application of Strategy pattern for fee calculations',
        'Clean separation of ParkingLot coordination vs Level floor operations',
        'Well-thought-out edge case analysis including lost tickets and race conditions',
      ]),
      priorityImprovements: JSON.stringify([
        'Consider introducing an EntryGate and ExitGate abstraction for physical barrier telemetry.',
        'Refine spot assignment algorithm for nearest-to-elevator preference.',
      ]),
      startedAt: new Date(Date.now() - 86400000 * 1 + 2105000),
      completedAt: new Date(Date.now() - 86400000 * 1 + 2130000),
    },
  });

  await prisma.feedback.createMany({
    data: [
      {
        id: 'fb-2-1',
        evaluationId: eval2.id,
        criterion: 'Responsibility Boundaries',
        rating: 'STRONG',
        score: 9.0,
        assessment: 'Clear single-responsibility boundaries across all major components.',
        evidence: 'ParkingLot delegates fee computation to PricingStrategy and spot tracking to Level.',
        whyItMatters: 'Classes can evolve independently without regressions across domains.',
        concern: 'Minimal: Entry/Exit gate operations could be further isolated if physical gate hardware is modeled.',
        suggestion: 'Maintain this level of modular boundary separation in subsequent designs.',
        confidence: 'HIGH',
      },
      {
        id: 'fb-2-2',
        evaluationId: eval2.id,
        criterion: 'Coupling & Cohesion',
        rating: 'STRONG',
        score: 8.5,
        assessment: 'ParkingLot couples strictly to the PricingStrategy abstraction rather than concrete billing rules.',
        evidence: 'ParkingLot USES PricingStrategy; HourlyPricingStrategy IMPLEMENTS PricingStrategy',
        whyItMatters: 'Complies with Dependency Inversion Principle (DIP).',
        concern: 'None observed.',
        suggestion: 'Can easily add an EvChargingPricingStrategy without altering ParkingLot.',
        confidence: 'HIGH',
      },
      {
        id: 'fb-2-3',
        evaluationId: eval2.id,
        criterion: 'Extensibility & Open-Closed',
        rating: 'STRONG',
        score: 9.0,
        assessment: 'Extensibility is demonstrated by polymorphic Spot types and Strategy billing.',
        evidence: 'ParkingSpot abstract class allows ElectricParkingSpot and HandicappedParkingSpot extensions.',
        whyItMatters: 'New requirements will not induce breaking changes.',
        concern: 'None.',
        suggestion: 'Ready for production architecture review.',
        confidence: 'HIGH',
      },
      {
        id: 'fb-2-4',
        evaluationId: eval2.id,
        criterion: 'Edge Cases & Reliability',
        rating: 'ADEQUATE',
        score: 8.0,
        assessment: 'Addressed lost ticket, compact spillover, and concurrency contention.',
        evidence: '3 well-formulated edge cases with mitigations.',
        whyItMatters: 'Anticipating real-world operational anomalies ensures reliable runtime behavior.',
        concern: 'Could specify exact locking primitive (e.g. Pessimistic lock vs Optimistic lock).',
        suggestion: 'Specify lock mechanism in design notes.',
        confidence: 'HIGH',
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

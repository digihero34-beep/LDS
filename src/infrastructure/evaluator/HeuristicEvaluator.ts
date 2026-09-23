import { CriterionFeedback, CriterionRating, EvaluationResult } from '@/domain/evaluation/types';
import { EvaluationInput, Evaluator } from '@/domain/evaluator/Evaluator';

export class HeuristicEvaluator implements Evaluator {
  public readonly name = 'HEURISTIC_EVALUATOR_V1';

  public async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const { problem, submission, rubric } = input;
    const classes = submission.classes || [];
    const relationships = submission.relationships || [];
    const decisions = submission.designDecisions || [];
    const edgeCases = submission.edgeCases || [];

    const classNames = classes.map((c) => c.name);
    const hasInterface = classes.some((c) => c.type === 'INTERFACE' || c.type === 'ABSTRACT_CLASS');
    const implementsRelations = relationships.filter((r) => r.type === 'IMPLEMENTS');

    // Detect coupled responsibilities in Parking Lot or similar problems
    const parkingLotClass = classes.find((c) => c.name.toLowerCase().includes('parkinglot'));
    const feeCalculationInLot = parkingLotClass?.methods.some((m) =>
      m.name.toLowerCase().includes('fee') || m.name.toLowerCase().includes('price') || m.name.toLowerCase().includes('cost')
    );
    const hasPricingStrategy = classes.some(
      (c) => c.name.toLowerCase().includes('pricing') || c.name.toLowerCase().includes('fare') || c.name.toLowerCase().includes('tariff')
    );
    const hasLevelOrFloor = classes.some((c) => c.name.toLowerCase().includes('level') || c.name.toLowerCase().includes('floor'));

    const criteriaFeedback: CriterionFeedback[] = [];

    // 1. Requirement Understanding
    const reqText = submission.requirementsUnderstanding || '';
    const hasSufficientReq = reqText.length > 50;
    criteriaFeedback.push({
      id: 'fb-req-understanding',
      criterion: 'Requirement Understanding',
      rating: hasSufficientReq ? 'STRONG' : 'ADEQUATE',
      score: hasSufficientReq ? 8.5 : 7.0,
      assessment: hasSufficientReq
        ? 'Captured the primary operational flows, core actors, and lifecycle constraints.'
        : 'Requirement scope outlined at a high level, but operational boundaries could be more detailed.',
      evidence: reqText.length > 0 ? `Captured: "${reqText.slice(0, 75)}..."` : 'Minimal requirements captured.',
      whyItMatters: 'Clear requirement scoping prevents over-engineering and aligns entity models with real business needs.',
      concern: hasSufficientReq ? 'None observed.' : 'Implicit assumptions about scale and concurrent operations remain unstated.',
      suggestion: 'Document non-functional targets (such as maximum floors, concurrency peak, and gate counts).',
      confidence: 'HIGH',
    });

    // 2. Responsibility Boundaries (SRP)
    if (feeCalculationInLot && !hasPricingStrategy) {
      criteriaFeedback.push({
        id: 'fb-responsibility',
        criterion: 'Responsibility Boundaries',
        rating: 'NEEDS_ATTENTION',
        score: 6.0,
        assessment: `${parkingLotClass?.name} orchestrates parking operations while also executing pricing calculations.`,
        evidence: `${parkingLotClass?.name}.${parkingLotClass?.methods.find((m) => m.name.toLowerCase().includes('fee'))?.name || 'calculateFee'}()`,
        whyItMatters: 'Bundling pricing rules into the primary coordinator class couples spatial orchestration to financial policies.',
        concern: 'Modifying tariffs, peak surge prices, or EV charging costs requires modifying and re-testing the main coordinator.',
        suggestion: 'Extract fee calculation into a dedicated PricingStrategy interface and inject it into the coordinator.',
        confidence: 'HIGH',
      });
    } else {
      criteriaFeedback.push({
        id: 'fb-responsibility',
        criterion: 'Responsibility Boundaries',
        rating: 'STRONG',
        score: 9.0,
        assessment: 'Clear modular decomposition with distinct entity responsibilities across core objects.',
        evidence: `${classes.length} distinct classes (${classNames.slice(0, 3).join(', ')}) with focused method allocations.`,
        whyItMatters: 'Single Responsibility Principle guarantees classes can be tested, refactored, and maintained in isolation.',
        concern: 'None observed.',
        suggestion: 'Continue to enforce strict boundary separation between state management and business calculations.',
        confidence: 'HIGH',
      });
    }

    // 3. Coupling & Cohesion
    if (hasInterface && implementsRelations.length > 0) {
      criteriaFeedback.push({
        id: 'fb-coupling-cohesion',
        criterion: 'Coupling & Cohesion',
        rating: 'STRONG',
        score: 8.5,
        assessment: 'Demonstrated loose coupling by programming to interfaces and abstract types.',
        evidence: `${implementsRelations.length} relationship(s) utilizing IMPLEMENTS/EXTENDS: ${implementsRelations.map((r) => `${r.fromClass} -> ${r.toClass}`).join(', ')}`,
        whyItMatters: 'Adhering to the Dependency Inversion Principle ensures high-level policies do not depend on low-level implementation details.',
        concern: 'None.',
        suggestion: 'Consider dependency injection in the factory or initialization layer.',
        confidence: 'HIGH',
      });
    } else {
      criteriaFeedback.push({
        id: 'fb-coupling-cohesion',
        criterion: 'Coupling & Cohesion',
        rating: 'NEEDS_ATTENTION',
        score: 6.5,
        assessment: 'Direct concrete coupling across entity boundaries without interface abstractions.',
        evidence: `All ${classes.length} classes are concrete implementations.`,
        whyItMatters: 'Concrete coupling restricts polymorphism and makes unit testing require full concrete instances.',
        concern: 'Difficult to swap alternative algorithms or mock dependencies during test execution.',
        suggestion: 'Introduce interface abstractions for pluggable subsystems (such as pricing, dispatching, or notifications).',
        confidence: 'HIGH',
      });
    }

    // 4. Encapsulation & Interfaces
    criteriaFeedback.push({
      id: 'fb-encapsulation',
      criterion: 'Encapsulation & Interfaces',
      rating: hasInterface ? 'STRONG' : 'ADEQUATE',
      score: hasInterface ? 8.5 : 7.0,
      assessment: hasInterface
        ? 'Well-defined public method signatures and contract boundaries.'
        : 'Method signatures exposed; internal state could benefit from clearer access contract definitions.',
      evidence: `${classes.reduce((acc, c) => acc + c.methods.length, 0)} total method signatures defined across ${classes.length} classes.`,
      whyItMatters: 'Proper encapsulation hides internal data representation and preserves invariant stability.',
      concern: 'Ensure getters/setters do not leak mutable internal collections directly to external callers.',
      suggestion: 'Return unmodifiable views or immutable snapshots for internal state queries.',
      confidence: 'MEDIUM',
    });

    // 5. Abstraction & Design Patterns
    const patternMentioned = decisions.some((d) =>
      d.title.toLowerCase().includes('pattern') || d.decision.toLowerCase().includes('pattern') || d.decision.toLowerCase().includes('strategy')
    );
    criteriaFeedback.push({
      id: 'fb-patterns',
      criterion: 'Abstraction & Design Patterns',
      rating: patternMentioned || hasInterface ? 'STRONG' : 'ADEQUATE',
      score: patternMentioned ? 9.0 : 7.0,
      assessment: patternMentioned
        ? 'Intentional application of design patterns to solve concrete architectural trade-offs.'
        : 'Functional design without explicit pattern abstractions.',
      evidence: patternMentioned
        ? decisions.map((d) => d.title).join('; ')
        : 'Direct class-to-class interactions without formalized design pattern roles.',
      whyItMatters: 'Design patterns offer battle-tested vocabularies for handling variation without ad-hoc conditional branching.',
      concern: patternMentioned ? 'Ensure patterns are not added purely for decorative complexity.' : 'Potential risk of switch-case branching for future variants.',
      suggestion: 'Evaluate whether Strategy or State patterns would simplify conditional logic in subsequent iterations.',
      confidence: 'HIGH',
    });

    // 6. Extensibility
    const isExtensible = hasInterface || hasPricingStrategy;
    criteriaFeedback.push({
      id: 'fb-extensibility',
      criterion: 'Extensibility & Open-Closed',
      rating: isExtensible ? 'STRONG' : 'NEEDS_ATTENTION',
      score: isExtensible ? 8.5 : 6.5,
      assessment: isExtensible
        ? 'Extensible architecture allowing new types and policies to be introduced with minimal code changes.'
        : 'Adding new rules or item types currently requires modifying existing concrete classes.',
      evidence: isExtensible
        ? 'Extensibility supported through polymorphic interfaces and separate strategy entities.'
        : 'Classes require direct modification to add new vehicle types, spot categories, or pricing formulas.',
      whyItMatters: 'Open-Closed Principle (OCP) ensures that adding business features does not trigger regression bugs in stable workflows.',
      concern: isExtensible ? 'None.' : 'High regression risk during future feature additions.',
      suggestion: 'Introduce abstract base classes or Strategy interfaces to facilitate drop-in additions.',
      confidence: 'HIGH',
    });

    // 7. Edge Cases & Reliability
    const hasConcurrencyEdgeCase = edgeCases.some((e) =>
      e.scenario.toLowerCase().includes('concurren') || e.scenario.toLowerCase().includes('race') || e.scenario.toLowerCase().includes('simultaneous')
    );
    criteriaFeedback.push({
      id: 'fb-edge-cases',
      criterion: 'Edge Cases & Reliability',
      rating: edgeCases.length >= 2 ? (hasConcurrencyEdgeCase ? 'STRONG' : 'ADEQUATE') : 'INCOMPLETE',
      score: edgeCases.length >= 2 ? 8.0 : 5.5,
      assessment: edgeCases.length >= 2
        ? `Identified ${edgeCases.length} concrete edge case scenario(s) including boundary and failure behaviors.`
        : 'Edge-case analysis is limited or incomplete.',
      evidence: edgeCases.length > 0 ? edgeCases.map((e) => e.scenario).join('; ') : 'No edge cases documented.',
      whyItMatters: 'Software architectures fail most frequently at boundary conditions, capacity limits, and unexpected failure modes.',
      concern: hasConcurrencyEdgeCase ? 'None.' : 'Concurrency contention (two requests claiming the same slot) is unaddressed.',
      suggestion: 'Document concurrency control mechanisms (such as optimistic locking or mutex synchronization) for spot claims.',
      confidence: 'HIGH',
    });

    // 8. Explanation Quality
    criteriaFeedback.push({
      id: 'fb-explanation',
      criterion: 'Explanation & Trade-off Quality',
      rating: decisions.length > 0 ? 'STRONG' : 'ADEQUATE',
      score: decisions.length > 0 ? 8.5 : 6.5,
      assessment: decisions.length > 0
        ? 'Captured deliberate architectural trade-offs with rationales.'
        : 'Rationale for chosen decomposition could be expanded.',
      evidence: decisions.length > 0 ? `${decisions.length} trade-off(s) articulated: ${decisions.map((d) => d.title).join(', ')}` : 'No explicit trade-offs documented.',
      whyItMatters: 'Senior engineering is defined by understanding trade-offs between simplicity, performance, and flexibility.',
      concern: 'None.',
      suggestion: 'Continue to document why alternative approaches were rejected.',
      confidence: 'HIGH',
    });

    // Synthesize Strengths and Priority Improvements
    const strengths: string[] = [];
    const priorityImprovements: string[] = [];

    if (hasInterface) strengths.push('Clean interface-driven abstractions separating contract from implementation');
    if (classes.length >= 3) strengths.push(`Well-structured entity decomposition across ${classes.length} distinct domain classes`);
    if (decisions.length >= 1) strengths.push('Clear articulation of architectural trade-offs in design decisions');
    if (strengths.length === 0) strengths.push('Core domain model covers initial problem requirements');

    if (feeCalculationInLot && !hasPricingStrategy) {
      priorityImprovements.push('Extract fee calculation from ParkingLot into a dedicated PricingStrategy boundary');
    }
    if (!hasInterface) {
      priorityImprovements.push('Introduce interfaces for pluggable behaviors to adhere to the Dependency Inversion Principle');
    }
    if (!hasConcurrencyEdgeCase) {
      priorityImprovements.push('Specify concurrency and locking semantics for simultaneous resource allocation');
    }
    if (priorityImprovements.length === 0) {
      priorityImprovements.push('Consider adding factory or builder patterns for complex entity initialization');
    }

    return {
      evaluatorType: this.name,
      rubricVersion: rubric.version,
      summary: `Design evaluated against 8 dimensions of the LLD Engineering Rubric. Identified ${strengths.length} key strength(s) and ${priorityImprovements.length} architectural area(s) for refinement.`,
      strengths,
      priorityImprovements,
      criteria: criteriaFeedback,
    };
  }
}

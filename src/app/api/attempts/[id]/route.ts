import { attemptRepository, evaluationRepository, submissionRepository } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attempt = await attemptRepository.findById(params.id);
    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    const submission = await submissionRepository.findByAttemptId(params.id);
    const evaluation = await evaluationRepository.findByAttemptId(params.id);

    return NextResponse.json({
      success: true,
      data: {
        attempt: attempt.toSnapshot(),
        submission: submission ? submission.toSnapshot() : null,
        evaluation: evaluation ? evaluation.toSnapshot() : null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch attempt';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { evaluationRepository } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await evaluationRepository.findByAttemptId(params.id);
    if (!evaluation) {
      return NextResponse.json({ success: false, error: 'Evaluation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: evaluation.toSnapshot() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch evaluation';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { retryEvaluationUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evaluation = await retryEvaluationUseCase.execute(params.id);
    return NextResponse.json({ success: true, data: evaluation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Retry failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

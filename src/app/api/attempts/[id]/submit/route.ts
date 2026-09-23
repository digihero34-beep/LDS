import { submitAttemptUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await submitAttemptUseCase.execute(params.id, body);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Submission failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

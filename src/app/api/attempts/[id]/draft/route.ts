import { saveDraftUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const submission = await saveDraftUseCase.execute(params.id, body);
    return NextResponse.json({ success: true, data: submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save draft';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

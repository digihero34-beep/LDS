import { getAttemptHistoryUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const history = await getAttemptHistoryUseCase.execute(params.id);
    return NextResponse.json({ success: true, data: history });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch attempt history';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { getProblemByIdUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problem = await getProblemByIdUseCase.execute(params.id);
    if (!problem) {
      return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: problem });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch problem';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

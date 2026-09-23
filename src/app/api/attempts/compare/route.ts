import { compareAttemptsUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { success: false, error: "Both 'from' and 'to' query parameters are required." },
        { status: 400 }
      );
    }

    const comparison = await compareAttemptsUseCase.execute(from, to);
    return NextResponse.json({ success: true, data: comparison });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Comparison failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

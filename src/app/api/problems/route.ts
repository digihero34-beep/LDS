import { getProblemsUseCase } from '@/infrastructure/services';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const problems = await getProblemsUseCase.execute();
    return NextResponse.json({ success: true, data: problems });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch problems';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

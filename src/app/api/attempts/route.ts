import { createAttemptUseCase } from '@/infrastructure/services';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateAttemptSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateAttemptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const result = await createAttemptUseCase.execute(parsed.data.problemId);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create attempt';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

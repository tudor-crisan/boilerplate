import { trackEvent } from '@/libs/modules/boards/analytics';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { boardId } = await req.json();
    if (boardId) {
      await trackEvent(boardId, "VIEW");
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

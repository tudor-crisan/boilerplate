import { trackEvent } from "@/modules/boards/libs/analytics";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { boardId } = await req.json();
    if (boardId) {
      await trackEvent(boardId, "VIEW");
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

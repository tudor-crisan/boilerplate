import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ success: false, error: "Video module not available" }, { status: 501 });
}

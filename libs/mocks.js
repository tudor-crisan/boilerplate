import { NextResponse } from "next/server";

export function mockSuccessBoard() {
  return NextResponse.json(
    { message: "Board save successfully" },
    { status: 200 }
  );
}

export function mockErrorBoard() {
  return NextResponse.json(
    { error: "Not authorized", errors: { name: "This is required" } },
    { status: 401 }
  );
}

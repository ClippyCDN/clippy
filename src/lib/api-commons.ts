import { NextResponse } from "next/server";

export const authError = NextResponse.json(
  { message: "Invalid Credentials" },
  { status: 401 }
);

export const notFound = NextResponse.json(
  { message: "Not Found" },
  { status: 404 }
);

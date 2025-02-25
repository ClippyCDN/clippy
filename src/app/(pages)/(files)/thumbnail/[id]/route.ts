import { notFound } from "@/lib/api-commons";
import { storage } from "@/storage/create-storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id } = await params;

  const thumbnail = await storage.getFile(id);
  if (!thumbnail) {
    return notFound;
  }

  return new Response(thumbnail, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

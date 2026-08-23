import { NextResponse } from "next/server";
import { getPageBySlug } from "@/db/queries/pages";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPageBySlug(slug);
  if (!result) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}

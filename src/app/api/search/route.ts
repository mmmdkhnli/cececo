import { NextResponse } from "next/server";
import { searchSite } from "@/db/queries/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = q.trim() ? await searchSite(q, 4) : [];
  return NextResponse.json({ results });
}

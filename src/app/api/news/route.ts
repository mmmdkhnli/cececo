import { NextResponse } from "next/server";
import { getNewsPage, NEWS_PAGE_SIZE } from "@/db/queries/blog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0);

  const { posts, hasMore } = await getNewsPage({ offset, limit: NEWS_PAGE_SIZE, month });
  return NextResponse.json({ posts, hasMore });
}

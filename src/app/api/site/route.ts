import { NextResponse } from "next/server";
import { getSiteSettings, getNavbarLinks, getFooterGroups } from "@/db/queries/site";

export async function GET() {
  const [settings, navbar, footer] = await Promise.all([
    getSiteSettings(),
    getNavbarLinks(),
    getFooterGroups(),
  ]);

  return NextResponse.json({ settings, navbar, footer });
}

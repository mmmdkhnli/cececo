import { NextResponse } from "next/server";
import { getSiteSettings, getNavbarLinks, getFooterGroups } from "@/db/queries/site";

// BFF endpoint: global chrome data (logo, navbar, footer) for any consumer
// (this Next.js app's own layout, or a future separate admin dashboard).
export async function GET() {
  const [settings, navbar, footer] = await Promise.all([
    getSiteSettings(),
    getNavbarLinks(),
    getFooterGroups(),
  ]);

  return NextResponse.json({ settings, navbar, footer });
}

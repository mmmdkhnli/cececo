import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../schema";
import { page, section } from "../schema";

/**
 * Creates the About → Structure page (CECECO_Structure_Page_Mini_BRD). Only facts stated in the BRD
 * are used; attendee / participant lists and anything else from the source materials are left for
 * the Secretariat to fill in through the admin. Safe to re-run: does nothing if the page exists.
 * The page is created as a draft — publish it from Admin → Pages → Structure after review.
 *
 *   npx tsx src/db/seed/structure.ts
 */
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema, mode: "default" });

  const [existing] = await db.select({ id: page.id }).from(page).where(eq(page.slug, "structure"));
  if (existing) {
    console.log("Structure page already exists — nothing to do.");
    await pool.end();
    return;
  }

  // Reuse the About page's hero image so the page keeps the site's existing look.
  const [aboutHero] = await db
    .select({ backgroundImage: section.backgroundImage })
    .from(section)
    .innerJoin(page, eq(page.id, section.pageId))
    .where(and(eq(page.slug, "about"), eq(section.componentKey, "page-hero")));

  const [created] = await db
    .insert(page)
    .values({
      slug: "structure",
      title: "Structure",
      metaDescription:
        "The governance structure of the Economic Cooperation Organization Clean Energy Center (CECECO) under its Charter.",
      status: "draft",
    })
    .$returningId();

  const pageId = created.id;
  const body = "scheme-2" as const;

  await db.insert(section).values([
    {
      pageId,
      componentKey: "page-hero",
      scheme: "scheme-1",
      order: 0,
      heading: "Governance Structure",
      subtitle:
        "<p>How the Economic Cooperation Organization Clean Energy Center (CECECO) is governed under its Charter.</p>",
      backgroundImage: aboutHero?.backgroundImage ?? null,
    },
    {
      pageId,
      componentKey: "governance-overview",
      scheme: body,
      order: 1,
      eyebrow: "CECECO Charter · Article IV",
      heading: "Four governance bodies",
      subtitle:
        "<p>The Economic Cooperation Organization Clean Energy Center (CECECO) operates in accordance with its Charter. Article IV of the Charter establishes four governance bodies: the Board of Governors, the Executive Board, the Technical Committee and the Secretariat.</p>",
    },
    {
      pageId,
      componentKey: "governance-body",
      scheme: body,
      order: 2,
      heading: "Board of Governors",
      eyebrow: "Charter, Article IV, paragraph 1",
      disclaimer: "The principal policy- and decision-making body of the Centre.",
      subtitle: [
        "<p>The Board of Governors is the principal policy- and decision-making body of CECECO.</p>",
        "<h3>Composition</h3>",
        "<ul><li><p>Ministers of Energy, or officials of equivalent rank, from the ECO Member States</p></li><li><p>The ECO Secretary General</p></li><li><p>The Executive Director of CECECO</p></li></ul>",
        "<h3>Meetings</h3>",
        "<p>The Board of Governors meets annually, on a rotational basis among the Member States.</p>",
      ].join(""),
    },
    {
      pageId,
      componentKey: "governance-meeting",
      scheme: body,
      order: 3,
      eyebrow: "First meeting",
      heading: "First meeting of the Board of Governors",
      subtitle:
        "<p>At its first meeting, the Board of Governors appointed Ms. Aysel Yagubova as the first Executive Director of CECECO.</p>",
      secondaryHeading: "Senior attendees",
    },
    {
      pageId,
      componentKey: "governance-body",
      scheme: body,
      order: 4,
      heading: "Executive Board",
      eyebrow: "Charter, Article IV, paragraph 2",
      disclaimer: "Representatives of the Contracting Parties, the ECO Secretariat and the Centre.",
      subtitle: [
        "<h3>Composition</h3>",
        "<ul><li><p>Representatives from the Contracting Parties</p></li><li><p>The ECO Secretary General or their representative</p></li><li><p>The Executive Director of CECECO</p></li></ul>",
      ].join(""),
    },
    {
      pageId,
      componentKey: "governance-meeting",
      scheme: body,
      order: 5,
      eyebrow: "14 May 2026 · Virtual meeting",
      heading: "First meeting of the Executive Board",
      subtitle: [
        "<p>The first meeting of the Executive Board was held virtually on 14 May 2026 and was chaired by Mr. Ashraf Shikhaliyev.</p>",
        "<p>The main items on the agenda were:</p>",
        "<ul><li><p>the activity report and the proposed work plan of CECECO;</p></li><li><p>the CECECO Distinction Award;</p></li><li><p>the draft Staff Regulations and draft Financial Regulations;</p></li><li><p>discussion related to COP31;</p></li><li><p>the training programme;</p></li><li><p>arrangements for the next meeting.</p></li></ul>",
      ].join(""),
      secondaryHeading: "Participating countries and institutions",
      disclaimer: "Summary based on the draft report of the 1st Meeting of the Executive Board, dated 14 May 2026.",
    },
    {
      pageId,
      componentKey: "governance-body",
      scheme: body,
      order: 6,
      heading: "Technical Committee",
      eyebrow: "Charter, Article IV, paragraph 4",
      disclaimer: "Experts and scientists in sustainable energy development.",
      subtitle: [
        "<p>The Technical Committee brings together experts and scientists in sustainable energy development.</p>",
        "<h3>Composition</h3>",
        "<p>Each Contracting Party appoints one representative to the Committee for a three-year term. Partner organizations, designated private-sector representatives and the ECO Secretariat are also represented.</p>",
      ].join(""),
    },
    {
      pageId,
      componentKey: "governance-body",
      scheme: body,
      order: 7,
      heading: "Secretariat",
      eyebrow: "Charter, Article IV, paragraph 3",
      disclaimer: "Headed by the Executive Director.",
      subtitle:
        "<p>The Secretariat is headed by the Executive Director of CECECO. It is responsible for carrying out the policies and decisions of the governing bodies and for implementing approved programmes.</p>",
    },
  ]);

  console.log(`Created Structure page (id ${pageId}) as a draft.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

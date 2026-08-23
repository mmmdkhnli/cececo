import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../schema";
import { adminUser } from "../schema";

async function main() {
  const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running this script.");
  }

  const pool = mysql.createPool({ uri: DATABASE_URL });
  const db = drizzle(pool, { schema, mode: "default" });

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const [existing] = await db.select().from(adminUser).where(eq(adminUser.email, ADMIN_EMAIL));
  if (existing) {
    await db.update(adminUser).set({ passwordHash }).where(eq(adminUser.id, existing.id));
    console.log(`Updated password for existing admin user: ${ADMIN_EMAIL}`);
  } else {
    await db.insert(adminUser).values({ email: ADMIN_EMAIL, passwordHash, name: "Admin" });
    console.log(`Created admin user: ${ADMIN_EMAIL}`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

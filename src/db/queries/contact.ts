import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { contactMethod } from "@/db/schema";

export async function getContactMethods() {
  return db.select().from(contactMethod).orderBy(asc(contactMethod.order));
}

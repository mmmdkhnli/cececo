import { and, eq, ne } from "drizzle-orm";
import type { MySqlColumn, MySqlTable } from "drizzle-orm/mysql-core";
import { db } from "@/db";
import { stripHtml } from "@/lib/utils";

const MAX_SLUG_LENGTH = 180;

const CHAR_MAP: Record<string, string> = {
  ə: "e",
  ı: "i",
  ğ: "g",
  ş: "s",
  ø: "o",
  æ: "ae",
  œ: "oe",
  ß: "ss",
  đ: "d",
  ð: "d",
  þ: "th",
  ł: "l",
  "&": " and ",
};

/** Turns a title-like value (plain text or rich text HTML) into a URL-safe slug. */
export function slugify(source: string | null | undefined) {
  return stripHtml(source)
    .toLowerCase()
    .replace(/[əığşøæœßđðþł&]/g, (char) => CHAR_MAP[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/^-+|-+$/g, "");
}

type SlugTarget = {
  table: MySqlTable;
  slugColumn: MySqlColumn;
  idColumn: MySqlColumn;
};

async function isTaken(target: SlugTarget, candidate: string, excludeId?: number) {
  const conflict = excludeId
    ? and(eq(target.slugColumn, candidate), ne(target.idColumn, excludeId))
    : eq(target.slugColumn, candidate);
  const [row] = await db.select({ id: target.idColumn }).from(target.table).where(conflict).limit(1);
  return Boolean(row);
}

/**
 * Builds a unique slug out of a record's title-like field, appending `-2`, `-3`, ... on collisions.
 *
 * Pass `current` when updating: as long as the title still slugifies to the same value, the stored
 * slug is reused so published URLs stay valid. A real title change produces a new slug.
 */
export async function resolveSlug({
  table,
  slugColumn,
  idColumn,
  source,
  fallback = "item",
  current,
}: SlugTarget & {
  source: string | null | undefined;
  fallback?: string;
  current?: { id: number; slug: string | null; source: string | null | undefined } | null;
}) {
  const base = slugify(source) || fallback;
  if (current?.slug && slugify(current.source) === slugify(source)) return current.slug;

  const target = { table, slugColumn, idColumn };
  let candidate = base;
  let suffix = 2;
  while (await isTaken(target, candidate, current?.id)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

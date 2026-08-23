import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

declare global {
  var __cececo_mysql_pool: mysql.Pool | undefined;
}

const pool =
  globalThis.__cececo_mysql_pool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__cececo_mysql_pool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });

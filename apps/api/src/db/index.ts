import { DATABASE_URL } from "@config/env.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 10_000,
});
export const db = drizzle({ client: pool, schema });
export type DB = typeof db;

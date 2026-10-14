import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseConfig } from "@config/env.js";
import * as schema from "./schema/index.js";

export const pool = new Pool(databaseConfig);
export const db = drizzle({ client: pool, schema });
export type DB = typeof db;

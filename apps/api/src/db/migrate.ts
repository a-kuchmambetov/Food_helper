import { db, pool } from "@db/index.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { resolve } from "node:path";

// Same path from src/db (tsx) and dist/db (node).
const migrationsFolder = resolve(import.meta.dirname, "../../migrations");
const migrationsTable = "food_helper_migrations";

// Drizzle applies all pending migrations in a single transaction and records
// each one's hash, so a failed run changes nothing and repeated runs are no-ops.
try {
  await migrate(db, { migrationsFolder, migrationsTable });
  console.info("Database migrations applied");
} catch (error) {
  console.error("Database migration failed", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}

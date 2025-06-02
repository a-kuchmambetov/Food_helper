import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log("🚀 Starting database migration...");

    const migrationPath = path.join(__dirname, "001_create_users_table.sql"); // Split the SQL file by statements, handling PostgreSQL functions
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Execute the entire SQL file at once to handle function definitions properly
    console.log("Executing migration SQL...");
    await query(migrationSQL);

    console.log("✅ Migration completed successfully!");
    console.log("📊 Created tables:");
    console.log("  - users");
    console.log("  - refresh_tokens");
    console.log("  - user_sessions");
    console.log("  - security_audit_log");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigration();

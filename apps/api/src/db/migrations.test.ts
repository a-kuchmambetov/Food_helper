import { PGlite } from "@electric-sql/pglite";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { it } from "node:test";

const migrationsFolder = resolve(import.meta.dirname, "../../migrations");

it("marks users created before email verification as verified", async () => {
  const client = new PGlite();
  try {
    await client.exec(
      await readFile(resolve(migrationsFolder, "0000_initial.sql"), "utf8"),
    );
    await client.query(
      `INSERT INTO "users" ("id", "name", "email", "updated_at") VALUES ('u1', 'Old User', 'old@example.com', now())`,
    );

    await client.exec(
      await readFile(
        resolve(migrationsFolder, "0001_mark_existing_users_verified.sql"),
        "utf8",
      ),
    );

    const { rows } = await client.query<{ email_verified: boolean }>(
      `SELECT "email_verified" FROM "users" WHERE "id" = 'u1'`,
    );
    assert.equal(rows[0].email_verified, true);
  } finally {
    await client.close();
  }
});

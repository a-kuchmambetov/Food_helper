import { defineConfig } from "drizzle-kit";

// Migration generation is offline. db:migrate loads the runtime connection settings.
export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
});

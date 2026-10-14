import { buildApp } from "./app.js";
import { env } from "@config/env.js";
import { pool } from "@db/index.js";

const app = await buildApp();

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, async () => {
    await app.close();
    await pool.end();
    process.exit(0);
  });
}

try {
  await app.listen({ port: env.API_PORT, host: env.API_HOST });
} catch (error) {
  app.log.error(error);
  await pool.end();
  process.exit(1);
}

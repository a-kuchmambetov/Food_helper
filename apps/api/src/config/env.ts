import { resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { z } from "zod";

try {
  loadEnvFile(resolve(import.meta.dirname, "../../../../.env"));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

const envSchema = z.object({
  // Api
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  API_HOST: z.string().default("0.0.0.0"),
  WEB_ORIGIN: z.url().default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_BASE_URL: z.url().default("http://localhost:3000/api/auth"),
  // Database
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
});

export const env = envSchema.parse(process.env);

export const DATABASE_URL = z
  .url()
  .parse(
    `postgres://${encodeURIComponent(env.POSTGRES_USER)}:${encodeURIComponent(
      env.POSTGRES_PASSWORD,
    )}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${encodeURIComponent(env.POSTGRES_DB)}`,
  );

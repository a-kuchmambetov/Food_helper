import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { z } from "zod";

// Resolve relative to this module in both src/config and dist/config.
const envPath = fileURLToPath(new URL("../../../../.env", import.meta.url));
if (existsSync(envPath)) loadEnvFile(envPath);

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    API_PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    API_HOST: z.string().default("0.0.0.0"),
    WEB_ORIGIN: z.url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_BASE_URL: z.url().default("http://localhost:3000/api/auth"),
    DATABASE_URL: z.url().optional(),
    POSTGRES_USER: z.string().default("app"),
    POSTGRES_DB: z.string().default("app"),
    POSTGRES_PASSWORD: z.string().optional(),
    POSTGRES_HOST: z.string().default("localhost"),
    POSTGRES_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
    PG_PASSWORD_FILE: z.string().optional(),
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(1025),
    SMTP_SECURE: z.enum(["true", "false"]).default("false"),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    SMTP_FROM: z.string().default("Food Helper <noreply@localhost>"),
  })
  .refine(
    (data) => {
      const hasUser = data.SMTP_USER !== undefined && data.SMTP_USER.length > 0;
      const hasPassword =
        data.SMTP_PASSWORD !== undefined && data.SMTP_PASSWORD.length > 0;
      return hasUser === hasPassword;
    },
    {
      message: "SMTP_USER and SMTP_PASSWORD must be provided together",
      path: ["SMTP_PASSWORD"],
    },
  );

export const env = envSchema.parse(process.env);



export const databaseConfig = env.DATABASE_URL
  ? { connectionString: env.DATABASE_URL }
  : {
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      database: env.POSTGRES_DB,
      user: env.POSTGRES_USER,
      password: passwordFromFile ?? env.POSTGRES_PASSWORD,
    };

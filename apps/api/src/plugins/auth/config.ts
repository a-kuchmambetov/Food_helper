import type { DB } from "@db/index.js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";

export interface AuthOptions {
  secret: string;
  baseURL: string;
  webOrigin: string;
}

export const createAuth = (database: DB, options: AuthOptions) =>
  betterAuth({
    secret: options.secret,
    baseURL: options.baseURL,
    trustedOrigins: [options.webOrigin],
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    database: drizzleAdapter(database, {
      provider: "pg",
      usePlural: true,
    }),
    plugins: [
      openAPI(),
      admin({
        defaultRole: "unapproved",
        adminRoles: ["admin"],
      }),
    ],
  });

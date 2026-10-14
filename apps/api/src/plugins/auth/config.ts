import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import type { User } from "better-auth/types";
import type { DB } from "@db/index.js";
import * as schema from "@db/schema/index.js";
import type { Mailer } from "./mailer.js";

export interface AuthOptions {
  secret: string;
  baseURL: string;
  webOrigin: string;
  mailer: Mailer;
}

export const createAuth = (database: DB, options: AuthOptions) =>
  betterAuth({
    secret: options.secret,
    baseURL: options.baseURL,
    basePath: "/api/auth",
    trustedOrigins: [options.webOrigin],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async (data: {
        user: User;
        url: string;
        token: string;
      }) => {
        const token = new URL(data.url).searchParams.get("token");
        if (!token) throw new Error("missing verification token");
        await options.mailer.sendVerificationEmail({
          user: data.user,
          url: data.url,
          token,
        });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    database: drizzleAdapter(database, {
      provider: "pg",
      schema,
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

import type { DB } from "@db/index.js";
import type { Mailer } from "@plugins/mailer/mailer.js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";

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
    trustedOrigins: [options.webOrigin],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60 * 24, // 24 hours, matches the email template
      sendVerificationEmail: async ({ user, token }) => {
        // Link to the web page instead of the API endpoint, so link scanners
        // that prefetch URLs can't consume the token.
        const url = new URL("/verify-email", options.webOrigin);
        url.searchParams.set("token", token);
        // Not awaited, so response time doesn't reveal whether an email was sent.
        void options.mailer
          .sendVerificationEmail({
            to: user.email,
            name: user.name,
            url: url.toString(),
          })
          .catch((error: unknown) => {
            console.error("Failed to send verification email", error);
          });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    rateLimit: {
      customRules: {
        "/send-verification-email": { window: 60, max: 3 },
      },
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

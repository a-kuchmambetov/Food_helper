import type { User } from "better-auth/types";
import { createTransport, type Transporter } from "nodemailer";
import type { env as envType } from "../../config/env.js";

export type MailerEnv = Pick<
  typeof envType,
  | "SMTP_HOST"
  | "SMTP_PORT"
  | "SMTP_SECURE"
  | "SMTP_USER"
  | "SMTP_PASSWORD"
  | "SMTP_FROM"
  | "WEB_ORIGIN"
>;

export interface Mailer {
  sendVerificationEmail: (data: {
    user: User;
    url: string;
    token: string;
  }) => Promise<void>;
}

export function createMailer(env: MailerEnv): Mailer {
  const transport: Transporter = createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === "true",
    auth:
      env.SMTP_USER && env.SMTP_PASSWORD
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
  });

  return {
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${env.WEB_ORIGIN}/verify-email?token=${token}`;
      await transport.sendMail({
        from: env.SMTP_FROM,
        to: user.email,
        subject: "Verify your email",
        text: `Please verify your email by opening this link: ${verificationUrl}`,
        html: `<p>Please verify your email by opening this link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
      });
    },
  };
}

export interface SentMessage {
  user: User;
  url: string;
  token: string;
}

export function createMockMailer(): Mailer & { sent: SentMessage[] } {
  const sent: SentMessage[] = [];
  return {
    sent,
    sendVerificationEmail: async (data) => {
      sent.push(data);
    },
  };
}

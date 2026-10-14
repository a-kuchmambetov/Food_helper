import type { Resend } from "resend";
import { verifyEmailTemplate } from "./templates/verify-email.js";

export interface VerificationEmail {
  to: string;
  name: string;
  url: string;
}

export interface Mailer {
  sendVerificationEmail: (data: VerificationEmail) => Promise<void>;
}

export type EmailClient = Pick<Resend, "emails">;

export function createResendMailer(client: EmailClient, from: string): Mailer {
  return {
    sendVerificationEmail: async ({ to, name, url }) => {
      const { subject, html, text } = verifyEmailTemplate({ name, url });
      const { error } = await client.emails.send({
        from,
        to,
        subject,
        html,
        text,
      });
      if (error) {
        throw new Error(`Resend failed to send email: ${error.message}`, {
          cause: error,
        });
      }
    },
  };
}

// Development fallback when RESEND_API_KEY is not set.
export function createConsoleMailer(
  log: (message: string) => void = console.info,
): Mailer {
  return {
    sendVerificationEmail: async ({ to, url }) => {
      log(`[mailer] Verification link for ${to}: ${url}`);
    },
  };
}

export function createMockMailer(): Mailer & { sent: VerificationEmail[] } {
  const sent: VerificationEmail[] = [];
  return {
    sent,
    sendVerificationEmail: async (data) => {
      sent.push(data);
    },
  };
}

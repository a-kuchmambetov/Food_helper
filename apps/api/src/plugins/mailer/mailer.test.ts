import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createConsoleMailer,
  createResendMailer,
  type EmailClient,
} from "./mailer.js";

const email = {
  to: "test@example.com",
  name: `Eve <script>alert("x")</script>`,
  url: "http://localhost:3000/verify-email?token=abc&x=1",
};

const stubClient = (result: { data: unknown; error: unknown }) => {
  const calls: Record<string, unknown>[] = [];
  const client = {
    emails: {
      send: async (payload: Record<string, unknown>) => {
        calls.push(payload);
        return result;
      },
    },
  } as unknown as EmailClient;
  return { client, calls };
};

describe("createResendMailer", () => {
  it("sends an escaped HTML and plain-text verification email", async () => {
    const { client, calls } = stubClient({ data: { id: "1" }, error: null });

    await createResendMailer(
      client,
      "Food Helper <noreply@example.com>",
    ).sendVerificationEmail(email);

    assert.equal(calls.length, 1);
    const [payload] = calls;
    assert.equal(payload.from, "Food Helper <noreply@example.com>");
    assert.equal(payload.to, "test@example.com");
    assert.match(String(payload.text), /token=abc&x=1/);
    assert.match(String(payload.html), /token=abc&amp;x=1/);
    assert.doesNotMatch(String(payload.html), /<script>/);
    assert.match(String(payload.html), /Eve &lt;script&gt;/);
  });

  it("throws when Resend returns an error", async () => {
    const { client } = stubClient({
      data: null,
      error: {
        name: "validation_error",
        message: "Invalid from",
        statusCode: 422,
      },
    });

    await assert.rejects(
      createResendMailer(client, "bad").sendVerificationEmail(email),
      /Invalid from/,
    );
  });
});

describe("createConsoleMailer", () => {
  it("logs the verification link", async () => {
    const lines: string[] = [];

    await createConsoleMailer((line) => lines.push(line)).sendVerificationEmail(
      email,
    );

    assert.deepEqual(lines, [
      `[mailer] Verification link for test@example.com: ${email.url}`,
    ]);
  });
});

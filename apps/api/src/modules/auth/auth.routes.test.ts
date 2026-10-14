import type { DB } from "@db/index.js";
import * as schema from "@db/schema/index.js";
import { PGlite } from "@electric-sql/pglite";
import { createAuth } from "@plugins/auth/config.js";
import { createMockMailer } from "@plugins/mailer/mailer.js";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import Fastify, { type FastifyInstance } from "fastify";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";
import authRoutes from "./auth.routes.js";

const WEB_ORIGIN = "http://localhost:3000";
const password = "Password123!";

let client: PGlite;
let database: ReturnType<typeof drizzle<typeof schema>>;
let app: FastifyInstance;
let mailer: ReturnType<typeof createMockMailer>;

before(async () => {
  client = new PGlite();
  database = drizzle({ client, schema });
  await migrate(database, {
    migrationsFolder: resolve(import.meta.dirname, "../../../migrations"),
  });
});

beforeEach(async () => {
  await app?.close();
  await database.delete(schema.users);
  mailer = createMockMailer();
  const auth = createAuth(database as unknown as DB, {
    secret: "test-secret-that-is-at-least-32-characters",
    baseURL: `${WEB_ORIGIN}/api/auth`,
    webOrigin: WEB_ORIGIN,
    mailer,
  });
  app = Fastify();
  await app.register(authRoutes, { prefix: "/api", auth });
});

after(async () => {
  await app?.close();
  await client.close();
});

const post = (url: string, payload: object, cookie?: string) =>
  app.inject({
    method: "POST",
    url: `/api/auth${url}`,
    headers: { origin: WEB_ORIGIN, ...(cookie ? { cookie } : {}) },
    payload,
  });

const signUp = (email = "test@example.com") =>
  post("/sign-up/email", { email, password, name: "Test <User>" });

const tokenFrom = (url: string) => {
  const link = new URL(url);
  assert.equal(link.origin + link.pathname, `${WEB_ORIGIN}/verify-email`);
  const token = link.searchParams.get("token");
  assert.ok(token);
  return token;
};

const verify = (token: string) =>
  app.inject({
    method: "GET",
    url: `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
    headers: { origin: WEB_ORIGIN },
  });

describe("email verification", () => {
  it("sends a verification email linking to the web app on sign-up", async () => {
    const response = await signUp();

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().token, null);
    assert.equal(mailer.sent.length, 1);
    assert.equal(mailer.sent[0].to, "test@example.com");
    assert.equal(mailer.sent[0].name, "Test <User>");
    tokenFrom(mailer.sent[0].url);
  });

  it("rejects sign-in before verification and resends the email", async () => {
    await signUp();

    const response = await post("/sign-in/email", {
      email: "test@example.com",
      password,
    });

    assert.equal(response.statusCode, 403);
    assert.equal(response.json().code, "EMAIL_NOT_VERIFIED");
    assert.equal(response.headers["set-cookie"], undefined);
    assert.equal(mailer.sent.length, 2);
  });

  it("verifies the email, signs the user in, and allows password sign-in", async () => {
    await signUp();

    const response = await verify(tokenFrom(mailer.sent[0].url));

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().status, true);
    const [user] = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "test@example.com"));
    assert.equal(user.emailVerified, true);

    const cookies = [response.headers["set-cookie"]].flat().filter(Boolean);
    assert.ok(cookies.some((cookie) => cookie?.includes("session_token")));
    const cookie = cookies.map((value) => value?.split(";")[0]).join("; ");
    const session = await app.inject({
      method: "GET",
      url: "/api/auth/get-session",
      headers: { origin: WEB_ORIGIN, cookie },
    });
    assert.equal(session.json().user.email, "test@example.com");

    const signIn = await post("/sign-in/email", {
      email: "test@example.com",
      password,
    });
    assert.equal(signIn.statusCode, 200);
  });

  it("rejects an invalid token", async () => {
    await signUp();

    const response = await verify("not-a-valid-token");

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().code, "INVALID_TOKEN");
  });

  it("resends only to existing unverified users", async () => {
    await signUp();

    const known = await post("/send-verification-email", {
      email: "test@example.com",
    });
    const unknown = await post("/send-verification-email", {
      email: "missing@example.com",
    });

    assert.equal(known.statusCode, 200);
    assert.equal(unknown.statusCode, 200);
    assert.deepEqual(
      mailer.sent.map(({ to }) => to),
      ["test@example.com", "test@example.com"],
    );
  });
});

import { env } from "@config/env.js";
import { db } from "@db/index.js";
import { createAuth } from "./config.js";
import { createMailer } from "./mailer.js";

export const mailer = createMailer(env);
export const auth = createAuth(db, {
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_BASE_URL,
  webOrigin: env.WEB_ORIGIN,
  mailer,
});

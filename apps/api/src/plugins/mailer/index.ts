import { env } from "@config/env.js";
import { Resend } from "resend";
import { createConsoleMailer, createResendMailer } from "./mailer.js";

export const mailer = env.RESEND_API_KEY
  ? createResendMailer(new Resend(env.RESEND_API_KEY), env.EMAIL_FROM)
  : createConsoleMailer();

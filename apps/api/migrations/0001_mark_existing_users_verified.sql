-- Email verification is now required to sign in. Accounts created before this
-- migration never received a verification email, so treat them as verified.
UPDATE "users" SET "email_verified" = true WHERE "email_verified" = false;

import { compare } from "bcryptjs";

export function isBcryptHash(hash: string): boolean {
  return (
    hash.startsWith("$2a$") ||
    hash.startsWith("$2b$") ||
    hash.startsWith("$2y$") ||
    hash.startsWith("$2x$")
  );
}

export async function verifyBcryptPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  if (!isBcryptHash(hash)) return false;
  return compare(password, hash);
}

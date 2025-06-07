import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function registerUser() {
  // Check if user already exists
  const existingUser = await db.query(
    "SELECT user_id FROM users WHERE email = $1",
    ["t@t.com"]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const passwordHash = await hashPassword("t");

  // Insert user
  const result = await db.query(
    `INSERT INTO users (email, name, password_hash, is_verified)
     VALUES ($1, $2, $3, $4,)`,
    [
      "t@t.com",
      "Test User",
      passwordHash,
      "true", // Assuming is_verified is true for test user
    ]
  );
}

async function addTestUser() {
  try {
    await registerUser();
    console.log("Test user added successfully");
  } catch (error) {
    console.error("Error adding test user:", error.message);
  }
}

addTestUser();

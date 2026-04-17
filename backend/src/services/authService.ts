import { usersTable } from "../db/schemas/user-schema.ts";
import db from "../index.ts";
import bcrypt from "bcrypt";

export default async function registerService({
  name,
  email,
  password,
  role,
}: {
  name: string;
  password: string;
  email: string;
  role: string;
}) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const [query] = await db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        role: role as "client" | "freelancer",
      })
      .returning();
    return query;
  } catch (e) {
    console.error("register service error", e);
  }
}

import { eq } from "drizzle-orm";
import { usersTable } from "../db/schemas/user-schema.ts";
import db from "../index.ts";
import bcrypt from "bcrypt";

export async function registerService({
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
export async function loginService({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      throw new Error("Account does not exist");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error("Wrong password");
    }

    return user;
  } catch (e) {
    console.error("login service error");
    throw e;
  }
}

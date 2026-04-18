import { eq } from "drizzle-orm";
import { usersTable } from "../db/schemas/user-schema.ts";
import db from "../index.ts";

export async function getUserById(id: number) {
  try {
    const user = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return user;
  } catch (e) {
    console.error("get user by id error in user service", e);
    throw e;
  }
}

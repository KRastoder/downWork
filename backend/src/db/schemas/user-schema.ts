import {
  integer,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { jobsTable } from "./jobs-schema.ts";

export const roleEnum = pgEnum("role", ["client", "freelancer"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  password: varchar("password").notNull(),
  role: roleEnum().notNull(),
  timestamp3: timestamp().defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  jobs: many(jobsTable),
}));

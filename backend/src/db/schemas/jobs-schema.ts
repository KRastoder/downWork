import {
  integer,
  pgTable,
  varchar,
  text,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user-schema.ts";

//TABLES

export const jobsTable = pgTable("jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recruiterId: integer("recruiter_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget").notNull(),
  avalability: boolean("avalability").default(true).notNull(),
});

export const jobTagsTable = pgTable(
  "job_tags",
  {
    jobId: integer("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    tagName: varchar("tag_name", { length: 50 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.jobId, table.tagName] }),
  }),
);

//RELATIONS
export const jobsRelations = relations(jobsTable, ({ one, many }) => ({
  recruiter: one(usersTable, {
    fields: [jobsTable.recruiterId],
    references: [usersTable.id],
  }),
  tags: many(jobTagsTable),
}));

export const jobTagsRelations = relations(jobTagsTable, ({ one }) => ({
  job: one(jobsTable, {
    fields: [jobTagsTable.jobId],
    references: [jobsTable.id],
  }),
}));

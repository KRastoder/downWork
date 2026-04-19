import {
  integer,
  pgTable,
  varchar,
  text,
  boolean,
  primaryKey,
  uniqueIndex,
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

export const proposalsTable = pgTable(
  "proposalsTable",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    freelancerId: integer("freelancer_id")
      .notNull()
      .references(() => usersTable.id),
    bid: integer("bid").notNull(),
    estamatedDays: integer("estamated_days").notNull(),
    coverLetter: text("cover_letter").notNull(),
  },
  (table) => ({
    uniqueProposal: uniqueIndex("unique_proposal").on(
      table.jobId,
      table.freelancerId,
    ),
  }),
);

export const contractsTable = pgTable(
  "contracts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    proposalId: integer("proposal_id")
      .notNull()
      .references(() => proposalsTable.id),
  },
  (table) => ({
    uniqueProposal: uniqueIndex("unique_contract").on(
      table.jobId,
      table.proposalId,
    ),
  }),
);

//RELATIONS
export const jobsRelations = relations(jobsTable, ({ one, many }) => ({
  recruiter: one(usersTable, {
    fields: [jobsTable.recruiterId],
    references: [usersTable.id],
  }),
  tags: many(jobTagsTable),
  proposals: many(proposalsTable),
  contract: one(contractsTable, {
    fields: [jobsTable.id],
    references: [contractsTable.jobId],
  }),
}));

export const jobTagsRelations = relations(jobTagsTable, ({ one }) => ({
  job: one(jobsTable, {
    fields: [jobTagsTable.jobId],
    references: [jobsTable.id],
  }),
}));
export const proposalsRelations = relations(proposalsTable, ({ one }) => ({
  job: one(jobsTable, {
    fields: [proposalsTable.jobId],
    references: [jobsTable.id],
  }),
  freelancer: one(usersTable, {
    fields: [proposalsTable.freelancerId],
    references: [usersTable.id],
  }),
  contract: one(contractsTable, {
    fields: [proposalsTable.id],
    references: [contractsTable.proposalId],
  }),
}));

export const contractRelations = relations(contractsTable, ({ one }) => ({
  job: one(jobsTable, {
    fields: [contractsTable.jobId],
    references: [jobsTable.id],
  }),
  proposal: one(proposalsTable, {
    fields: [contractsTable.proposalId],
    references: [proposalsTable.id],
  }),
}));

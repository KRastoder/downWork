import { integer, pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user-schema.ts";

//TABLES

export const chatsTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
});
export const messagesTable = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chatId: integer("chat_id")
    .notNull()
    .references(() => chatsTable.id),
  message: text("message"),
});
export const chatMembersTable = pgTable(
  "chat_members",
  {
    chatId: integer("chat_id")
      .notNull()
      .references(() => chatsTable.id, { onDelete: "cascade" }),

    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.chatId, table.userId] }),
  }),
);

//RELATIONS
export const chatsRelations = relations(chatsTable, ({ many }) => ({
  members: many(chatMembersTable),
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  chat: one(chatsTable, {
    fields: [messagesTable.chatId],
    references: [chatsTable.id],
  }),
}));

export const chatMembersRelations = relations(chatMembersTable, ({ one }) => ({
  chat: one(chatsTable, {
    fields: [chatMembersTable.chatId],
    references: [chatsTable.id],
  }),
  user: one(usersTable, {
    fields: [chatMembersTable.userId],
    references: [usersTable.id],
  }),
}));

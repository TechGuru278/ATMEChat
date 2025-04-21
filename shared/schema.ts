import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  questionId: text("question_id").notNull().unique(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const insertFaqItemSchema = createInsertSchema(faqItems).pick({
  questionId: true,
  question: true,
  answer: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItems.$inferSelect;

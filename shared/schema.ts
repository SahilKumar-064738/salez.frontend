import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  stage: text("stage").notNull().default("New"), // New, Engaged, Interested, Paid, Lost
  tags: text("tags").array(),
  avatar: text("avatar"),
  lastActive: timestamp("last_active").defaultNow(),
  unreadCount: integer("unread_count").default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'contact'
  timestamp: timestamp("timestamp").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(),
  condition: text("condition").notNull(),
  actionType: text("action_type").notNull(),
  isEnabled: boolean("is_enabled").default(true),
});

// === RELATIONS ===

export const contactsRelations = relations(contacts, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  contact: one(contacts, {
    fields: [messages.contactId],
    references: [contacts.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, lastActive: true, unreadCount: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export const insertRuleSchema = createInsertSchema(automationRules).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type AutomationRule = typeof automationRules.$inferSelect;
export type InsertAutomationRule = z.infer<typeof insertRuleSchema>;
export const stages = [
  "New",
  "Engaged",
  "Interested",
  "Paid",
  "Lost",
] as const;

export type Stage = (typeof stages)[number];


// Request Types
export type CreateContactRequest = InsertContact;
export type UpdateContactRequest = Partial<InsertContact>;
export type CreateMessageRequest = InsertMessage;
export type CreateRuleRequest = InsertAutomationRule;
export type UpdateRuleRequest = Partial<InsertAutomationRule>;
export type PipelineMoveRequest = { stage: string };

// Response Types
export type ContactResponse = Contact;
export type MessageResponse = Message;
export type RuleResponse = AutomationRule;


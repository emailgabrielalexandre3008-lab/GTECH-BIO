import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 120 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  reviewDate: varchar("reviewDate", { length: 32 }),
  source: varchar("source", { length: 64 }).default("Google").notNull(),
  published: int("published").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;

export const adminSessions = mysqlTable("admin_sessions", {
  id: int("id").autoincrement().primaryKey(),
  tokenHash: varchar("tokenHash", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

export const adminContent = mysqlTable("admin_content", {
  id: int("id").autoincrement().primaryKey(),
  kind: varchar("kind", { length: 32 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  subtitle: varchar("subtitle", { length: 240 }),
  body: text("body"),
  url: varchar("url", { length: 500 }),
  dataJson: text("dataJson"),
  active: int("active").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminContent = typeof adminContent.$inferSelect;
export type InsertAdminContent = typeof adminContent.$inferInsert;

export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  brand: varchar("brand", { length: 64 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  issue: varchar("issue", { length: 160 }).notNull(),
  details: text("details"),
  serviceMode: varchar("serviceMode", { length: 32 }).notNull(),
  address: text("address"),
  complement: varchar("complement", { length: 160 }),
  reference: varchar("reference", { length: 160 }),
  intent: varchar("intent", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  eventName: varchar("eventName", { length: 80 }).notNull(),
  path: varchar("path", { length: 255 }),
  referrer: varchar("referrer", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

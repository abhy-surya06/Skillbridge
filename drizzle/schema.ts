import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 160 }).notNull(),
  headline: varchar("headline", { length: 255 }).notNull().default("Student profile"),
  potentialScore: int("potentialScore").notNull().default(0),
  cohortRank: varchar("cohortRank", { length: 120 }).notNull().default("Building your signal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const skillStatus = ["verified", "claimed", "decaying"] as const;
export type SkillStatus = (typeof skillStatus)[number];

export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  family: varchar("family", { length: 160 }).notNull(),
  level: varchar("level", { length: 80 }).notNull(),
  score: int("score").notNull().default(0),
  status: mysqlEnum("status", [...skillStatus]).notNull().default("claimed"),
  detail: varchar("detail", { length: 255 }).notNull(),
  iconKey: varchar("iconKey", { length: 40 }).notNull().default("sparkles"),
  lastPracticedAt: timestamp("lastPracticedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  theme: mysqlEnum("theme", ["light", "dark"]).notNull().default("light"),
  activeRole: mysqlEnum("activeRole", ["talent", "hiring", "academia"]).notNull().default("talent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const challengeAttempts = mysqlTable("challenge_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skillId: int("skillId").notNull(),
  status: mysqlEnum("status", ["started", "completed"]).notNull().default("started"),
  score: int("score"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;

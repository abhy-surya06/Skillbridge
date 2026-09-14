import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  challengeAttempts,
  InsertUser,
  skills,
  studentProfiles,
  userPreferences,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  for (const field of textFields) {
    if (user[field] !== undefined) {
      const normalized = user[field] ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

const defaultSkills = [
  { name: "React architecture", family: "Frontend engineering", level: "Proficient", score: 84, status: "verified" as const, detail: "Challenge passed 12 days ago", iconKey: "code" },
  { name: "Product thinking", family: "Product & strategy", level: "Working", score: 68, status: "verified" as const, detail: "Challenge passed 28 days ago", iconKey: "compass" },
  { name: "TypeScript", family: "Frontend engineering", level: "Working", score: 62, status: "decaying" as const, detail: "Last practiced 47 days ago", iconKey: "zap" },
  { name: "User research", family: "Product & strategy", level: "Familiar", score: 46, status: "claimed" as const, detail: "Added from resume", iconKey: "users" },
];

export async function ensureSkillBridgeData(userId: number, displayName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");

  let profile = (await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1))[0];
  if (!profile) {
    await db.insert(studentProfiles).values({
      userId,
      displayName: displayName || "SkillBridge member",
      headline: "Student profile",
      potentialScore: 72,
      cohortRank: "Top 18% of your cohort",
    });
    profile = (await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1))[0];
  }

  const preferences = (await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1))[0];
  if (!preferences) {
    await db.insert(userPreferences).values({ userId, theme: "light", activeRole: "talent" });
  }

  const existingSkills = await db.select().from(skills).where(eq(skills.profileId, profile.id));
  if (existingSkills.length === 0) {
    await db.insert(skills).values(defaultSkills.map((skill) => ({ ...skill, profileId: profile.id })));
  }
}

export async function getDashboardSnapshot(userId: number, displayName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await ensureSkillBridgeData(userId, displayName);

  const profile = (await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1))[0];
  const preferences = (await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1))[0];
  const profileSkills = await db.select().from(skills).where(eq(skills.profileId, profile.id));

  return { profile, preferences, skills: profileSkills };
}

export async function saveUserPreferences(userId: number, values: { theme?: "light" | "dark"; activeRole?: "talent" | "hiring" | "academia" }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.insert(userPreferences).values({ userId, theme: values.theme ?? "light", activeRole: values.activeRole ?? "talent" }).onDuplicateKeyUpdate({ set: values });
  return (await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1))[0];
}

export async function startChallengeForUser(userId: number, skillId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  const profile = (await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1))[0];
  if (!profile) throw new Error("Student profile not found");
  const skill = (await db.select().from(skills).where(and(eq(skills.id, skillId), eq(skills.profileId, profile.id))).limit(1))[0];
  if (!skill) throw new Error("Skill not found");

  await db.insert(challengeAttempts).values({ userId, skillId, status: "started" });
  await db.update(skills).set({ detail: "Challenge queued just now" }).where(eq(skills.id, skillId));
  return { success: true, skillId } as const;
}

import { and, desc, eq, gt, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { AdminContent, adminContent, AdminSession, adminSessions, AnalyticsEvent, analyticsEvents, Feedback, InsertAdminContent, InsertFeedback, feedback, InsertQuoteRequest, InsertUser, QuoteRequest, quoteRequests, users, PartCatalog, partsCatalog, PartPriceHistory, partPriceHistory, SupplierImport, supplierImports } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedFeedback() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feedback).where(eq(feedback.published, 1)).orderBy(desc(feedback.createdAt)).limit(24);
}

export async function listFeedbackForAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(feedback).orderBy(desc(feedback.createdAt)).limit(100);
}

export async function createFeedback(input: Omit<InsertFeedback, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(feedback).values(input);
  return result[0].insertId;
}

export async function updateFeedback(id: number, input: Partial<Omit<InsertFeedback, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(feedback).set(input).where(eq(feedback.id, id));
}

export async function deleteFeedback(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(feedback).where(eq(feedback.id, id));
}

export async function createAdminSession(input: { tokenHash: string; email: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
  await db.insert(adminSessions).values(input);
}

export async function getAdminSessionByTokenHash(tokenHash: string): Promise<AdminSession | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminSessions).where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date()))).limit(1);
  return result[0];
}

export async function deleteAdminSession(tokenHash: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));
}

export async function listContent(kind?: string) {
  const db = await getDb();
  if (!db) return [] as AdminContent[];
  const query = kind ? db.select().from(adminContent).where(eq(adminContent.kind, kind)) : db.select().from(adminContent);
  return query.orderBy(desc(adminContent.sortOrder), desc(adminContent.updatedAt)).limit(200);
}

export async function getContent(kind: string, slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(adminContent).where(and(eq(adminContent.kind, kind), eq(adminContent.slug, slug))).limit(1);
  return result[0];
}

export async function createContent(input: Omit<InsertAdminContent, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(adminContent).values(input);
  return result[0].insertId;
}

export async function updateContent(id: number, input: Partial<Omit<InsertAdminContent, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(adminContent).set(input).where(eq(adminContent.id, id));
}

export async function deleteContent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(adminContent).where(eq(adminContent.id, id));
}

export async function createQuoteRequest(input: Omit<InsertQuoteRequest, "id" | "createdAt" | "updatedAt" | "status">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(quoteRequests).values({ ...input, status: "new" });
  return result[0].insertId;
}

export async function listQuoteRequests() {
  const db = await getDb();
  if (!db) return [] as QuoteRequest[];
  return db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt)).limit(200);
}

export async function updateQuoteStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));
}

export async function recordAnalyticsEvent(input: Omit<AnalyticsEvent, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(analyticsEvents).values(input);
}

export async function listAnalyticsEvents() {
  const db = await getDb();
  if (!db) return [] as AnalyticsEvent[];
  return db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.createdAt)).limit(1000);
}

export async function createSupplierImport(input: Omit<typeof supplierImports.$inferInsert, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(supplierImports).values(input);
  return Number(result[0].insertId);
}

export async function listSupplierImports(category = "frontals") {
  const db = await getDb();
  if (!db) return [] as SupplierImport[];
  return db.select().from(supplierImports).where(eq(supplierImports.category, category)).orderBy(desc(supplierImports.createdAt)).limit(100);
}

export async function getSupplierImport(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(supplierImports).where(eq(supplierImports.id, id)).limit(1);
  return result[0];
}

export async function approveSupplierImport(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const current = await getSupplierImport(id);
  if (!current) throw new Error("Importação não encontrada");
  if (current.status === "approved") return { updated: 0, created: 0, skipped: 0 };
  const rows = JSON.parse(current.previewJson) as Array<{ brand: string; model: string; category: string; serviceType: string; quality: string | null; supplierCost: number | null; valid: boolean; duplicateKey: string }>;
  const existing = await db.select().from(partsCatalog).where(eq(partsCatalog.category, current.category)).limit(5000);
  const byKey = new Map(existing.map((item) => [[item.brand, item.model, item.quality ?? "sem-qualidade"].map((value) => value.toLowerCase().replace(/\s+/g, " ").trim()).join("|"), item]));
  let updated = 0;
  let created = 0;
  let skipped = 0;
  for (const row of rows) {
    if (!row.valid || row.supplierCost === null) { skipped += 1; continue; }
    const key = row.duplicateKey;
    const currentPart = byKey.get(key);
    const values = { brand: row.brand, model: row.model, category: row.category, serviceType: row.serviceType, quality: row.quality, supplierCost: row.supplierCost.toFixed(2), supplier: "Tyros Cell", sourceImportId: id, sourceFileName: current.fileName, approvalStatus: "approved", availabilityStatus: "confirmed" } as const;
    if (currentPart) {
      if (Number(currentPart.supplierCost) !== row.supplierCost || currentPart.sourceFileName !== current.fileName) {
        await db.insert(partPriceHistory).values({ catalogKey: key, brand: currentPart.brand, model: currentPart.model, category: currentPart.category, serviceType: currentPart.serviceType, quality: currentPart.quality, supplierCost: currentPart.supplierCost, sourceImportId: currentPart.sourceImportId, sourceFileName: currentPart.sourceFileName });
        await db.update(partsCatalog).set(values).where(eq(partsCatalog.id, currentPart.id));
        updated += 1;
      } else skipped += 1;
    } else {
      await db.insert(partsCatalog).values(values);
      created += 1;
    }
  }
  await db.update(supplierImports).set({ status: "approved", approvedAt: new Date() }).where(eq(supplierImports.id, id));
  return { updated, created, skipped };
}

export async function listPartsCatalog(category = "frontals") {
  const db = await getDb();
  if (!db) return [] as PartCatalog[];
  return db.select().from(partsCatalog).where(eq(partsCatalog.category, category)).orderBy(partsCatalog.brand, partsCatalog.model).limit(5000);
}

export async function listPartPriceHistory(catalogKey: string) {
  const db = await getDb();
  if (!db) return [] as PartPriceHistory[];
  return db.select().from(partPriceHistory).where(eq(partPriceHistory.catalogKey, catalogKey)).orderBy(desc(partPriceHistory.changedAt)).limit(100);
}

export type FeedbackRecord = Feedback;

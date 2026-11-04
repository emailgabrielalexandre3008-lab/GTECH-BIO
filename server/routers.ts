import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createContent, createFeedback, createQuoteRequest, deleteContent, deleteFeedback, getContent, listAnalyticsEvents, listContent, listFeedbackForAdmin, listPartsCatalog, listPublishedFeedback, listQuoteRequests, recordAnalyticsEvent, updateContent, updateFeedback, updateQuoteStatus } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  feedback: router({
    publicList: publicProcedure.query(() => listPublishedFeedback()),
    adminList: adminProcedure.query(() => listFeedbackForAdmin()),
    create: adminProcedure.input(z.object({
      customerName: z.string().trim().min(2).max(120),
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().min(3),
      reviewDate: z.string().trim().max(32).optional(),
      source: z.string().trim().min(2).max(64).default("Google"),
      published: z.boolean().default(false),
    })).mutation(({ input }) => createFeedback({ ...input, published: input.published ? 1 : 0 })),
    update: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      customerName: z.string().trim().min(2).max(120),
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().min(3),
      reviewDate: z.string().trim().max(32).optional(),
      source: z.string().trim().min(2).max(64),
      published: z.boolean(),
    })).mutation(({ input }) => {
      const { id, published, ...rest } = input;
      return updateFeedback(id, { ...rest, published: published ? 1 : 0 });
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteFeedback(input.id)),
  }),

  content: router({
    publicSettings: publicProcedure.query(async () => {
      const item = await getContent("settings", "global");
      if (!item?.dataJson) return null;
      try { return JSON.parse(item.dataJson) as Record<string, string>; } catch { return null; }
    }),
    adminList: adminProcedure.input(z.object({ kind: z.string().trim().max(32).optional() }).optional()).query(({ input }) => listContent(input?.kind)),
    create: adminProcedure.input(z.object({ kind: z.string().trim().min(2).max(32), slug: z.string().trim().min(1).max(120), title: z.string().trim().min(1).max(180), subtitle: z.string().trim().max(240).optional(), body: z.string().max(10000).optional(), url: z.string().url().max(500).optional().or(z.literal("")), dataJson: z.string().max(20000).optional(), active: z.boolean().default(true), sortOrder: z.number().int().min(0).max(9999).default(0) })).mutation(({ input }) => createContent({ ...input, active: input.active ? 1 : 0 })),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), kind: z.string().trim().min(2).max(32), slug: z.string().trim().min(1).max(120), title: z.string().trim().min(1).max(180), subtitle: z.string().trim().max(240).optional(), body: z.string().max(10000).optional(), url: z.string().url().max(500).optional().or(z.literal("")), dataJson: z.string().max(20000).optional(), active: z.boolean(), sortOrder: z.number().int().min(0).max(9999) })).mutation(({ input }) => { const { id, active, ...rest } = input; return updateContent(id, { ...rest, active: active ? 1 : 0 }); }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteContent(input.id)),
  }),

  quotes: router({
    create: publicProcedure.input(z.object({ customerName: z.string().trim().min(2).max(120), phone: z.string().trim().max(32).optional(), brand: z.string().trim().min(1).max(64), model: z.string().trim().min(1).max(120), issue: z.string().trim().min(1).max(160), details: z.string().max(5000).optional(), serviceMode: z.enum(["store", "courier"]), address: z.string().max(500).optional(), complement: z.string().max(160).optional(), reference: z.string().max(160).optional(), intent: z.enum(["urgency", "quote"]) })).mutation(({ input }) => createQuoteRequest(input)),
    adminList: adminProcedure.query(() => listQuoteRequests()),
    updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "in_review", "awaiting_approval", "approved", "in_repair", "completed", "delivered", "cancelled"]) })).mutation(({ input }) => updateQuoteStatus(input.id, input.status)),
  }),

  analytics: router({
    track: publicProcedure.input(z.object({ eventName: z.string().trim().min(2).max(80), path: z.string().max(255).optional(), referrer: z.string().max(500).optional() })).mutation(({ input }) => recordAnalyticsEvent({ eventName: input.eventName, path: input.path ?? null, referrer: input.referrer ?? null })),
    adminList: adminProcedure.query(() => listAnalyticsEvents()),
  }),

  parts: router({
    publicFrontals: publicProcedure.input(z.object({ brand: z.string().trim().max(80).optional(), model: z.string().trim().max(160).optional(), quality: z.string().trim().max(120).optional() }).optional()).query(async ({ input }) => {
      const rows = await listPartsCatalog("frontals");
      const requestedBrand = input?.brand?.toLowerCase() === "apple" ? "iphone" : input?.brand?.toLowerCase() ?? "";
      const brandRows = rows.filter((item) => !requestedBrand || item.brand.toLowerCase() === requestedBrand);
      const modelNeedle = (input?.model?.toLowerCase() ?? "").replace(/^(apple|iphone)\s*/i, "").trim();
      const exactRows = modelNeedle ? brandRows.filter((item) => item.model.toLowerCase() === modelNeedle) : brandRows;
      const matchedRows = exactRows.length ? exactRows : brandRows.filter((item) => !modelNeedle || item.model.toLowerCase().includes(modelNeedle));
      return matchedRows.filter((item) => !input?.quality || (item.quality ?? "").toLowerCase() === input.quality.toLowerCase()).map((item) => ({ id: item.id, brand: item.brand, model: item.model, serviceType: item.serviceType, quality: item.quality, estimatedPrice: Math.round((Number(item.supplierCost) * 2 + 30) * 100) / 100 }));
    }),
    publicBatteries: publicProcedure.input(z.object({ brand: z.string().trim().max(80).optional(), model: z.string().trim().max(160).optional(), quality: z.string().trim().max(120).optional() }).optional()).query(async ({ input }) => {
      const rows = await listPartsCatalog("batteries");
      const requestedBrand = input?.brand?.toLowerCase() === "apple" ? "iphone" : input?.brand?.toLowerCase() ?? "";
      const brandRows = rows.filter((item) => !requestedBrand || item.brand.toLowerCase() === requestedBrand);
      const modelNeedle = (input?.model?.toLowerCase() ?? "").replace(/^(apple|iphone)\s*/i, "").trim();
      const exactRows = modelNeedle ? brandRows.filter((item) => item.model.toLowerCase() === modelNeedle) : brandRows;
      const matchedRows = exactRows.length ? exactRows : brandRows.filter((item) => !modelNeedle || item.model.toLowerCase().includes(modelNeedle));
      return matchedRows.filter((item) => !input?.quality || (item.quality ?? "").toLowerCase() === input.quality.toLowerCase()).map((item) => ({ id: item.id, brand: item.brand, model: item.model, serviceType: item.serviceType, quality: item.quality, estimatedPrice: Math.round((Number(item.supplierCost) * 2 + 30) * 100) / 100 }));
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

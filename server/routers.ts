import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createFeedback, deleteFeedback, listFeedbackForAdmin, listPublishedFeedback, updateFeedback } from "./db";
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

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

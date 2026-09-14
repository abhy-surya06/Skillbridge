import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDashboardSnapshot, saveUserPreferences, startChallengeForUser } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  dashboard: router({
    snapshot: protectedProcedure.query(({ ctx }) => getDashboardSnapshot(ctx.user.id, ctx.user.name ?? "")),
    savePreferences: protectedProcedure
      .input(z.object({ theme: z.enum(["light", "dark"]).optional(), activeRole: z.enum(["talent", "hiring", "academia"]).optional() }))
      .mutation(({ ctx, input }) => saveUserPreferences(ctx.user.id, input)),
    startChallenge: protectedProcedure
      .input(z.object({ skillId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => startChallengeForUser(ctx.user.id, input.skillId)),
  }),
});

export type AppRouter = typeof appRouter;

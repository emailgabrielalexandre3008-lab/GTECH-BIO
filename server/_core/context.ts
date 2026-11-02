import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getAdminIdentity, type AdminIdentity } from "./adminAuth";
import { COOKIE_NAME } from "@shared/const";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  adminSession: AdminIdentity | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  const adminSession = await getAdminIdentity(opts.req);

  const hasOAuthCredentials = Boolean(opts.req.headers.authorization?.startsWith("Bearer ") || opts.req.headers.cookie?.includes(`${COOKIE_NAME}=`));
  if (hasOAuthCredentials) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    adminSession,
  };
}

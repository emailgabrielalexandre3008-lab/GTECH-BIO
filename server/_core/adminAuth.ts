import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Request, Response } from "express";
import { ADMIN_ACTION_TICKET_TTL_MS, ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS } from "@shared/const";
import * as db from "../db";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";

const PASSWORD_SALT_PREFIX = "gtech-admin-password-v1:";

export type AdminIdentity = {
  email: string;
  expiresAt: Date;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function derivePasswordKey(password: string, email: string) {
  return scryptSync(password, `${PASSWORD_SALT_PREFIX}${email}`, 64, { N: 16_384, r: 8, p: 1 });
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyAdminCredentials(email: string, password: string) {
  const configuredEmail = normalizeEmail(ENV.adminEmail);
  const configuredPassword = ENV.adminPassword;
  const submittedEmail = normalizeEmail(email);
  if (!configuredEmail || !configuredPassword || submittedEmail !== configuredEmail || !password) return false;

  const expected = derivePasswordKey(configuredPassword, configuredEmail);
  const received = derivePasswordKey(password, configuredEmail);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function createAdminLogin(email: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS);
  await db.createAdminSession({ tokenHash: hashSessionToken(token), email: normalizeEmail(email), expiresAt });
  return { token, expiresAt };
}

export async function getAdminIdentity(req: Request): Promise<AdminIdentity | null> {
  const token = parseCookieHeader(req.headers.cookie ?? "")[ADMIN_SESSION_COOKIE];
  if (!token) return null;
  const session = await db.getAdminSessionByTokenHash(hashSessionToken(token));
  if (!session) return null;
  return { email: session.email, expiresAt: session.expiresAt };
}

export async function revokeAdminLogin(req: Request) {
  const token = parseCookieHeader(req.headers.cookie ?? "")[ADMIN_SESSION_COOKIE];
  if (token) await db.deleteAdminSession(hashSessionToken(token));
}

export function setAdminSessionCookie(res: Response, token: string, maxAge = ADMIN_SESSION_TTL_MS) {
  res.cookie(ADMIN_SESSION_COOKIE, token, { ...getSessionCookieOptions(), maxAge });
}

export function clearAdminSessionCookie(res: Response) {
  res.clearCookie(ADMIN_SESSION_COOKIE, { ...getSessionCookieOptions(), maxAge: -1 });
}

export async function createAdminActionTicket(email: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_ACTION_TICKET_TTL_MS);
  await db.createAdminActionTicket({ tokenHash: hashSessionToken(token), email: normalizeEmail(email), expiresAt });
  return { token, expiresAt };
}

export async function getAdminIdentityOrActionTicket(req: Request): Promise<AdminIdentity | null> {
  const identity = await getAdminIdentity(req);
  if (identity) return identity;
  const actionToken = req.headers["x-admin-action-ticket"];
  if (typeof actionToken !== "string" || !actionToken) return null;
  const ticket = await db.consumeAdminActionTicket(hashSessionToken(actionToken));
  return ticket ? { email: ticket.email, expiresAt: ticket.expiresAt } : null;
}

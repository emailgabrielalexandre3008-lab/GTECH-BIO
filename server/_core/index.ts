import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { clearAdminSessionCookie, createAdminLogin, getAdminIdentity, revokeAdminLogin, setAdminSessionCookie, verifyAdminCredentials } from "./adminAuth";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  app.post("/api/admin/login", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!verifyAdminCredentials(email, password)) {
      res.status(401).json({ error: "E-mail ou senha inválidos." });
      return;
    }
    try {
      const { token, expiresAt } = await createAdminLogin(email);
      setAdminSessionCookie(res, token);
      res.json({ authenticated: true, email: email.trim().toLowerCase(), expiresAt });
    } catch (error) {
      console.error("[AdminAuth] Login failed:", error instanceof Error ? error.message : "unknown error");
      res.status(500).json({ error: "Não foi possível iniciar a sessão administrativa." });
    }
  });
  app.get("/api/admin/session", async (req, res) => {
    const identity = await getAdminIdentity(req);
    res.json(identity ? { authenticated: true, email: identity.email, expiresAt: identity.expiresAt } : { authenticated: false });
  });
  app.post("/api/admin/logout", async (req, res) => {
    await revokeAdminLogin(req);
    clearAdminSessionCookie(res);
    res.json({ authenticated: false });
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });

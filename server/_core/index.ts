import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { clearAdminSessionCookie, createAdminActionTicket, createAdminLogin, getAdminIdentity, getAdminIdentityOrActionTicket, revokeAdminLogin, setAdminSessionCookie, verifyAdminCredentials } from "./adminAuth";
import { approveSupplierImport, createSupplierImport, getSupplierImport, listPartsCatalog, listSupplierImports } from "../db";
import { parseFrontalsWorkbook } from "../supplier/frontalsParser";
import { uploadSupplierFile } from "../supplier/storage";

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
    if (!identity) { res.json({ authenticated: false }); return; }
    const actionTicket = await createAdminActionTicket(identity.email);
    res.json({ authenticated: true, email: identity.email, expiresAt: identity.expiresAt, actionTicket: actionTicket.token });
  });
  app.post("/api/admin/logout", async (req, res) => {
    await revokeAdminLogin(req);
    clearAdminSessionCookie(res);
    res.json({ authenticated: false });
  });
  app.get("/api/admin/supplier/frontals/imports", async (req, res) => {
    const identity = await getAdminIdentityOrActionTicket(req);
    if (!identity) { res.status(401).json({ error: "Não autorizado." }); return; }
    res.json({ imports: await listSupplierImports("frontals") });
  });
  app.get("/api/admin/supplier/frontals/imports/:id", async (req, res) => {
    const identity = await getAdminIdentityOrActionTicket(req);
    if (!identity) { res.status(401).json({ error: "Não autorizado." }); return; }
    const item = await getSupplierImport(Number(req.params.id));
    if (!item) { res.status(404).json({ error: "Importação não encontrada." }); return; }
    res.json({ ...item, preview: JSON.parse(item.previewJson) });
  });
  app.post("/api/admin/supplier/frontals/import", express.raw({ type: ["application/octet-stream", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"], limit: "25mb" }), async (req, res) => {
    const identity = await getAdminIdentityOrActionTicket(req);
    if (!identity) { res.status(401).json({ error: "Não autorizado." }); return; }
    const fileName = String(req.header("x-file-name") || "").trim();
    const contentType = String(req.header("content-type") || "application/octet-stream").split(";")[0];
    if (!/\.(xlsx|xls)$/i.test(fileName)) { res.status(400).json({ error: "Envie um arquivo .xlsx ou .xls." }); return; }
    const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body ?? []);
    if (!buffer.length) { res.status(400).json({ error: "O arquivo está vazio." }); return; }
    try {
      const parsed = parseFrontalsWorkbook(buffer);
      const sourceFileKey = await uploadSupplierFile(buffer, fileName, contentType);
      const importId = await createSupplierImport({ category: "frontals", fileName, sourceFileKey, status: "preview", rowsTotal: parsed.rowsTotal, validRows: parsed.validRows, invalidRows: parsed.invalidRows, duplicateRows: parsed.duplicateRows, changedRows: 0, previewJson: JSON.stringify(parsed.rows), importedBy: identity.email });
      res.json({ importId, fileName, status: "preview", rowsTotal: parsed.rowsTotal, validRows: parsed.validRows, invalidRows: parsed.invalidRows, duplicateRows: parsed.duplicateRows, brands: parsed.brands, models: parsed.models, sheetsRead: parsed.sheetsRead, preview: parsed.rows.slice(0, 200) });
    } catch (error) {
      console.error("[SupplierImport] frontals failed:", error instanceof Error ? error.message : "unknown");
      res.status(422).json({ error: error instanceof Error ? error.message : "Não foi possível interpretar o arquivo." });
    }
  });
  app.post("/api/admin/supplier/frontals/imports/:id/approve", async (req, res) => {
    const identity = await getAdminIdentityOrActionTicket(req);
    if (!identity) { res.status(401).json({ error: "Não autorizado." }); return; }
    try { res.json(await approveSupplierImport(Number(req.params.id))); } catch (error) { res.status(422).json({ error: error instanceof Error ? error.message : "Não foi possível aprovar a importação." }); }
  });
  app.get("/api/admin/supplier/frontals/catalog", async (req, res) => {
    const identity = await getAdminIdentityOrActionTicket(req);
    if (!identity) { res.status(401).json({ error: "Não autorizado." }); return; }
    res.json({ parts: await listPartsCatalog("frontals") });
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

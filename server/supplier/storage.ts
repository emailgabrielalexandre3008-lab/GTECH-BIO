import crypto from "node:crypto";

function safeFileName(fileName: string) {
  return fileName.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "").slice(0, 160) || "arquivo.xlsx";
}

export async function uploadSupplierFile(buffer: Buffer, fileName: string, contentType: string) {
  const baseUrl = process.env.MANUS_API_URL;
  const apiKey = process.env.MANUS_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Storage do projeto não está configurado.");
  const key = `supplier-imports/frontals/${Date.now()}-${crypto.randomBytes(8).toString("hex")}-${safeFileName(fileName)}`;
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/storage/presign/put?path=${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${apiKey}` } });
  const payload = await response.json().catch(() => ({})) as { url?: string; error?: string };
  if (!response.ok || !payload.url) throw new Error(payload.error || "Não foi possível preparar o armazenamento do arquivo.");
  const upload = await fetch(payload.url, { method: "PUT", headers: { "Content-Type": contentType }, body: new Uint8Array(buffer) });
  if (!upload.ok) throw new Error("Não foi possível armazenar o arquivo original.");
  return `/manus-storage/${key}`;
}

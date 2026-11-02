import * as XLSX from "xlsx";

export type FrontalsPreviewRow = {
  rowNumber: number;
  sheetName: string;
  brand: string;
  model: string;
  category: "frontals";
  serviceType: "Troca de tela / frontal";
  quality: string | null;
  supplierCost: number | null;
  estimatedPrice: number | null;
  rawValue: string;
  valid: boolean;
  issue?: string;
  duplicateKey: string;
};

export type FrontalsParseResult = {
  rows: FrontalsPreviewRow[];
  rowsTotal: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  brands: string[];
  models: number;
  sheetsRead: string[];
};

function normalizeText(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseMoney(value: unknown): { cost: number | null; quality: string | null } {
  if (typeof value === "number" && Number.isFinite(value)) return { cost: value, quality: null };
  const raw = normalizeText(value);
  if (!raw) return { cost: null, quality: null };
  const match = raw.match(/^R?\$?\s*([0-9]{1,6}(?:[.,][0-9]{1,2})?)\s*(?:[-–—]\s*)?(.*)$/i);
  if (!match) return { cost: null, quality: raw };
  const numeric = Number(match[1].replace(",", "."));
  if (!Number.isFinite(numeric) || numeric <= 0) return { cost: null, quality: normalizeText(match[2]) || null };
  return { cost: Math.round(numeric * 100) / 100, quality: normalizeText(match[2]) || null };
}

function keyOf(row: Pick<FrontalsPreviewRow, "brand" | "model" | "quality">) {
  return [row.brand, row.model, row.quality ?? "sem-qualidade"].map((part) => part.toLowerCase().replace(/\s+/g, " ").trim()).join("|");
}

export function parseFrontalsWorkbook(buffer: Buffer): FrontalsParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: false, raw: true });
  const rows: FrontalsPreviewRow[] = [];
  const brands = new Set<string>();
  const sheetsRead: string[] = [];
  const seen = new Set<string>();
  let rowsTotal = 0;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const values = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: null, blankrows: false });
    if (!values.length) continue;
    sheetsRead.push(sheetName);
    const sectionRows = new Map<number, string>();
    for (const merge of sheet["!merges"] ?? []) {
      if (merge.s.c === 0 && merge.e.c >= 8 && merge.s.r === merge.e.r) {
        const section = normalizeText(values[merge.s.r]?.[0]);
        if (section) sectionRows.set(merge.s.r + 1, section);
      }
    }
    let currentBrand = "Não identificado";
    values.forEach((cells, index) => {
      const rowNumber = index + 1;
      if (sectionRows.has(rowNumber)) {
        currentBrand = sectionRows.get(rowNumber)!;
        brands.add(currentBrand);
        return;
      }
      const model = normalizeText(cells[0]);
      if (!model) return;
      rowsTotal += 1;
      const nonEmptyCells = cells.slice(1).filter((value) => value !== null && value !== undefined && normalizeText(value) !== "");
      if (!nonEmptyCells.length) {
        rows.push({ rowNumber, sheetName, brand: currentBrand, model, category: "frontals", serviceType: "Troca de tela / frontal", quality: null, supplierCost: null, estimatedPrice: null, rawValue: "", valid: false, issue: "Modelo sem custo informado", duplicateKey: keyOf({ brand: currentBrand, model, quality: null }) });
        return;
      }
      for (const value of nonEmptyCells) {
        const rawValue = normalizeText(value);
        const parsed = parseMoney(value);
        const row: FrontalsPreviewRow = { rowNumber, sheetName, brand: currentBrand, model, category: "frontals", serviceType: "Troca de tela / frontal", quality: parsed.quality, supplierCost: parsed.cost, estimatedPrice: parsed.cost === null ? null : Math.round((parsed.cost * 2 + 30) * 100) / 100, rawValue, valid: parsed.cost !== null, issue: parsed.cost === null ? "Valor não reconhecido" : undefined, duplicateKey: keyOf({ brand: currentBrand, model, quality: parsed.quality }) };
        if (seen.has(row.duplicateKey)) row.issue = row.issue ? `${row.issue}; duplicidade detectada` : "Duplicidade detectada";
        else seen.add(row.duplicateKey);
        rows.push(row);
      }
    });
  }

  const duplicateRows = rows.filter((row) => row.issue?.includes("duplicidade")).length;
  return { rows, rowsTotal, validRows: rows.filter((row) => row.valid).length, invalidRows: rows.filter((row) => !row.valid).length, duplicateRows, brands: Array.from(brands), models: new Set(rows.map((row) => `${row.brand}|${row.model}`)).size, sheetsRead };
}

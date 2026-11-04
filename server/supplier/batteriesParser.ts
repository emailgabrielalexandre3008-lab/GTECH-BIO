import * as XLSX from "xlsx";

export type BatteriesPreviewRow = {
  rowNumber: number;
  sheetName: string;
  brand: string;
  model: string;
  category: "batteries";
  serviceType: "Troca de bateria";
  quality: string | null;
  supplierCost: number | null;
  estimatedPrice: number | null;
  rawValue: string;
  valid: boolean;
  issue?: string;
  duplicateKey: string;
};

export type BatteriesParseResult = {
  rows: BatteriesPreviewRow[];
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

function parseMoney(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  const raw = normalizeText(value);
  if (!raw) return null;
  const numeric = Number(raw.replace(/R\$\s*/i, "").replace(".", "").replace(",", "."));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function keyOf(row: Pick<BatteriesPreviewRow, "brand" | "model" | "quality">) {
  return [row.brand, row.model, row.quality ?? "sem-qualidade"].map((part) => part.toLowerCase().replace(/\s+/g, " ").trim()).join("|");
}

export function parseBatteriesWorkbook(buffer: Buffer): BatteriesParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: false, raw: true });
  const rows: BatteriesPreviewRow[] = [];
  const brands = new Set<string>();
  const sheetsRead: string[] = [];
  const seen = new Set<string>();
  let rowsTotal = 0;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const values = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: null, blankrows: false });
    if (!values.length) continue;
    sheetsRead.push(sheetName);
    let currentBrand = "Não identificado";
    let qualities: string[] = [];

    values.forEach((cells, index) => {
      const rowNumber = index + 1;
      const first = normalizeText(cells[0]);
      const second = normalizeText(cells[1]);
      const third = normalizeText(cells[2]);
      if (!first) return;
      if (first.toUpperCase() === "TYROS CELL") return;
      if (first.toUpperCase() === "MODELO") {
        qualities = [second || "CHINA", third || "ORI TYROS"];
        return;
      }
      const nextNonEmpty = values.slice(index + 1, index + 3).find((next) => normalizeText(next?.[0]).toUpperCase() === "MODELO");
      if (cells.slice(1).every((value) => value === null || value === undefined || normalizeText(value) === "") && nextNonEmpty) {
        currentBrand = first.toUpperCase();
        brands.add(currentBrand);
        qualities = [];
        return;
      }
      if (!qualities.length) return;
      const model = first;
      rowsTotal += 1;
      for (let column = 1; column <= qualities.length; column += 1) {
        const quality = qualities[column - 1] || null;
        const supplierCost = parseMoney(cells[column]);
        const duplicateKey = keyOf({ brand: currentBrand, model, quality });
        const row: BatteriesPreviewRow = {
          rowNumber,
          sheetName,
          brand: currentBrand,
          model,
          category: "batteries",
          serviceType: "Troca de bateria",
          quality,
          supplierCost,
          estimatedPrice: supplierCost === null ? null : Math.round((supplierCost * 2 + 30) * 100) / 100,
          rawValue: normalizeText(cells[column]),
          valid: supplierCost !== null,
          issue: supplierCost === null ? "Valor não informado" : undefined,
          duplicateKey,
        };
        if (seen.has(duplicateKey)) row.issue = row.issue ? `${row.issue}; duplicidade detectada` : "Duplicidade detectada";
        else seen.add(duplicateKey);
        rows.push(row);
      }
    });
  }

  return {
    rows,
    rowsTotal,
    validRows: rows.filter((row) => row.valid).length,
    invalidRows: rows.filter((row) => !row.valid).length,
    duplicateRows: rows.filter((row) => row.issue?.includes("duplicidade")).length,
    brands: Array.from(brands),
    models: new Set(rows.map((row) => `${row.brand}|${row.model}`)).size,
    sheetsRead,
  };
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { createClient } from "@/lib/supabase/client";

interface ParsedRow {
  rowNumber: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  category: string;
  is_active: boolean;
}

interface ImportResult {
  created: number;
  updated: number;
  error: string | null;
}

function getField(raw: Record<string, unknown>, key: string) {
  const foundKey = Object.keys(raw).find((k) => k.trim().toLowerCase() === key);
  return foundKey ? raw[foundKey] : undefined;
}

function parseRow(raw: Record<string, unknown>, rowNumber: number): { row: ParsedRow | null; error?: string } {
  const name = String(getField(raw, "name") ?? "").trim();
  const priceRaw = getField(raw, "price");
  const price =
    typeof priceRaw === "number" ? priceRaw : parseFloat(String(priceRaw ?? "").replace(/[^0-9.-]/g, ""));

  if (!name) return { row: null, error: `Row ${rowNumber}: missing name` };
  if (!Number.isFinite(price)) return { row: null, error: `Row ${rowNumber}: missing or invalid price` };

  const isActiveRaw = getField(raw, "is_active");
  const is_active =
    isActiveRaw === undefined || isActiveRaw === ""
      ? true
      : isActiveRaw === true ||
        isActiveRaw === 1 ||
        String(isActiveRaw).trim().toLowerCase() === "true";

  return {
    row: {
      rowNumber,
      name,
      description: String(getField(raw, "description") ?? "").trim(),
      sku: String(getField(raw, "sku") ?? "").trim(),
      price,
      category: String(getField(raw, "category") ?? "").trim(),
      is_active,
    },
  };
}

function downloadTemplate() {
  const headers = ["name", "description", "sku", "price", "category", "is_active"];
  const example = [
    "Steel Hinge 3-inch",
    "Heavy-duty stainless steel door hinge, 3 inch.",
    "HNG-3IN",
    4.5,
    "Hardware",
    true,
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, "product-import-template.xlsx");
}

export function BulkImportProducts() {
  const router = useRouter();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  function handleFile(file: File) {
    setResult(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const validRows: ParsedRow[] = [];
      const errors: string[] = [];
      raw.forEach((r, i) => {
        const { row, error } = parseRow(r, i + 2); // +2: header row + 1-indexed
        if (row) validRows.push(row);
        if (error) errors.push(error);
      });

      setRows(validRows);
      setParseErrors(errors);
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleImport() {
    setImporting(true);
    const supabase = createClient();

    const skus = rows.map((r) => r.sku).filter(Boolean);
    const existingBySku = new Map<string, string>();
    if (skus.length > 0) {
      const { data: existing } = await supabase
        .from("products")
        .select("id, sku")
        .in("sku", skus);
      for (const p of existing ?? []) existingBySku.set(p.sku, p.id);
    }

    const toUpdate = rows.filter((r) => r.sku && existingBySku.has(r.sku));
    const toInsert = rows.filter((r) => !r.sku || !existingBySku.has(r.sku));

    let error: string | null = null;

    for (const row of toUpdate) {
      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          is_active: row.is_active,
        })
        .eq("id", existingBySku.get(row.sku)!);
      if (updateError) error = updateError.message;
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase.from("products").insert(
        toInsert.map((r) => ({
          name: r.name,
          description: r.description,
          sku: r.sku,
          price: r.price,
          category: r.category,
          is_active: r.is_active,
        })),
      );
      if (insertError) error = insertError.message;
    }

    setImporting(false);
    setResult({ created: toInsert.length, updated: toUpdate.length, error });
    setRows([]);
    setFileName("");
    router.refresh();
  }

  return (
    <div className="rounded-[14px] border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-head text-sm font-bold text-gray-900">Import products</p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="text-[13px] font-semibold text-navy-600 hover:text-brand-red"
        >
          Download template &darr;
        </button>
      </div>
      <p className="mt-1 text-[13px] text-gray-500">
        Columns: name, description, sku, price, category, is_active. Rows
        whose SKU matches an existing product update it instead of creating
        a duplicate &mdash; rows without a SKU are always added as new.
      </p>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="mt-4 block w-full text-sm"
      />

      {parseErrors.length > 0 && (
        <div className="mt-3 rounded-[9px] bg-red-50 p-3 text-[13px] text-brand-red">
          {parseErrors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-4">
          <p className="text-[13px] font-semibold text-gray-700">
            {fileName}: {rows.length} product{rows.length === 1 ? "" : "s"} ready to import
          </p>
          <div className="mt-2 overflow-x-auto rounded-[9px] border border-gray-100">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.slice(0, 5).map((r) => (
                  <tr key={r.rowNumber}>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.name}</td>
                    <td className="px-3 py-2 text-gray-500">{r.sku || "—"}</td>
                    <td className="px-3 py-2 text-gray-500">${r.price.toFixed(2)}</td>
                    <td className="px-3 py-2 text-gray-500">{r.category || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 5 && (
            <p className="mt-1 text-[12px] text-gray-400">+{rows.length - 5} more row(s)</p>
          )}

          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="mt-4 rounded-[10px] bg-brand-red px-5 py-2.5 font-head text-[13.5px] font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
          >
            {importing ? "Importing..." : `Import ${rows.length} product${rows.length === 1 ? "" : "s"}`}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-[9px] bg-navy-50 p-3 text-[13px] text-gray-800">
          {result.error ? (
            <p className="text-brand-red">Some rows failed: {result.error}</p>
          ) : (
            <p>
              Done &mdash; created {result.created}, updated {result.updated}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UploadResult {
  matched: string[];
  unmatched: string[];
}

function baseName(fileName: string) {
  return fileName.replace(/\.[^./]+$/, "").trim().toLowerCase();
}

export function BulkImageUpload() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  async function handleUpload() {
    setUploading(true);
    setResult(null);
    const supabase = createClient();

    const { data: products } = await supabase.from("products").select("id, sku");
    const bySku = new Map<string, string>();
    for (const p of products ?? []) {
      if (p.sku) bySku.set(p.sku.trim().toLowerCase(), p.id);
    }

    const matched: string[] = [];
    const unmatched: string[] = [];

    for (const file of files) {
      const productId = bySku.get(baseName(file.name));
      if (!productId) {
        unmatched.push(file.name);
        continue;
      }

      const path = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file);

      if (uploadError) {
        unmatched.push(`${file.name} (${uploadError.message})`);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
      await supabase.from("products").update({ image_url: publicUrl.publicUrl }).eq("id", productId);
      matched.push(file.name);
    }

    setUploading(false);
    setResult({ matched, unmatched });
    setFiles([]);
    router.refresh();
  }

  return (
    <div className="rounded-[14px] border border-gray-100 bg-white p-5">
      <p className="font-head text-sm font-bold text-gray-900">Bulk upload images</p>
      <p className="mt-1 text-[13px] text-gray-500">
        Name each image file after the product&apos;s SKU (e.g.{" "}
        <span className="font-mono">HNG-3IN.jpg</span>) and select them all at
        once &mdash; each one attaches to the matching product automatically.
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        className="mt-4 block w-full text-sm"
      />

      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 rounded-[10px] bg-brand-red px-5 py-2.5 font-head text-[13.5px] font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
        >
          {uploading ? "Uploading..." : `Upload ${files.length} image${files.length === 1 ? "" : "s"}`}
        </button>
      )}

      {result && (
        <div className="mt-4 space-y-2 rounded-[9px] bg-navy-50 p-3 text-[13px] text-gray-800">
          <p>Attached {result.matched.length} image(s).</p>
          {result.unmatched.length > 0 && (
            <div>
              <p className="font-semibold text-brand-red">
                {result.unmatched.length} file(s) didn&apos;t match a SKU:
              </p>
              {result.unmatched.map((name) => (
                <p key={name} className="text-gray-600">
                  {name}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

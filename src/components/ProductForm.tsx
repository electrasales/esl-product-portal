"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const imageUrl = product?.image_url ?? "";
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        finalImageUrl = data.publicUrl;
      }

      const payload = {
        name,
        description,
        sku,
        price: Number(price) || 0,
        category,
        is_active: isActive,
        image_url: finalImageUrl || null,
      };

      const { error: saveError } = isEditing
        ? await supabase.from("products").update(payload).eq("id", product!.id)
        : await supabase.from("products").insert(payload);

      if (saveError) throw saveError;

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1.5 block w-full rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1.5 block w-full rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1.5 block w-full rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 block w-full rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700">
          Price (USD)
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="mt-1.5 block w-full rounded-[10px] border-[1.5px] border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700">Image</label>
        {imageUrl && !imageFile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Current product"
            className="mt-2 h-24 w-24 rounded-md object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Visible to customers
      </label>

      {error && (
        <p className="text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[10px] bg-brand-red px-5 py-2.5 font-head text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}

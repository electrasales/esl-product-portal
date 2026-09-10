"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

export function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await supabase.from("products").delete().eq("id", product.id);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[9px] bg-gray-50">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="font-head text-sm font-bold text-gray-900">{product.name}</p>
          <p className="text-xs text-gray-400">
            ${product.price.toFixed(2)}
            {product.category ? ` · ${product.category}` : ""}
            {!product.is_active ? " · hidden" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="text-sm font-semibold text-navy-600 hover:text-navy-900"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-semibold text-brand-red hover:underline disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

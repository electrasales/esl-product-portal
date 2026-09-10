"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/database";
import { QuickAddButton } from "@/components/QuickAddButton";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex items-center gap-2 rounded-[9px] border border-gray-200 bg-white px-3 py-2 sm:w-[240px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9295A0" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        {categories.length > 1 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-[9px] border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 focus:border-navy-600 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-gray-500">
          No products match your search.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-[14px] border border-gray-100 bg-white transition hover:shadow-[0_12px_28px_rgba(31,32,36,0.08)]"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-50">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#C3C5CC" strokeWidth="1.6">
                      <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
                      <path d="M3 8v8l9 5 9-5V8" />
                      <path d="M12 13v8" />
                    </svg>
                  )}
                </div>
                <div className="px-3.5 pt-3.5">
                  {product.category && (
                    <span className="rounded-[5px] bg-navy-50 px-[7px] py-0.5 text-[10.5px] font-bold text-navy-600">
                      {product.category.toUpperCase()}
                    </span>
                  )}
                  <h3 className="mt-2 font-head text-[13.5px] font-bold text-gray-900">
                    {product.name}
                  </h3>
                </div>
              </Link>
              <div className="flex items-center justify-between px-3.5 pb-3.5 pt-1.5">
                <span className="font-head text-[15px] font-extrabold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <QuickAddButton product={{ id: product.id, name: product.name, price: product.price }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

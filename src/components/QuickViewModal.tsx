"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import type { Product } from "@/types/database";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-[880px] grid-cols-1 overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_rgba(15,20,60,0.35)] sm:grid-cols-2"
      >
        <div className="relative flex aspect-square items-center justify-center bg-gray-50 sm:aspect-auto">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow hover:text-brand-red sm:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C3C5CC" strokeWidth="1.4">
              <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
          )}
        </div>

        <div className="relative flex flex-col p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 hidden h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-brand-red sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {product.category && (
            <span className="w-fit rounded-[5px] bg-navy-50 px-2 py-0.5 text-[10.5px] font-bold text-navy-600">
              {product.category.toUpperCase()}
            </span>
          )}
          <h2 className="mt-2.5 font-head text-xl font-extrabold text-gray-900">
            {product.name}
          </h2>
          {product.sku && <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>}
          <p className="mt-3 font-head text-2xl font-extrabold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="mt-3 max-h-32 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-[10px] border-[1.5px] border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                addItem({ id: product.id, name: product.name, price: product.price }, quantity);
                setAdded(true);
              }}
              className="flex-1 rounded-[10px] bg-brand-red py-2.5 font-head text-[13.5px] font-bold text-white hover:bg-brand-red-dark"
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="mt-4 text-[13px] font-semibold text-navy-600 hover:text-brand-red"
          >
            View full details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { downloadQuotePdf } from "@/lib/quotePdf";
import { submitRequest } from "@/app/(customer)/actions";

function CartBreadcrumb() {
  return (
    <section className="bg-navy-600 px-4 py-3.5 sm:px-8">
      <div className="mx-auto flex max-w-[1320px] gap-6">
        <Link href="/" className="text-[13px] font-semibold text-white/70 hover:text-white">
          &larr; Catalog
        </Link>
        <span className="border-b-2 border-white pb-0.5 text-[13px] font-bold text-white">
          Your Cart
        </span>
        <Link href="/my-requests" className="text-[13px] font-semibold text-white/70 hover:text-white">
          My Requests
        </Link>
      </div>
    </section>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear } = useCart();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadQuotePdf(items, "");
    } finally {
      setDownloading(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const result = await submitRequest(items, notes);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    clear();
    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col">
        <CartBreadcrumb />
        <div className="mx-auto max-w-md flex-1 px-4 py-20 text-center">
          <h1 className="font-head text-2xl font-extrabold text-gray-900">
            Request submitted
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Thanks &mdash; the owner will review your request and follow up
            with you directly.
          </p>
          <Link
            href="/my-requests"
            className="mt-6 inline-block rounded-[10px] bg-brand-red px-5 py-3 font-head text-sm font-bold text-white hover:bg-brand-red-dark"
          >
            View my requests
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <CartBreadcrumb />
        <div className="mx-auto flex-1 px-4 py-20 text-center">
          <h1 className="font-head text-2xl font-extrabold text-gray-900">Your cart</h1>
          <p className="mt-2 text-sm text-gray-500">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-[10px] bg-brand-red px-5 py-3 font-head text-sm font-bold text-white hover:bg-brand-red-dark"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <CartBreadcrumb />

      <main className="mx-auto w-full max-w-[860px] px-4 py-12 sm:px-8">
        <h1 className="font-head text-[26px] font-extrabold text-gray-900">Your cart</h1>
        <p className="mt-1 text-[13.5px] text-gray-500">
          Review your items, then download a quote or send the request to Electra Sales.
        </p>

        <div className="mt-7 divide-y divide-gray-100 rounded-[14px] border border-gray-100 bg-white">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="flex min-w-[190px] flex-1 items-center gap-4">
                <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[9px] bg-gray-50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C3C5CC" strokeWidth="1.6">
                    <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
                    <path d="M3 8v8l9 5 9-5V8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="font-head text-sm font-bold text-gray-900">{item.name}</div>
                  <div className="mt-0.5 text-xs text-gray-400">${item.price.toFixed(2)} each</div>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-normal">
                <div className="flex flex-shrink-0 items-center overflow-hidden rounded-[8px] border border-gray-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="w-[70px] flex-shrink-0 text-right font-head text-sm font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.name}`}
                  className="flex-shrink-0 p-1 text-gray-300 hover:text-brand-red"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline justify-end gap-2.5">
          <span className="text-[13.5px] font-semibold text-gray-500">Total</span>
          <span className="font-head text-[22px] font-extrabold text-gray-900">${total.toFixed(2)}</span>
        </div>

        <div className="mt-7">
          <label htmlFor="notes" className="text-[13px] font-semibold text-gray-700">
            Notes for Electra Sales <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Delivery instructions, project reference, etc."
            className="mt-2 block w-full resize-none rounded-[10px] border-[1.5px] border-gray-200 bg-gray-50/60 px-3.5 py-3 text-[13.5px] text-gray-900 focus:border-navy-600 focus:outline-none"
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-brand-red" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-[10px] border-[1.5px] border-navy-600 bg-white px-5 py-3 font-head text-[13.5px] font-bold text-navy-600 hover:bg-navy-50 disabled:opacity-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {downloading ? "Preparing PDF..." : "Download Quote (PDF)"}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-[10px] bg-brand-red px-6 py-3 font-head text-[13.5px] font-bold text-white hover:bg-brand-red-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Order Request"}
          </button>
        </div>
      </main>
    </div>
  );
}

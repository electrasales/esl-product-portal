"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { downloadQuotePdf } from "@/lib/quotePdf";
import { submitRequest } from "@/app/(customer)/actions";

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
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Request submitted
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Thanks — the owner will review your request and follow up with you
          directly.
        </p>
        <Link
          href="/my-requests"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          View my requests
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Your cart</h1>
        <p className="mt-2 text-sm text-gray-500">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Your cart</h1>

      <div className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, Math.max(1, Number(e.target.value)))
              }
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            <p className="w-20 text-right text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end text-lg font-semibold text-gray-900">
        Total: ${total.toFixed(2)}
      </div>

      <div className="mt-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes for the owner <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {downloading ? "Preparing PDF..." : "Download quote (PDF)"}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit order request"}
        </button>
      </div>
    </div>
  );
}

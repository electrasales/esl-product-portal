"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

export function AddToCartForm({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-6 flex items-center gap-3">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => {
          addItem(product, quantity);
          setAdded(true);
          router.refresh();
        }}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Add to cart
      </button>
      {added && <span className="text-sm text-green-600">Added</span>}
    </div>
  );
}

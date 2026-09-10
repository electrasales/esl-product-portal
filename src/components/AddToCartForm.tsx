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
        className="w-20 rounded-[10px] border-[1.5px] border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-navy-600 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => {
          addItem(product, quantity);
          setAdded(true);
          router.refresh();
        }}
        className="rounded-[10px] bg-brand-red px-5 py-2.5 font-head text-[13.5px] font-bold text-white hover:bg-brand-red-dark"
      >
        Add to cart
      </button>
      {added && <span className="text-sm font-medium text-navy-600">Added</span>}
    </div>
  );
}

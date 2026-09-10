"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

export function QuickAddButton({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product, 1);
        setAdded(true);
        router.refresh();
      }}
      className="rounded-[7px] bg-brand-red px-[11px] py-1.5 text-[11.5px] font-bold text-white hover:bg-brand-red-dark"
    >
      {added ? "Added" : "Add"}
    </button>
  );
}

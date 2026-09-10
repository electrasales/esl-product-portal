"use client";

import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = "esl-cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("esl-cart-updated"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Deferred to an effect so the client's first render matches the
    // server's (localStorage doesn't exist during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
    const sync = () => setItems(readCart());
    window.addEventListener("esl-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("esl-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addItem = useCallback(
    (product: { id: string; name: string; price: number }, quantity: number) => {
      const current = readCart();
      const existing = current.find((i) => i.productId === product.id);
      const next = existing
        ? current.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [
            ...current,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity,
            },
          ];
      writeCart(next);
      setItems(next);
    },
    [],
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const current = readCart();
    const next =
      quantity <= 0
        ? current.filter((i) => i.productId !== productId)
        : current.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          );
    writeCart(next);
    setItems(next);
  }, []);

  const removeItem = useCallback((productId: string) => {
    const next = readCart().filter((i) => i.productId !== productId);
    writeCart(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    writeCart([]);
    setItems([]);
  }, []);

  return { items, addItem, updateQuantity, removeItem, clear };
}

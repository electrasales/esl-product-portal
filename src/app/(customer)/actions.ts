"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/cart";

export async function submitRequest(items: CartItem[], notes: string) {
  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: request, error: requestError } = await supabase
    .from("requests")
    .insert({ customer_id: user.id, notes })
    .select("id")
    .single();

  if (requestError || !request) {
    return { error: requestError?.message ?? "Could not create request." };
  }

  const { error: itemsError } = await supabase.from("request_items").insert(
    items.map((item) => ({
      request_id: request.id,
      product_id: item.productId,
      product_name_snapshot: item.name,
      unit_price_snapshot: item.price,
      quantity: item.quantity,
    })),
  );

  if (itemsError) {
    return { error: itemsError.message };
  }

  revalidatePath("/my-requests");
  return { error: null };
}

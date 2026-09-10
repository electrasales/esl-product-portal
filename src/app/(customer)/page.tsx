import { createClient } from "@/lib/supabase/server";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import type { Product } from "@/types/database";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name")
    .returns<Product[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
      <p className="mt-1 text-sm text-gray-500">
        Browse the catalog, then add items to your cart to get a quote or
        request an order.
      </p>
      <div className="mt-6">
        <CatalogBrowser products={products ?? []} />
      </div>
    </div>
  );
}

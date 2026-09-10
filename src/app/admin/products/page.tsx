import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductRow } from "@/components/ProductRow";
import type { Product } from "@/types/database";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Product[]>();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No products yet. Add your first one to get started.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

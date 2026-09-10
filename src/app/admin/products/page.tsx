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
        <h1 className="font-head text-2xl font-extrabold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-[10px] bg-brand-red px-4 py-2.5 font-head text-sm font-bold text-white hover:bg-brand-red-dark"
        >
          Add product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No products yet. Add your first one to get started.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-gray-100 rounded-[14px] border border-gray-100 bg-white">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

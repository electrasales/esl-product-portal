import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddToCartForm } from "@/components/AddToCartForm";
import type { Product } from "@/types/database";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single<Product>();

  if (!product) notFound();

  return (
    <div>
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Back to catalog
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {product.category}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            {product.name}
          </h1>
          {product.sku && (
            <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>
          )}
          <p className="mt-4 text-xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm text-gray-600">
              {product.description}
            </p>
          )}

          <AddToCartForm
            product={{ id: product.id, name: product.name, price: product.price }}
          />
        </div>
      </div>
    </div>
  );
}

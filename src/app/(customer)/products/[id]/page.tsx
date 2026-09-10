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
    <div className="mx-auto w-full max-w-[1320px] px-4 py-10 sm:px-8">
      <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-navy-600">
        &larr; Back to catalog
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[14px] bg-gray-50">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C3C5CC" strokeWidth="1.4">
              <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
          )}
        </div>

        <div>
          {product.category && (
            <span className="rounded-[5px] bg-navy-50 px-2 py-0.5 text-[10.5px] font-bold text-navy-600">
              {product.category.toUpperCase()}
            </span>
          )}
          <h1 className="mt-2.5 font-head text-2xl font-extrabold text-gray-900">
            {product.name}
          </h1>
          {product.sku && (
            <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>
          )}
          <p className="mt-4 font-head text-xl font-extrabold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-600">
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

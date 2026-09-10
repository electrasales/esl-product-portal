import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/ProductForm";
import type { Product } from "@/types/database";

export default async function EditProductPage({
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
      <h1 className="text-2xl font-semibold text-gray-900">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}

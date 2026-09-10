import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { CatalogBrowser } from "@/components/CatalogBrowser";
import { HomeHero } from "@/components/HomeHero";
import type { Product } from "@/types/database";

export default async function CatalogPage() {
  const supabase = await createClient();
  const [{ data: products }, user] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .returns<Product[]>(),
    getCurrentUser(),
  ]);

  const firstName = user?.profile.full_name.trim().split(/\s+/)[0] || "there";

  return (
    <div>
      <HomeHero firstName={firstName} />

      <section className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-12 sm:px-8">
        <h2 className="font-head text-[21px] font-extrabold text-gray-900">Products</h2>
        <div className="mt-5">
          <CatalogBrowser products={products ?? []} />
        </div>
      </section>
    </div>
  );
}

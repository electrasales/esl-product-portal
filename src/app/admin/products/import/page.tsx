import Link from "next/link";
import { BulkImportProducts } from "@/components/BulkImportProducts";
import { BulkImageUpload } from "@/components/BulkImageUpload";

export default function ImportProductsPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm font-semibold text-gray-500 hover:text-navy-600">
        &larr; Back to products
      </Link>

      <h1 className="mt-3 font-head text-2xl font-extrabold text-gray-900">Bulk import</h1>
      <p className="mt-1 text-[13.5px] text-gray-500">
        Add or update many products from a spreadsheet, then attach photos
        to them all at once.
      </p>

      <div className="mt-6 space-y-6">
        <BulkImportProducts />
        <BulkImageUpload />
      </div>
    </div>
  );
}

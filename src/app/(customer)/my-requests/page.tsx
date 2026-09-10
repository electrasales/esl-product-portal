import { createClient } from "@/lib/supabase/server";
import type { RequestWithItems } from "@/types/database";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-navy-50 text-navy-600",
  reviewed: "bg-amber-100 text-amber-800",
  fulfilled: "bg-green-100 text-green-800",
};

export default async function MyRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: requests } = await supabase
    .from("requests")
    .select("*, request_items(*)")
    .eq("customer_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .returns<RequestWithItems[]>();

  return (
    <div className="mx-auto w-full max-w-[860px] px-4 py-12 sm:px-8">
      <h1 className="font-head text-[26px] font-extrabold text-gray-900">My requests</h1>

      {!requests || requests.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          You haven&apos;t submitted any order requests yet.
        </p>
      ) : (
        <div className="mt-7 space-y-4">
          {requests.map((request) => {
            const total = request.request_items.reduce(
              (sum, i) => sum + i.unit_price_snapshot * i.quantity,
              0,
            );
            return (
              <div
                key={request.id}
                className="rounded-[14px] border border-gray-100 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-gray-400">
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[request.status]}`}
                  >
                    {request.status}
                  </span>
                </div>

                <ul className="mt-3 divide-y divide-gray-50 text-sm">
                  {request.request_items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between py-1.5 text-gray-700"
                    >
                      <span>
                        {item.product_name_snapshot} &times; {item.quantity}
                      </span>
                      <span>
                        ${(item.unit_price_snapshot * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                {request.notes && (
                  <p className="mt-2 text-xs text-gray-400">
                    Note: {request.notes}
                  </p>
                )}

                <p className="mt-2 text-right font-head text-sm font-bold text-gray-900">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

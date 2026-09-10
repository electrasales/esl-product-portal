import { createClient } from "@/lib/supabase/server";
import { RequestStatusSelect } from "@/components/RequestStatusSelect";
import type { RequestWithItems } from "@/types/database";

export default async function AdminRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("requests")
    .select("*, request_items(*), profiles(full_name, phone)")
    .order("created_at", { ascending: false })
    .returns<RequestWithItems[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Incoming requests
      </h1>

      {!requests || requests.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No order requests yet. They&apos;ll show up here as customers submit
          them.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {requests.map((request) => {
            const total = request.request_items.reduce(
              (sum, i) => sum + i.unit_price_snapshot * i.quantity,
              0,
            );
            return (
              <div
                key={request.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {request.profiles?.full_name || "Customer"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.profiles?.phone}
                      {request.profiles?.phone ? " · " : ""}
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                  <RequestStatusSelect
                    requestId={request.id}
                    status={request.status}
                  />
                </div>

                <ul className="mt-3 divide-y divide-gray-100 text-sm">
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
                  <p className="mt-2 text-xs text-gray-500">
                    Note: {request.notes}
                  </p>
                )}

                <p className="mt-2 text-right text-sm font-semibold text-gray-900">
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

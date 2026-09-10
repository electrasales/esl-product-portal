"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { RequestStatus } from "@/types/database";

const STATUSES: RequestStatus[] = ["new", "reviewed", "fulfilled"];

export function RequestStatusSelect({
  requestId,
  status,
}: {
  requestId: string;
  status: RequestStatus;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [updating, setUpdating] = useState(false);

  async function handleChange(next: RequestStatus) {
    setUpdating(true);
    await supabase.from("requests").update({ status: next }).eq("id", requestId);
    setUpdating(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as RequestStatus)}
      className="rounded-md border border-gray-300 px-2 py-1 text-xs capitalize shadow-sm focus:border-gray-900 focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

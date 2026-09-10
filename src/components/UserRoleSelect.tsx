"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/app/admin/users/actions";

export function UserRoleSelect({
  userId,
  role,
}: {
  userId: string;
  role: "customer" | "staff";
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(next: "customer" | "staff") {
    setUpdating(true);
    await updateUserRole(userId, next);
    setUpdating(false);
    router.refresh();
  }

  return (
    <select
      value={role}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as "customer" | "staff")}
      className="rounded-[7px] border border-gray-200 px-2.5 py-1.5 text-xs font-semibold capitalize text-gray-700 focus:border-navy-600 focus:outline-none"
    >
      <option value="customer">Customer</option>
      <option value="staff">Staff</option>
    </select>
  );
}

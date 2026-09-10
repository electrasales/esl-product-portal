import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CreateUserForm } from "@/components/CreateUserForm";
import { UserRoleSelect } from "@/components/UserRoleSelect";
import type { Profile } from "@/types/database";

const ROLE_STYLES: Record<string, string> = {
  owner: "bg-brand-red/10 text-brand-red",
  staff: "bg-navy-50 text-navy-600",
  customer: "bg-gray-100 text-gray-600",
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.profile.role !== "owner") redirect("/admin/products");

  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="font-head text-2xl font-extrabold text-gray-900">Users</h1>
      <p className="mt-1 text-[13.5px] text-gray-500">
        Create customer and staff accounts, and manage who has staff access.
      </p>

      <div className="mt-6">
        <CreateUserForm />
      </div>

      <div className="mt-6 divide-y divide-gray-100 rounded-[14px] border border-gray-100 bg-white">
        {(users ?? []).map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="min-w-[180px] flex-1">
              <p className="font-head text-sm font-bold text-gray-900">
                {u.full_name || "(no name)"}
              </p>
              <p className="text-xs text-gray-400">
                {u.email}
                {u.phone ? ` · ${u.phone}` : ""}
              </p>
            </div>
            {u.role === "owner" || u.id === user.authUser.id ? (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${ROLE_STYLES[u.role]}`}
              >
                {u.role}
              </span>
            ) : (
              <UserRoleSelect userId={u.id} role={u.role as "customer" | "staff"} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

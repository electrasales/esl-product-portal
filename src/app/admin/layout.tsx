import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.profile.role !== "owner" && user.profile.role !== "staff") redirect("/");

  const links = [
    { href: "/admin/products", label: "Products" },
    { href: "/admin/requests", label: "Requests" },
    ...(user.profile.role === "owner"
      ? [{ href: "/admin/users", label: "Users" }]
      : []),
    { href: "/", label: "View Store" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <NavBar links={links} fullName={user.profile.full_name} />
      <main className="mx-auto w-full max-w-[1320px] flex-1 bg-gray-50 px-4 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}

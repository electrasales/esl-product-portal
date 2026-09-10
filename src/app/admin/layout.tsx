import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

const ADMIN_LINKS = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/requests", label: "Requests" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.profile.role !== "owner") redirect("/");

  return (
    <div className="flex flex-1 flex-col">
      <NavBar links={ADMIN_LINKS} fullName={user.profile.full_name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}

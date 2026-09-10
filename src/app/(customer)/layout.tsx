import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

const CUSTOMER_LINKS = [
  { href: "/", label: "Catalog" },
  { href: "/cart", label: "Cart" },
  { href: "/my-requests", label: "My Requests" },
];

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const links =
    user.profile.role === "owner" || user.profile.role === "staff"
      ? [...CUSTOMER_LINKS, { href: "/admin/products", label: "Admin" }]
      : CUSTOMER_LINKS;

  return (
    <div className="flex flex-1 flex-col">
      <NavBar links={links} fullName={user.profile.full_name} />
      <main className="flex flex-1 flex-col bg-gray-50">{children}</main>
    </div>
  );
}

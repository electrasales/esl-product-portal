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
  if (user.profile.role === "owner") redirect("/admin/products");

  return (
    <div className="flex flex-1 flex-col">
      <NavBar links={CUSTOMER_LINKS} fullName={user.profile.full_name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";

interface NavLink {
  href: string;
  label: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function NavBar({
  links,
  fullName,
}: {
  links: NavLink[];
  fullName: string;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-9 gap-y-2 px-4 py-3 sm:px-8">
        <Logo />

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "border-b-2 border-brand-red pb-1 text-sm font-semibold text-brand-red"
                    : "pb-1 text-sm font-semibold text-gray-500 hover:text-gray-900"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-600 font-head text-xs font-bold text-white">
              {initials(fullName)}
            </span>
            <span className="text-sm font-semibold text-gray-800">{fullName}</span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-2 py-1 text-sm font-medium text-gray-500 underline hover:text-gray-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

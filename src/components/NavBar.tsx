import Link from "next/link";
import { signOut } from "@/app/auth/actions";

interface NavLink {
  href: string;
  label: string;
}

export function NavBar({
  links,
  fullName,
}: {
  links: NavLink[];
  fullName: string;
}) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-semibold text-gray-900">ESL Product Portal</span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 sm:inline">
            {fullName}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-gray-600 underline hover:text-gray-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

const TILES = [
  {
    href: "/",
    title: "Browse Catalog",
    description: "Search and filter the full product range by category.",
    tint: "bg-navy-50 text-navy-600",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/cart",
    title: "Download a Quote",
    description: "Turn your cart into a PDF quote in one click.",
    tint: "bg-red-50 text-brand-red",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    ),
  },
  {
    href: "/my-requests",
    title: "Track Requests",
    description: "See the status of every order request you've sent.",
    tint: "bg-navy-50 text-navy-600",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export function HomeHero({ firstName }: { firstName: string }) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-600 px-4 pb-16 pt-12 sm:px-8">
        <svg
          className="pointer-events-none absolute -top-14 right-[-40px] h-[420px] w-[420px] opacity-[0.14]"
          viewBox="0 0 420 420"
          fill="none"
        >
          <line x1="0" y1="420" x2="420" y2="0" stroke="#ffffff" strokeWidth="24" />
          <line x1="60" y1="420" x2="420" y2="60" stroke="#ED1C24" strokeWidth="16" />
          <line x1="120" y1="420" x2="420" y2="120" stroke="#ffffff" strokeWidth="10" />
        </svg>

        <div className="relative mx-auto max-w-[1320px]">
          <p className="text-xs font-bold uppercase tracking-widest text-white/65">
            Electra Sales Limited &middot; Product Portal
          </p>
          <h1 className="mt-2.5 font-head text-[34px] font-extrabold leading-tight text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
            Browse the catalog, build a quote, and track your order requests
            &mdash; all in one place.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-[10px] bg-white px-5 py-3 font-head text-[13.5px] font-bold text-navy-600"
            >
              Browse Catalog
            </Link>
            <Link
              href="/cart"
              className="rounded-[10px] border-[1.5px] border-white/50 bg-white/10 px-5 py-3 font-head text-[13.5px] font-bold text-white"
            >
              My Cart
            </Link>
            <Link
              href="/my-requests"
              className="rounded-[10px] border-[1.5px] border-white/50 bg-white/10 px-5 py-3 font-head text-[13.5px] font-bold text-white"
            >
              My Requests
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 w-full max-w-[1320px] px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TILES.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="rounded-[14px] bg-white p-[22px] shadow-[0_4px_16px_rgba(20,24,60,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(31,32,36,0.1)]"
            >
              <div className={`mb-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-[10px] ${tile.tint}`}>
                {tile.icon}
              </div>
              <div className="font-head text-[15px] font-bold text-gray-900">{tile.title}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-gray-500">{tile.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

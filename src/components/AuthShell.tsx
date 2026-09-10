import { Logo } from "@/components/Logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-br from-navy-900 via-navy-600 to-navy-700">
      <svg
        className="pointer-events-none absolute -bottom-36 -left-32 h-[520px] w-[520px] opacity-[0.14]"
        viewBox="0 0 420 420"
        fill="none"
      >
        <line x1="0" y1="420" x2="420" y2="0" stroke="#ffffff" strokeWidth="26" />
        <line x1="70" y1="420" x2="420" y2="70" stroke="#ED1C24" strokeWidth="18" />
        <line x1="140" y1="420" x2="420" y2="140" stroke="#ffffff" strokeWidth="10" />
      </svg>
      <svg
        className="pointer-events-none absolute -right-24 -top-28 h-[420px] w-[420px] opacity-10"
        viewBox="0 0 420 420"
        fill="none"
      >
        <line x1="0" y1="420" x2="420" y2="0" stroke="#ffffff" strokeWidth="20" />
        <line x1="70" y1="420" x2="420" y2="70" stroke="#ffffff" strokeWidth="10" />
      </svg>

      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[428px] rounded-[20px] bg-white px-10 pb-9 pt-11 shadow-[0_30px_70px_rgba(15,20,60,0.35)]">
          <div className="flex flex-col items-center gap-2.5">
            <Logo size={52} />
          </div>
          {children}
        </div>
      </div>

      <footer className="relative flex items-center justify-between bg-navy-950 px-8 py-4">
        <span className="text-xs text-white/60">&copy; {new Date().getFullYear()} Electra Sales Limited</span>
        <div className="flex gap-5">
          <span className="text-xs text-white/60">Privacy Policy</span>
          <span className="text-xs text-white/60">Need help?</span>
        </div>
      </footer>
    </div>
  );
}

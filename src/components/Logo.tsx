export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="logoMarkClip">
          <rect width="40" height="40" rx="8" />
        </clipPath>
      </defs>
      <g clipPath="url(#logoMarkClip)">
        <rect width="40" height="40" fill="#2B3990" />
        <polygon points="0,0 22,0 0,22" fill="#ED1C24" />
        <polygon points="10,40 20,40 40,10 40,0 34,0" fill="#ffffff" opacity="0.92" />
      </g>
    </svg>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <div className="leading-tight">
        <div className="font-head font-extrabold text-[16.5px] text-gray-900">electra</div>
        <div className="text-[9.5px] tracking-wider text-gray-400">SALES LIMITED</div>
      </div>
    </div>
  );
}

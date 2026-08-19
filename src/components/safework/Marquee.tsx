import type { ReactNode } from "react";

export function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
    >
      <div className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]">
        {children}
        {children}
      </div>
    </div>
  );
}

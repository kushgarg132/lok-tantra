"use client";

import Image from "next/image";
import { useState } from "react";

type LogoSize = "xs" | "sm" | "md" | "lg";

const SIZE_CONFIG: Record<LogoSize, { px: number; textClass: string; containerClass: string }> = {
  xs: { px: 20,  textClass: "text-[9px]",  containerClass: "w-5 h-5" },
  sm: { px: 28,  textClass: "text-[10px]", containerClass: "w-7 h-7" },
  md: { px: 40,  textClass: "text-xs",     containerClass: "w-10 h-10" },
  lg: { px: 56,  textClass: "text-sm",     containerClass: "w-14 h-14" },
};

interface PartyLogoProps {
  abbreviation: string;
  logoUrl?: string | null;
  color?: string;
  size?: LogoSize;
  className?: string;
  shape?: "circle" | "square";
}

// Renders a political party logo.
// Falls back to abbreviation badge with the party's brand color.
export function PartyLogo({
  abbreviation,
  logoUrl,
  color = "#6366f1",
  size = "md",
  className = "",
  shape = "circle",
}: PartyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(!!logoUrl);
  const { px, textClass, containerClass } = SIZE_CONFIG[size];
  const showLogo = !!logoUrl && !imgError;
  const roundClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <span
      className={`${containerClass} ${roundClass} flex items-center justify-center overflow-hidden flex-shrink-0 relative select-none ${className}`}
      style={showLogo ? { background: "transparent" } : { backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      title={abbreviation}
      aria-label={`${abbreviation} party logo`}
    >
      {showLogo ? (
        <>
          {loading && (
            <span className={`absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse ${roundClass}`} aria-hidden />
          )}
          <Image
            src={logoUrl!}
            alt={`${abbreviation} logo`}
            width={px}
            height={px}
            className={`object-contain w-full h-full transition-opacity duration-200 p-0.5 ${loading ? "opacity-0" : "opacity-100"}`}
            onError={() => { setImgError(true); setLoading(false); }}
            onLoad={() => setLoading(false)}
            unoptimized={logoUrl!.startsWith("/media/")}
          />
        </>
      ) : (
        <span
          className={`${textClass} font-bold`}
          style={{ color }}
        >
          {abbreviation.slice(0, 4)}
        </span>
      )}
    </span>
  );
}

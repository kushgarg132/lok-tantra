"use client";

import Image from "next/image";
import { useState } from "react";

type BadgeSize = "sm" | "md" | "lg";

const SIZE_CONFIG: Record<BadgeSize, { px: number; containerClass: string; textClass: string }> = {
  sm: { px: 28, containerClass: "w-7 h-7",  textClass: "text-[9px]" },
  md: { px: 40, containerClass: "w-10 h-10", textClass: "text-[10px]" },
  lg: { px: 56, containerClass: "w-14 h-14", textClass: "text-xs" },
};

// Branch color defaults
const BRANCH_COLORS: Record<string, string> = {
  executive:    "#3b82f6",
  legislature:  "#f59e0b",
  judiciary:    "#10b981",
  independent:  "#8b5cf6",
};

interface InstitutionBadgeProps {
  name: string;
  logoUrl?: string | null;
  branch?: string;
  size?: BadgeSize;
  className?: string;
}

// Renders an institution logo (court seal, ministry emblem, etc.).
// Falls back to a colored icon with the first letter of the institution name.
export function InstitutionBadge({
  name,
  logoUrl,
  branch = "executive",
  size = "md",
  className = "",
}: InstitutionBadgeProps) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(!!logoUrl);
  const { px, containerClass, textClass } = SIZE_CONFIG[size];
  const showLogo = !!logoUrl && !imgError;
  const color = BRANCH_COLORS[branch] ?? "#64748b";
  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  return (
    <span
      className={`${containerClass} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 relative select-none ${className}`}
      style={showLogo ? {} : { backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      title={name}
      aria-label={`${name} logo`}
    >
      {showLogo ? (
        <>
          {loading && (
            <span className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" aria-hidden />
          )}
          <Image
            src={logoUrl!}
            alt={`${name} logo`}
            width={px}
            height={px}
            className={`object-contain w-full h-full p-1 transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"}`}
            onError={() => { setImgError(true); setLoading(false); }}
            onLoad={() => setLoading(false)}
            unoptimized={logoUrl!.startsWith("/media/")}
          />
        </>
      ) : (
        <span className={`${textClass} font-bold`} style={{ color }}>
          {initial}
        </span>
      )}
    </span>
  );
}

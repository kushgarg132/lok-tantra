"use client";

import Image from "next/image";
import { useState } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CONFIG: Record<AvatarSize, { px: number; textClass: string; containerClass: string }> = {
  xs:  { px: 24,  textClass: "text-[10px]", containerClass: "w-6 h-6" },
  sm:  { px: 32,  textClass: "text-xs",     containerClass: "w-8 h-8" },
  md:  { px: 40,  textClass: "text-sm",     containerClass: "w-10 h-10" },
  lg:  { px: 48,  textClass: "text-base",   containerClass: "w-12 h-12" },
  xl:  { px: 64,  textClass: "text-xl",     containerClass: "w-16 h-16" },
  "2xl": { px: 96, textClass: "text-2xl",   containerClass: "w-24 h-24" },
};

interface EntityAvatarProps {
  name: string;
  photoUrl?: string | null;
  /** Fallback background color — usually the party color */
  color?: string;
  size?: AvatarSize;
  className?: string;
  priority?: boolean;
}

// Renders a politician/official photo.
// Falls back to initials pill with the entity's brand color.
export function EntityAvatar({
  name,
  photoUrl,
  color = "#4f46e5",
  size = "md",
  className = "",
  priority = false,
}: EntityAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(!!photoUrl);
  const { px, textClass, containerClass } = SIZE_CONFIG[size];
  const initials = getInitials(name);
  const showPhoto = !!photoUrl && !imgError;

  return (
    <span
      className={`${containerClass} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 relative select-none ${className}`}
      style={showPhoto ? {} : { backgroundColor: color }}
      title={name}
      aria-label={name}
    >
      {showPhoto ? (
        <>
          {loading && (
            <span className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" aria-hidden />
          )}
          <Image
            src={photoUrl!}
            alt={name}
            width={px}
            height={px}
            className={`object-cover w-full h-full transition-opacity duration-200 ${loading ? "opacity-0" : "opacity-100"}`}
            onError={() => { setImgError(true); setLoading(false); }}
            onLoad={() => setLoading(false)}
            priority={priority}
            unoptimized={photoUrl!.startsWith("/media/")}
          />
        </>
      ) : (
        <span className={`${textClass} font-bold text-white`}>{initials}</span>
      )}
    </span>
  );
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

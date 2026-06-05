"use client";

import Image from "next/image";
import { useState } from "react";

export interface MediaImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
}

// Base image component with error fallback and loading skeleton.
// All other media components build on this.
export function MediaImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallback,
  priority = false,
}: MediaImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return <>{fallback ?? null}</>;
  }

  return (
    <span className="relative inline-block" style={{ width, height }}>
      {!loaded && (
        <span
          className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-inherit"
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${!loaded ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        priority={priority}
        unoptimized={src.startsWith("/media/")} // local dev: skip Next.js optimization for local paths
      />
    </span>
  );
}

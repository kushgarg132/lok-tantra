import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)} L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)} K`;
  return n.toLocaleString("en-IN");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPartyColor(party: string): string {
  const colors: Record<string, string> = {
    BJP: "#FF9933",
    INC: "#00BFFF",
    AAP: "#0066CC",
    TMC: "#00FF00",
    DMK: "#FF0000",
    BSP: "#0000FF",
    SP: "#FF0000",
    NCP: "#004B87",
    CPIM: "#FF0000",
    JDU: "#006400",
    SS: "#FF6600",
    TDP: "#FFFF00",
    BJD: "#00FF00",
    YSRCP: "#0066CC",
    RJD: "#006400",
    INDEPENDENT: "#808080",
  };
  return colors[party.toUpperCase()] ?? "#6B7280";
}

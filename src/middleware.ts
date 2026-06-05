import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ── Security headers added to every response ─────────────────────────────────
function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options",    "nosniff");
  res.headers.set("X-Frame-Options",           "DENY");
  res.headers.set("X-XSS-Protection",          "1; mode=block");
  res.headers.set("Referrer-Policy",           "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy",        "camera=(), microphone=(), geolocation=()");
  const isDev = process.env.NODE_ENV !== "production";
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // unsafe-eval is only required by Next.js HMR in development; never ship it to production
      isDev
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.anthropic.com https://api.voyageai.com",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  return res;
}

// ── Simple Redis-based rate limiting (inline, no import to avoid edge issues) ─
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

function checkRateLimitMemory(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now   = Date.now();
  const entry = rateLimitCache.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitCache.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;
  const allowed   = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);
  return { allowed, remaining };
}

// Periodically clean up expired entries (every 500 requests)
let _cleanupCounter = 0;
function maybeCleanup() {
  if (++_cleanupCounter % 500 !== 0) return;
  const now = Date.now();
  rateLimitCache.forEach((v, k) => {
    if (now > v.resetAt) rateLimitCache.delete(k);
  });
}

// ── Route classification ──────────────────────────────────────────────────────
function classifyRoute(pathname: string): { cls: string; limit: number; windowMs: number } {
  if (pathname.startsWith("/api/auth"))                return { cls: "auth",   limit: 15,  windowMs: 60_000 };
  if (pathname.startsWith("/api/assistant"))           return { cls: "ai",     limit: 10,  windowMs: 60_000 };
  if (pathname.startsWith("/api/search"))              return { cls: "search", limit: 60,  windowMs: 60_000 };
  if (pathname.startsWith("/api/admin"))               return { cls: "admin",  limit: 300, windowMs: 60_000 };
  if (pathname.startsWith("/api/moderation/flag"))     return { cls: "write",  limit: 20,  windowMs: 60_000 };
  if (pathname.startsWith("/api"))                     return { cls: "api",    limit: 200, windowMs: 60_000 };
  return                                                      { cls: "global", limit: 500, windowMs: 60_000 };
}

// ── Protected route patterns ──────────────────────────────────────────────────
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

function isModerationRoute(pathname: string): boolean {
  return pathname.startsWith("/api/moderation/queue");
}

// ── Main middleware ───────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  maybeCleanup();

  // ── 1. Rate limiting ──────────────────────────────────────────
  const ip = (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );

  const { cls, limit, windowMs } = classifyRoute(pathname);
  const rlKey = `${cls}:${ip}`;
  const rl    = checkRateLimitMemory(rlKey, limit, windowMs);

  if (!rl.allowed) {
    return new NextResponse(
      JSON.stringify({ error: "Rate limit exceeded. Please slow down." }),
      {
        status:  429,
        headers: {
          "Content-Type":          "application/json",
          "X-RateLimit-Remaining": "0",
          "Retry-After":           "60",
        },
      },
    );
  }

  // ── 2. Authentication guard for protected routes ───────────────
  const token = isAdminRoute(pathname) || isModerationRoute(pathname)
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    : null;

  if (isAdminRoute(pathname)) {
    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    const role = (token.role as string) ?? "USER";
    if (role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Admin access required." }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  if (isModerationRoute(pathname)) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
    const role = (token.role as string) ?? "USER";
    if (!["MODERATOR", "ADMIN"].includes(role)) {
      return new NextResponse(
        JSON.stringify({ error: "Moderator access required." }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // ── 3. Continue with security headers ────────────────────────
  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
  applySecurityHeaders(res);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

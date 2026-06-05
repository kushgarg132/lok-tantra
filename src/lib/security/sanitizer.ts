// Strip HTML tags and dangerous characters from user input
export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")           // Remove HTML tags
    .replace(/javascript:/gi, "")      // Remove JS protocol
    .replace(/on\w+\s*=/gi, "")        // Remove event handlers
    .trim();
}

// Sanitize a search query (allow letters, digits, spaces, common punctuation)
export function sanitizeQuery(q: string, maxLen = 500): string {
  return stripHtml(q)
    // eslint-disable-next-line no-control-regex
    .replace(/[^\w\s\-.,?!:;'"()[\]@#ऀ-ॿঀ-৿਀-੿଀-୿]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, maxLen)
    .trim();
}

// Validate and normalize an email
export function normalizeEmail(email: string): string | null {
  const clean = email.toLowerCase().trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRe.test(clean) ? clean : null;
}

// Validate password strength
export interface PasswordStrength {
  valid:    boolean;
  score:    number; // 0-4
  feedback: string;
}

export function checkPasswordStrength(pw: string): PasswordStrength {
  if (pw.length < 8)  return { valid: false, score: 0, feedback: "Password must be at least 8 characters." };
  if (pw.length < 10) return { valid: false, score: 1, feedback: "Use at least 10 characters for a stronger password." };

  let score = 1;
  if (/[A-Z]/.test(pw))  score++;
  if (/[0-9]/.test(pw))  score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score < 2) return { valid: false, score, feedback: "Mix uppercase letters, numbers, and symbols." };

  return {
    valid:    true,
    score,
    feedback: score >= 4 ? "Strong password." : "Good password — adding symbols makes it stronger.",
  };
}

// Sanitize a name field
export function sanitizeName(name: string, maxLen = 100): string {
  return stripHtml(name)
    .replace(/[^\w\s'.\-]/g, "")
    .slice(0, maxLen)
    .trim();
}

// Extract a safe snippet from AI-generated content (for moderation storage)
export function safeSnippet(content: string, maxLen = 500): string {
  return stripHtml(content).slice(0, maxLen);
}

// Mask an IP address for privacy (last octet for IPv4, last 64 bits for IPv6)
export function maskIp(ip: string): string {
  if (ip.includes(":")) {
    // IPv6 — keep first 4 groups
    const parts = ip.split(":");
    return parts.slice(0, 4).join(":") + "::***";
  }
  const parts = ip.split(".");
  if (parts.length === 4) {
    return parts.slice(0, 3).join(".") + ".***";
  }
  return "***";
}

// Check if a URL belongs to a trusted domain
const TRUSTED_DOMAINS = new Set([
  "eci.gov.in", "sansad.in", "sci.gov.in", "prsindia.org",
  "indiacode.nic.in", "india.gov.in", "rbi.org.in", "mospi.gov.in",
  "adrindia.org", "myneta.info", "nic.in", "gov.in",
]);

export function isTrustedUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return Array.from(TRUSTED_DOMAINS).some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch { return false; }
}

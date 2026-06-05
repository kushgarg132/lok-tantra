export type Role = "USER" | "RESEARCHER" | "MODERATOR" | "ADMIN";

// Role hierarchy — higher index = more privileged
const ROLE_RANK: Record<Role, number> = {
  USER:       0,
  RESEARCHER: 1,
  MODERATOR:  2,
  ADMIN:      3,
};

export function hasRole(userRole: string | undefined, required: Role): boolean {
  const rank = ROLE_RANK[userRole as Role] ?? -1;
  return rank >= ROLE_RANK[required];
}

export function isAdmin(role: string | undefined): boolean {
  return hasRole(role, "ADMIN");
}

export function isModerator(role: string | undefined): boolean {
  return hasRole(role, "MODERATOR");
}

// Fine-grained permission map
export type Permission =
  | "search:ai_answer"          // Use AI-assisted search answers
  | "assistant:chat"            // Use governance assistant
  | "flag:create"               // Flag inaccurate content
  | "moderation:review"         // Review flagged content
  | "moderation:resolve"        // Resolve/dismiss flags
  | "admin:view_audit"          // View audit logs
  | "admin:manage_users"        // Create/update/disable users
  | "admin:trigger_ingest"      // Trigger ETL ingestion jobs
  | "admin:manage_sources"      // Approve/reject data sources
  | "api:high_rate"             // Elevated rate limits for researchers
  | "data:export";              // Export large datasets

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    "search:ai_answer",
    "assistant:chat",
    "flag:create",
  ],
  RESEARCHER: [
    "search:ai_answer",
    "assistant:chat",
    "flag:create",
    "api:high_rate",
    "data:export",
  ],
  MODERATOR: [
    "search:ai_answer",
    "assistant:chat",
    "flag:create",
    "moderation:review",
    "moderation:resolve",
    "api:high_rate",
  ],
  ADMIN: [
    "search:ai_answer",
    "assistant:chat",
    "flag:create",
    "moderation:review",
    "moderation:resolve",
    "admin:view_audit",
    "admin:manage_users",
    "admin:trigger_ingest",
    "admin:manage_sources",
    "api:high_rate",
    "data:export",
  ],
};

export function can(userRole: string | undefined, permission: Permission): boolean {
  const role = (userRole ?? "USER") as Role;
  const allowed = ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.USER;
  return allowed.includes(permission);
}

// Rate limit multipliers per role
export const RATE_LIMIT_MULTIPLIER: Record<Role, number> = {
  USER:       1,
  RESEARCHER: 5,
  MODERATOR:  3,
  ADMIN:      10,
};

export function getRateMultiplier(role: string | undefined): number {
  return RATE_LIMIT_MULTIPLIER[(role as Role) ?? "USER"] ?? 1;
}

/**
 * Startup environment variable validator.
 * Call validateConfig() once at process start. Throws on missing required vars
 * so the process exits immediately rather than failing silently at runtime.
 */

interface EnvSpec {
  key: string;
  required: boolean;
  description: string;
}

const REQUIRED_ENV: EnvSpec[] = [
  { key: "DATABASE_URL",      required: true,  description: "PostgreSQL connection string" },
  { key: "NEXTAUTH_SECRET",   required: true,  description: "NextAuth session signing secret" },
  { key: "NEXTAUTH_URL",      required: true,  description: "Canonical app URL for NextAuth callbacks" },
  { key: "NEO4J_URI",         required: false, description: "Neo4j bolt URI (bolt://host:7687)" },
  { key: "NEO4J_USER",        required: false, description: "Neo4j username" },
  { key: "NEO4J_PASSWORD",    required: false, description: "Neo4j password" },
  { key: "REDIS_URL",         required: false, description: "Redis connection URL" },
  { key: "ANTHROPIC_API_KEY", required: false, description: "Anthropic Claude API key" },
];

const INSECURE_DEFAULTS: Record<string, string> = {
  NEO4J_PASSWORD: "password",
  NEO4J_USER:     "neo4j",
};

export function validateConfig(): void {
  const missing: string[] = [];
  const insecure: string[] = [];

  for (const spec of REQUIRED_ENV) {
    const value = process.env[spec.key];
    if (spec.required && !value) {
      missing.push(`  ${spec.key}: ${spec.description}`);
    }
    if (value && INSECURE_DEFAULTS[spec.key] === value) {
      insecure.push(`  ${spec.key} is using an insecure default value`);
    }
  }

  if (missing.length > 0) {
    console.error("[CONFIG] Missing required environment variables:\n" + missing.join("\n"));
    throw new Error("Missing required environment variables. Refusing to start.");
  }

  if (insecure.length > 0 && process.env.NODE_ENV === "production") {
    console.error("[CONFIG] Insecure default values detected in production:\n" + insecure.join("\n"));
    throw new Error("Insecure default credentials detected in production. Refusing to start.");
  }

  if (insecure.length > 0) {
    console.warn("[CONFIG] WARNING: Insecure default values in use (acceptable only in development):\n" + insecure.join("\n"));
  }
}

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

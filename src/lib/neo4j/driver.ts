import neo4j, { Driver } from "neo4j-driver";

// Use a global variable to preserve the driver instance across hot-reloads in development
declare global {
  var __neo4j_driver: Driver | undefined;
}

/**
 * Initializes and returns the Neo4j driver singleton.
 */
export function getNeo4jDriver(): Driver {
  if (process.env.NODE_ENV === "development") {
    if (!global.__neo4j_driver) {
      global.__neo4j_driver = createDriver();
    }
    return global.__neo4j_driver;
  }

  return createDriver();
}

function createDriver(): Driver {
  const uri      = process.env.NEO4J_URI      || "bolt://localhost:7687";
  const user     = process.env.NEO4J_USER     || "neo4j";
  const password = process.env.NEO4J_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEO4J_PASSWORD environment variable is required in production.");
    }
    console.warn("[Neo4j] NEO4J_PASSWORD not set — using insecure default (dev only).");
  }

  const effectivePassword = password || "password";

  try {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, effectivePassword), {
      maxConnectionPoolSize: 100,
      connectionTimeout: 30000,
    });
    
    // Test the connection asynchronously
    driver.getServerInfo().then(info => {
      console.log(`Connected to Neo4j Graph Database: ${info.protocolVersion} at ${info.address}`);
    }).catch(error => {
      console.error("Failed to connect to Neo4j:", error);
    });

    return driver;
  } catch (error) {
    console.error("Failed to initialize Neo4j Driver:", error);
    throw error;
  }
}

/**
 * Convenience method to close the driver.
 * Typically called during graceful shutdown.
 */
export async function closeNeo4jDriver(): Promise<void> {
  if (global.__neo4j_driver) {
    await global.__neo4j_driver.close();
    global.__neo4j_driver = undefined;
  }
}

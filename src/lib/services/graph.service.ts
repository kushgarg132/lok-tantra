import { getNeo4jDriver } from "../neo4j/driver";
import neo4j from "neo4j-driver";

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes — graph structure rarely changes
const CACHE_MAX_SIZE = 500;           // LRU cap: evict oldest when exceeded

interface CacheEntry { data: unknown[]; timestamp: number }
const queryCache = new Map<string, CacheEntry>();

function cacheSet(key: string, data: unknown[]): void {
  if (queryCache.size >= CACHE_MAX_SIZE) {
    // Evict the oldest entry (Map preserves insertion order)
    queryCache.delete(queryCache.keys().next().value as string);
  }
  queryCache.set(key, { data, timestamp: Date.now() });
}

interface GraphQueryOptions {
  depth?: number;
  maxHops?: number;
  direction?: "OUTGOING" | "INCOMING" | "BOTH";
  skipCache?: boolean;
}

export class GraphService {
  /**
   * Executes a raw Cypher query with caching support.
   */
  static async executeQuery<T>(
    cypher: string,
    params: Record<string, any> = {},
    skipCache = false
  ): Promise<T[]> {
    const cacheKey = JSON.stringify({ cypher, params });

    if (!skipCache && queryCache.has(cacheKey)) {
      const cached = queryCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data as T[];
      }
      queryCache.delete(cacheKey); // expired — remove before re-fetching
    }

    const driver = getNeo4jDriver();
    const session = driver.session({ defaultAccessMode: neo4j.session.READ });

    try {
      const result = await session.run(cypher, params);
      // Serialize Neo4j nodes/edges to simple objects
      const serialized = result.records.map((record) => {
        const obj: any = {};
        record.keys.forEach((key) => {
          const value = record.get(key);
          // Handle Neo4j Node/Relationship objects
          if (value && typeof value === 'object' && value.properties) {
             obj[key] = {
               labels: value.labels || [value.type],
               ...value.properties
             };
          } else {
             obj[key] = value;
          }
        });
        return obj;
      });

      cacheSet(cacheKey, serialized);
      return serialized as T[];
    } catch (error) {
      console.error("Graph query failed:", error);
      throw new Error("Failed to execute graph query");
    } finally {
      await session.close();
    }
  }

  /**
   * Institutional Hierarchy Graph
   * Returns the REPORTS_TO and PART_OF tree up to a certain depth.
   */
  static async getInstitutionalHierarchy(institutionId: string, options: GraphQueryOptions = {}) {
    const depth = options.depth || 3;
    const cypher = `
      MATCH path = (child)-[:REPORTS_TO|PART_OF*1..${depth}]->(parent:Institution {id: $id})
      RETURN path
    `;
    return this.executeQuery(cypher, { id: institutionId }, options.skipCache);
  }

  /**
   * Political Relationship Graph
   * Traces BELONGS_TO, ALLIED_WITH, and ELECTED_FROM relationships.
   */
  static async getPoliticalNetwork(personId: string, options: GraphQueryOptions = {}) {
    const cypher = `
      MATCH (p:Person {id: $id})
      OPTIONAL MATCH (p)-[membership:BELONGS_TO]->(party:Party)
      OPTIONAL MATCH (p)-[election:ELECTED_FROM]->(constituency:Constituency)
      OPTIONAL MATCH (party)-[alliance:ALLIED_WITH]-(alliedParty:Party)
      RETURN p, membership, party, election, constituency, alliance, alliedParty
    `;
    return this.executeQuery(cypher, { id: personId }, options.skipCache);
  }

  /**
   * Constitutional Authority Graph
   * Explores the APPOINTS, REMOVES, SUPERVISES, and CONSTITUTIONAL_AUTHORITY_OVER edges.
   */
  static async getConstitutionalAuthority(positionId: string, options: GraphQueryOptions = {}) {
    const cypher = `
      MATCH (pos:Position {id: $id})
      OPTIONAL MATCH (pos)-[appoints:APPOINTS]->(targetPos:Position)
      OPTIONAL MATCH (pos)-[removes:REMOVES]->(targetRem:Position)
      OPTIONAL MATCH (pos)-[supervises:SUPERVISES]->(targetSup:Position)
      RETURN pos, appoints, targetPos, removes, targetRem, supervises, targetSup
    `;
    return this.executeQuery(cypher, { id: positionId }, options.skipCache);
  }

  /**
   * Administrative Hierarchy Graph
   * Specialized for Bureaucracy (GOVERNS, ADMINISTRATIVE_CONTROL_OVER).
   */
  static async getAdministrativeHierarchy(ministryId: string, options: GraphQueryOptions = {}) {
    const cypher = `
      MATCH (m:Ministry {id: $id})-[admin:ADMINISTRATIVE_CONTROL_OVER]->(d:Department)
      OPTIONAL MATCH (d)-[governs:GOVERNS]->(entity)
      RETURN m, admin, d, governs, entity
    `;
    return this.executeQuery(cypher, { id: ministryId }, options.skipCache);
  }

  /**
   * Judicial Review Network
   * Explores STRUCK_DOWN and INTERPRETED relationships for a case or court.
   */
  static async getJudicialImpact(caseId: string, options: GraphQueryOptions = {}) {
    const cypher = `
      MATCH (c:Case {id: $id})
      OPTIONAL MATCH (c)-[interprets:INTERPRETED]->(article:Article)
      OPTIONAL MATCH (c)-[struck_down:STRUCK_DOWN]->(act:Act)
      RETURN c, interprets, article, struck_down, act
    `;
    return this.executeQuery(cypher, { id: caseId }, options.skipCache);
  }

  /**
   * Shortest Path Pathfinding
   * maxHops defaults to 6 — prevents unbounded traversal across the full graph.
   */
  static async getShortestPath(startId: string, endId: string, options: GraphQueryOptions = {}) {
    const maxHops = Math.min(options.maxHops ?? 6, 10); // hard ceiling of 10
    const cypher = `
      MATCH (start {id: $startId}), (end {id: $endId})
      MATCH path = shortestPath((start)-[*..${maxHops}]-(end))
      RETURN path
    `;
    return this.executeQuery(cypher, { startId, endId }, options.skipCache);
  }
}

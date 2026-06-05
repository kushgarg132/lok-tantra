import { describe, it, expect, vi, beforeEach } from "vitest";
import { GraphService } from "../src/lib/services/graph.service";
import * as driverModule from "../src/lib/neo4j/driver";

// Mock the neo4j driver wrapper
vi.mock("../src/lib/neo4j/driver", () => ({
  getNeo4jDriver: vi.fn(),
}));

describe("GraphService", () => {
  let mockSessionRun: any;
  let mockSessionClose: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSessionRun = vi.fn().mockResolvedValue({
      records: [
        {
          keys: ["path"],
          get: (key: string) => ({ properties: { id: "test-id" }, labels: ["TestNode"] }),
        },
      ],
    });
    mockSessionClose = vi.fn().mockResolvedValue(undefined);

    const mockDriver = {
      session: vi.fn().mockReturnValue({
        run: mockSessionRun,
        close: mockSessionClose,
      }),
    };

    (driverModule.getNeo4jDriver as any).mockReturnValue(mockDriver);
  });

  it("should fetch institutional hierarchy and serialize results", async () => {
    const result = await GraphService.getInstitutionalHierarchy("inst-123", { depth: 2, skipCache: true });
    
    expect(driverModule.getNeo4jDriver).toHaveBeenCalled();
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.stringContaining("[:REPORTS_TO|PART_OF*1..2]"),
      { id: "inst-123" }
    );
    expect(result).toHaveLength(1);
    expect(result[0].path.id).toBe("test-id");
    expect(result[0].path.labels).toContain("TestNode");
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("should trace the political network of a person", async () => {
    await GraphService.getPoliticalNetwork("person-456", { skipCache: true });

    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.stringContaining("MATCH (p:Person {id: $id})"),
      { id: "person-456" }
    );
  });

  it("should find the shortest path between two nodes", async () => {
    await GraphService.getShortestPath("node-A", "node-B", { skipCache: true });

    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.stringContaining("shortestPath((start)-[*]-(end))"),
      { startId: "node-A", endId: "node-B" }
    );
  });

  it("should cache repeated queries", async () => {
    // First call (cache miss)
    await GraphService.getConstitutionalAuthority("pos-1");
    // Second call (cache hit)
    await GraphService.getConstitutionalAuthority("pos-1");

    // Session run should only be called once because of the in-memory cache
    expect(mockSessionRun).toHaveBeenCalledTimes(1);
  });
});

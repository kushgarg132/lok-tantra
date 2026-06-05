export type EntityType =
  | "person"
  | "party"
  | "institution"
  | "ministry"
  | "court"
  | "constituency";

export type MediaType =
  | "profile"
  | "thumbnail"
  | "logo"
  | "banner"
  | "map"
  | "portrait"
  | "symbol";

export type SourceTrust =
  | "official_govt"
  | "official_party"
  | "official_institution"
  | "trusted_fallback"
  | "unknown";

export type StorageProvider = "local" | "r2" | "s3";

export interface MediaVariants {
  original?: string; // Full-size WebP (max 1920px)
  card?: string;     // 400×400 WebP — profile cards, dashboards
  avatar?: string;   // 128×128 WebP — list items, detail panels
  thumb?: string;    // 64×64 WebP  — graph nodes, compact lists
  banner?: string;   // 1200×400 WebP — party/institution banners
}

export interface MediaAssetRecord {
  id: string;
  entityType: EntityType;
  entityId: string;
  mediaType: MediaType;
  storageKey: string;
  publicUrl: string | null;
  localPath: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  fileSize: number | null;
  checksum: string | null;
  variants: MediaVariants | null;
  sourceUrl: string | null;
  sourceDomain: string | null;
  sourceTrust: SourceTrust | null;
  isVerified: boolean;
  isActive: boolean;
  fetchedAt: Date | null;
  verifiedAt: Date | null;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngestJobData {
  entityType: EntityType;
  entityId: string;
  entityName: string;
  mediaType: MediaType;
  hints?: {
    sansadId?: string;       // Lok Sabha / Rajya Sabha member ID
    stateCode?: string;
    partyAbbr?: string;
    websiteUrl?: string;     // Entity's official website to scrape from
    wikiTitle?: string;      // Wikipedia article title (fallback)
  };
}

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  fileSize: number;
  checksum: string;
}

export interface IngestResult {
  success: boolean;
  assetId?: string;
  publicUrl?: string;
  variants?: MediaVariants;
  error?: string;
}

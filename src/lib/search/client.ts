import { Client } from "@elastic/elasticsearch";

let _client: Client | null = null;

export function getESClient(): Client | null {
  if (!process.env.ELASTICSEARCH_URL) return null;
  if (!_client) {
    _client = new Client({
      node: process.env.ELASTICSEARCH_URL,
      ...(process.env.ELASTICSEARCH_API_KEY
        ? { auth: { apiKey: process.env.ELASTICSEARCH_API_KEY } }
        : {}),
      tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
    });
  }
  return _client;
}

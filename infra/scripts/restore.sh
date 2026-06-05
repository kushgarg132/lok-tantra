#!/usr/bin/env bash
# Restore PostgreSQL from GCS backup
# Usage: ./restore.sh <gcs-path> [target-database-url]
#   e.g. ./restore.sh gs://loktantra-backups-prod/postgres/2024-01-15_02-00-00.sql.gz
set -euo pipefail

GCS_PATH="${1:?Usage: restore.sh <gcs-path> [DATABASE_URL]}"
TARGET_DB="${2:-$DATABASE_URL}"

echo "==> WARNING: This will OVERWRITE the target database!"
echo "    Source:  ${GCS_PATH}"
echo "    Target:  ${TARGET_DB%@*}@***"
read -rp "    Continue? [y/N] " CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }

TMPFILE=$(mktemp /tmp/restore-XXXXXX.sql.gz)
trap 'rm -f "$TMPFILE"' EXIT

echo "==> Downloading backup..."
gsutil cp "$GCS_PATH" "$TMPFILE"

echo "==> Restoring..."
gunzip -c "$TMPFILE" | pg_restore \
  --dbname="$TARGET_DB" \
  --no-owner \
  --no-acl \
  --verbose \
  --clean \
  --if-exists

echo "==> Restore complete"

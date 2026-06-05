#!/usr/bin/env bash
# Manual PostgreSQL backup to GCS
# Usage: ./backup.sh [bucket-name]
set -euo pipefail

BUCKET="${1:-loktantra-backups-prod}"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="manual_${DATE}.sql.gz"

echo "==> Backing up to gs://${BUCKET}/postgres/${FILENAME}"

pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=9 \
  --no-password \
| gzip \
| gsutil cp - "gs://${BUCKET}/postgres/${FILENAME}"

echo "==> Backup complete: gs://${BUCKET}/postgres/${FILENAME}"
echo "==> Size: $(gsutil du -s "gs://${BUCKET}/postgres/${FILENAME}" | awk '{print $1}') bytes"

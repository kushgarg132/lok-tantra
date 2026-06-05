#!/usr/bin/env bash
# Emergency rollback — reverts app and worker deployments to previous revision
# Usage: ./rollback.sh [namespace] [deployment-name]
set -euo pipefail

NS="${1:-loktantra}"

echo "==> Fetching current deployment state..."
kubectl -n "$NS" get deployment loktantra-app   -o wide
kubectl -n "$NS" get deployment loktantra-worker -o wide

echo ""
echo "==> Rolling back loktantra-app..."
kubectl -n "$NS" rollout undo deployment/loktantra-app
kubectl -n "$NS" rollout status deployment/loktantra-app --timeout=5m

echo "==> Rolling back loktantra-worker..."
kubectl -n "$NS" rollout undo deployment/loktantra-worker
kubectl -n "$NS" rollout status deployment/loktantra-worker --timeout=5m

echo ""
echo "==> Post-rollback health check..."
sleep 15
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://loktantra.in/api/health)
if [ "$STATUS" = "200" ]; then
  echo "==> Health check passed (HTTP 200)"
else
  echo "==> WARN: Health check returned HTTP $STATUS — investigate manually"
fi

echo "==> Rollback complete. New revision:"
kubectl -n "$NS" rollout history deployment/loktantra-app | tail -3

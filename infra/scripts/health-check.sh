#!/usr/bin/env bash
# Full system health check — runs diagnostics against all services
# Usage: ./health-check.sh [base-url]
set -euo pipefail

BASE="${1:-https://loktantra.in}"
PASS=0
FAIL=0
WARN=0

check() {
  local name="$1" url="$2" expected="${3:-200}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
  if [ "$status" = "$expected" ]; then
    echo "  [PASS] $name ($status)"
    ((PASS++))
  else
    echo "  [FAIL] $name — expected $expected, got $status"
    ((FAIL++))
  fi
}

warn_check() {
  local name="$1" url="$2"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "0")
  if [ "$status" = "200" ]; then
    echo "  [PASS] $name ($status)"
    ((PASS++))
  else
    echo "  [WARN] $name — got $status (non-critical)"
    ((WARN++))
  fi
}

echo "=============================="
echo "LokTantra Health Check"
echo "Target: $BASE"
echo "Time: $(date)"
echo "=============================="

echo ""
echo "[ Core endpoints ]"
check "Homepage"            "$BASE/"
check "Health API"          "$BASE/api/health"
check "Constitution page"   "$BASE/constitution"
check "Representatives"     "$BASE/representatives"
check "Elections"           "$BASE/elections"
check "Assistant API"       "$BASE/api/assistant" 405   # POST-only, 405 on GET

echo ""
echo "[ API endpoints ]"
check "Parties API"         "$BASE/api/parties"
check "Judiciary API"       "$BASE/api/judiciary"
check "Timeline API"        "$BASE/api/timeline"
check "Graph Network API"   "$BASE/api/graph/network"

echo ""
echo "[ Auth endpoints ]"
check "Auth providers"      "$BASE/api/auth/providers"
check "Sign-in page"        "$BASE/auth/signin"

echo ""
echo "[ Admin (should 403 unauthenticated) ]"
check "Admin page"          "$BASE/admin" 302   # Redirect to sign-in

echo ""
echo "[ Security headers ]"
HSTS=$(curl -s -I "$BASE/" | grep -i "strict-transport-security" | wc -l)
if [ "$HSTS" -gt 0 ]; then
  echo "  [PASS] HSTS header present"
  ((PASS++))
else
  echo "  [FAIL] HSTS header missing"
  ((FAIL++))
fi

echo ""
echo "=============================="
echo "Results: ${PASS} PASS  ${WARN} WARN  ${FAIL} FAIL"
echo "=============================="

[ "$FAIL" -eq 0 ] && exit 0 || exit 1

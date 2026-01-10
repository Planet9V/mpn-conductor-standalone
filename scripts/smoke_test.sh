#!/bin/bash
# MPN E2E Smoke Test Script
# Verifies all critical endpoints are functional after deployment

set -e

BASE_URL="${1:-http://localhost:3001}"
PSYCHOSCORE_URL="${2:-http://localhost:8001}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

echo "=================================="
echo "MPN E2E Smoke Test Suite"
echo "Base URL: $BASE_URL"
echo "PSYCHOSCORE URL: $PSYCHOSCORE_URL"
echo "=================================="
echo ""

test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="$4"
    local expected_status="${5:-200}"
    
    if [ "$method" = "POST" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    fi
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓${NC} $name (HTTP $status)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $name (Expected $expected_status, got $status)"
        ((FAILED++))
    fi
}

test_json_field() {
    local name="$1"
    local url="$2"
    local field="$3"
    local expected="$4"
    
    result=$(curl -s "$url" | jq -r ".$field" 2>/dev/null)
    
    if [ "$result" = "$expected" ]; then
        echo -e "${GREEN}✓${NC} $name ($field=$result)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $name (Expected $field=$expected, got $result)"
        ((FAILED++))
    fi
}

echo "--- Page Routes ---"
test_endpoint "Home Page" "$BASE_URL/"
test_endpoint "Login Page" "$BASE_URL/login"
test_endpoint "Dashboard Page" "$BASE_URL/dashboard"
test_endpoint "Conductor Page" "$BASE_URL/mpn-conductor"

echo ""
echo "--- Auth API ---"
test_endpoint "Auth Login (no creds)" "$BASE_URL/api/auth/login" "POST" '{"email":"","password":""}' "400"
test_endpoint "Auth Login (invalid)" "$BASE_URL/api/auth/login" "POST" '{"email":"bad@test.com","password":"bad"}' "401"

echo ""
echo "--- PSYCHOSCORE Direct ---"
test_json_field "PSYCHOSCORE Health" "$PSYCHOSCORE_URL/health" "status" "healthy"
test_json_field "PSYCHOSCORE Model Loaded" "$PSYCHOSCORE_URL/health" "model_loaded" "true"

echo ""
echo "--- PSYCHOSCORE Proxy ---"
test_endpoint "PSYCHOSCORE Generate" "$BASE_URL/api/psychoscore/generate" "POST" '{"trauma":0.5,"entropy":0.3}' "200"

echo ""
echo "--- TTS API ---"
# TTS may fail if no API key, but endpoint should exist
test_endpoint "TTS Endpoint Exists" "$BASE_URL/api/tts" "POST" '{"text":"test"}' "200"

echo ""
echo "=================================="
echo "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "=================================="

if [ $FAILED -gt 0 ]; then
    exit 1
fi

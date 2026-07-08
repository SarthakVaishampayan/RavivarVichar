#!/bin/bash
#
# Maintenance Mode — OFF
#
# Restores normal Nginx config, bringing the site back live.
#
# Usage:
#   bash scripts/maintenance-off.sh
#   bash scripts/maintenance-off.sh --dry-run
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
pass()  { echo -e "${GREEN}[PASS]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; }

DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --help)
      echo "Usage: bash scripts/maintenance-off.sh [--dry-run]"
      exit 0
      ;;
  esac
done

NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
NORMAL_CONFIG="$NGINX_AVAILABLE/ravivarvichar"
MAINTENANCE_CONFIG="$NGINX_AVAILABLE/maintenance"
MAINTENANCE_HTML="/var/www/maintenance.html"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Disabling Maintenance Mode            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""

# ─── Step 1: Verify normal config exists ───
info "Step 1: Checking normal Nginx config..."
if [ ! -f "$NORMAL_CONFIG" ]; then
  fail "Normal Nginx config not found at $NORMAL_CONFIG"
  exit 1
fi
pass "Normal config found"

# ─── Step 2: Switch back to normal config ───
info "Step 2: Restoring normal Nginx config..."
if [ "$DRY_RUN" = false ]; then
  # Disable maintenance config
  rm -f "$NGINX_ENABLED/maintenance"
  # Enable normal config
  ln -sf "$NORMAL_CONFIG" "$NGINX_ENABLED/ravivarvichar"
  # Test and reload
  nginx -t || { fail "Nginx config test failed!"; exit 1; }
  systemctl reload nginx || nginx -s reload 2>/dev/null || true
fi
pass "Normal config restored"

# ─── Step 3: Clean up maintenance page ───
info "Step 3: Cleaning up maintenance page..."
if [ "$DRY_RUN" = false ]; then
  rm -f "$MAINTENANCE_HTML" 2>/dev/null || true
fi
pass "Maintenance page removed"

# ─── Done ───
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Site is LIVE                           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  Maintenance mode is now disabled."
echo "  The website is publicly accessible."
echo ""

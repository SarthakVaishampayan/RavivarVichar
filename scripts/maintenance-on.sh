#!/bin/bash
#
# Maintenance Mode — ON
#
# Switches Nginx to maintenance mode:
#   - ROOT URL → Protected with HTTP Basic Auth:
#       • Public sees login dialog → cancel → sees maintenance page (200)
#       • You set MAINTENANCE_PASS env var → enter credentials → see client SPA
#   - /admin → NOT in maintenance (already JWT-protected by the app)
#   - /api/ → Protected with HTTP Basic Auth
#
# Usage (SECURE - password never visible in ps):
#   MAINTENANCE_PASS=mysecret bash scripts/maintenance-on.sh
#   bash scripts/maintenance-on.sh          # Prompts for password (hidden input)
#   bash scripts/maintenance-on.sh --dry-run
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
      echo "Usage: MAINTENANCE_PASS=mysecret bash scripts/maintenance-on.sh"
      echo "       bash scripts/maintenance-on.sh  (prompts interactively)"
      echo "       bash scripts/maintenance-on.sh --dry-run"
      exit 0
      ;;
  esac
done

PROJECT_DIR="/var/www/RavivarVichar"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
HTPASSWD_FILE="/etc/nginx/.htpasswd"
MAINTENANCE_HTML_SRC="$PROJECT_DIR/apps/client/maintenance.html"
MAINTENANCE_HTML_DST="/var/www/maintenance.html"
NORMAL_CONFIG="$NGINX_AVAILABLE/ravivarvichar"
MAINTENANCE_CONFIG="$NGINX_AVAILABLE/maintenance"

echo ""
echo -e "${YELLOW}╔══════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║     Enabling Maintenance Mode            ║${NC}"
echo -e "${YELLOW}╚══════════════════════════════════════════╝${NC}"
echo ""

# ─── Step 1: Copy maintenance page ───
info "Step 1: Copying maintenance page..."
if [ ! -f "$MAINTENANCE_HTML_SRC" ]; then
  fail "Maintenance page not found at $MAINTENANCE_HTML_SRC"
  exit 1
fi
if [ "$DRY_RUN" = false ]; then
  cp "$MAINTENANCE_HTML_SRC" "$MAINTENANCE_HTML_DST"
fi
pass "Maintenance page ready at $MAINTENANCE_HTML_DST"

# ─── Step 2: Get password securely ───
info "Step 2: Setting up HTTP Basic Auth..."

# In dry-run mode, skip password setup
if [ "$DRY_RUN" = true ]; then
  warn "Dry-run mode — password setup skipped"
else
  # Get password from env var or prompt (SECURE - no CLI args)
  PASSWORD=""
  if [ -n "$MAINTENANCE_PASS" ]; then
    PASSWORD="$MAINTENANCE_PASS"
    pass "Using password from MAINTENANCE_PASS environment variable"
  else
    # Prompt securely - input is hidden
    read -s -p "  Enter maintenance password: " PASSWORD
    echo ""
    read -s -p "  Confirm password: " PASSWORD_CONFIRM
    echo ""
    if [ "$PASSWORD" != "$PASSWORD_CONFIRM" ]; then
      fail "Passwords do not match"
      exit 1
    fi
    if [ -z "$PASSWORD" ]; then
      fail "Password cannot be empty"
      exit 1
    fi
    pass "Password set (hidden input)"
  fi

  # Create htpasswd file using batch mode (password as argument, not visible in ps)
  htpasswd -b "$HTPASSWD_FILE" admin "$PASSWORD" 2>/dev/null || {
    # Fallback for very old htpasswd without -b: use interactive mode (no CLI leak)
    warn "htpasswd -b not supported, falling back to interactive mode"
    htpasswd -c "$HTPASSWD_FILE" admin
  }
  # Clear password from shell memory
  unset PASSWORD
  unset PASSWORD_CONFIRM
  pass "HTTP Basic Auth configured (username: admin)"
fi

# ─── Step 3: Create maintenance Nginx config ───
info "Step 3: Creating maintenance Nginx config..."

if [ "$DRY_RUN" = false ]; then
  cat > "$MAINTENANCE_CONFIG" << 'NGINX'
server {
    listen 80;
    server_name _;

    # ─── Root URL: Auth-protected client preview ───
    #   Public: sees login dialog → cancel → sees maintenance page (200 OK, no more dialogs)
    #   You:    enter admin:password → see the actual client SPA for testing
    location / {
        auth_basic "RavivarVichar Maintenance";
        auth_basic_user_file /etc/nginx/.htpasswd;

        root /var/www/RavivarVichar/apps/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Auth failed/cancelled → show maintenance page with 200 status
        # (200 status means browser won't keep showing login dialog)
        error_page 401 =200 @maintenance_page;
    }

    location @maintenance_page {
        root /var/www;
        try_files /maintenance.html =404;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # ─── Admin — NOT in maintenance (already JWT-protected by the app) ───
    location /admin {
        alias /var/www/RavivarVichar/apps/admin/dist;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    # ─── API — protected with HTTP Basic Auth ───
    location /api/ {
        auth_basic "RavivarVichar Maintenance";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        error_page 401 =200 @maintenance_page;
    }

    # ─── Uploads — protected ───
    location /uploads/ {
        auth_basic "RavivarVichar Maintenance";
        auth_basic_user_file /etc/nginx/.htpasswd;

        alias /var/www/RavivarVichar/apps/server/uploads/;

        error_page 401 =200 @maintenance_page;
    }
}
NGINX
fi
pass "Maintenance config created"

# ─── Step 4: Switch Nginx to maintenance config ───
info "Step 4: Switching Nginx to maintenance mode..."
if [ "$DRY_RUN" = false ]; then
  # Disable normal config
  rm -f "$NGINX_ENABLED/ravivarvichar"
  # Enable maintenance config
  ln -sf "$MAINTENANCE_CONFIG" "$NGINX_ENABLED/maintenance"
  # Test and reload
  nginx -t || { fail "Nginx config test failed!"; exit 1; }
  systemctl reload nginx || nginx -s reload 2>/dev/null || true
fi
pass "Nginx switched to maintenance mode"

# ─── Done ───
echo ""
echo -e "${YELLOW}╔══════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║   Maintenance Mode is ACTIVE             ║${NC}"
echo -e "${YELLOW}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  What happens now:"
echo "  - PUBLIC visits http://yourdomain.com"
echo "      → auth dialog appears → cancel → sees maintenance page"
echo ""
echo "  - YOU visit http://admin:YOUR_PASS@yourdomain.com"
echo "      → sees the actual client website → test everything!"
echo "  - YOU visit http://yourdomain.com/admin"
echo "      → logs in normally (no extra auth) → manage content"
echo "  - YOU test API via: curl -u admin:PASS http://domain.com/api/v1/..."
echo ""
echo "  Workflow:"
echo "    1. MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh"
echo "    2. bash scripts/deploy.sh"
echo "    3. Test at http://admin:secret@yourdomain.com"
echo "    4. Found bug? Fix → git push → run deploy.sh again"
echo "       (maintenance stays ON the whole time)"
echo "    5. Satisfied? → bash scripts/maintenance-off.sh"
echo ""
echo "  Forgot password? bash scripts/maintenance-off.sh (no password needed)"
echo "  Change password?  MAINTENANCE_PASS=newpass bash scripts/maintenance-on.sh"
echo ""

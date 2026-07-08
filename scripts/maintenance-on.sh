#!/bin/bash
#
# Maintenance Mode — ON
#
# Switches Nginx to maintenance mode:
#   - ROOT URL → Cookie-based bypass:
#       • Public → sees maintenance page (no login dialog)
#       • You visit /_rv_preview → get bypass cookie → browse freely
#       • Or visit ?rv=PASS → cookie set automatically, redirected to /
#   - /admin → NOT in maintenance (already JWT-protected by the app)
#   - /api/ → NOT auth-protected (admin JS calls it freely; JWT middleware on server protects endpoints)
#   - /uploads/ → NOT auth-protected (served to authenticated admin users)
#
# Usage:
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
info "Step 2: Setting up bypass password..."

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
  unset PASSWORD_CONFIRM
  BYPASS_PASSWORD="$PASSWORD"
  unset PASSWORD
  pass "Bypass password configured"
fi

# ─── Step 3: Create maintenance Nginx config ───
info "Step 3: Creating maintenance Nginx config..."

if [ "$DRY_RUN" = false ]; then
    cat > "$MAINTENANCE_CONFIG" << 'NGINX'
server {
    listen 80;
    server_name _;

    # ─── Root URL: Cookie-based bypass ───
    #   Public: sees maintenance page directly (no login dialog)
    #   You:    visit /_rv_preview OR ?rv=PASSWORD once → cookie set → browse freely
    #
    #   Why cookies instead of Basic Auth?
    #   - Browsers strip admin:pass@ from URLs (security feature)
    #   - Cookies persist across SPA navigation; query params get lost
    #   - Public never sees a login dialog — just the clean maintenance page
    location / {
        # Query param shortcut: ?rv=PASSWORD → sets cookie then redirects to /
        if ($arg_rv = "__RV_PASSWORD__") {
            add_header Set-Cookie "rv_preview=__RV_PASSWORD__; Path=/; Max-Age=7200";
            return 302 /;
        }

        # No bypass cookie? → serve maintenance page (internal, not visible in URL)
        if ($cookie_rv_preview != "__RV_PASSWORD__") {
            rewrite ^ /_maintenance.html last;
        }

        # Has cookie → serve the client SPA normally
        root /var/www/RavivarVichar/apps/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Internal maintenance page (not directly accessible)
    location = /_maintenance.html {
        internal;
        root /var/www;
        try_files /maintenance.html =404;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # ─── Preview bypass cookie endpoint ───
    # Visit http://yourdomain.com/_rv_preview once to get the cookie
    # Protected by the same Basic Auth htpasswd file (so public can't sneak in)
    location = /_rv_preview {
        auth_basic "Preview Access";
        auth_basic_user_file /etc/nginx/.htpasswd;

        add_header Set-Cookie "rv_preview=__RV_PASSWORD__; Path=/; Max-Age=7200";
        add_header Content-Type text/plain;
        return 200 "Preview access granted. Navigate to / to browse the site.\n";
    }

    # ─── Admin — NOT in maintenance (already JWT-protected by the app) ───
    location /admin {
        alias /var/www/RavivarVichar/apps/admin/dist;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    # ─── API — NOT auth-protected (admin JS needs to call it freely)
    #       Admin is already JWT-protected by the app, and public can't reach
    #       the SPA to get API tokens anyway (they see maintenance page at /)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ─── Uploads — NOT auth-protected (served to authenticated admin)
    location /uploads/ {
        alias /var/www/RavivarVichar/apps/server/uploads/;
    }
}
NGINX

  # Substitute the actual password into the config
  # Use | as sed delimiter to avoid issues with / in passwords
  ESCAPED_PASSWORD=$(printf '%s\n' "$BYPASS_PASSWORD" | sed 's:[][\/.^$*&|]:\\&:g')
  sed -i "s|__RV_PASSWORD__|$ESCAPED_PASSWORD|g" "$MAINTENANCE_CONFIG"
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
echo "      → sees maintenance page (no login dialog)"
echo ""
echo "  - YOU preview the client site:"
echo "      Step 1: Visit http://yourdomain.com/_rv_preview"
echo "              (this sets a cookie for 2 hours)"
echo "      Step 2: Visit http://yourdomain.com/"
echo "              → sees the actual client website → browse freely!"
echo ""
echo "      Alternative: Visit http://yourdomain.com/?rv=YOUR_PASS"
echo "              (cookie set automatically, redirected to /)"
echo ""
echo "  - YOU visit http://yourdomain.com/admin"
echo "      → logs in normally → manage content"
echo "  - YOU test API via: curl http://domain.com/api/v1/..."
echo ""
echo "  Workflow:"
echo "    1. MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh"
echo "    2. bash scripts/deploy.sh"
echo "    3. Open /_rv_preview in browser → then test the site"
echo "    4. Found bug? Fix → git push → run deploy.sh again"
echo "       (maintenance stays ON the whole time)"
echo "    5. Satisfied? → bash scripts/maintenance-off.sh"
echo ""
echo "  Forgot password? bash scripts/maintenance-off.sh (no password needed)"
echo "  Change password?  MAINTENANCE_PASS=newpass bash scripts/maintenance-on.sh"
echo ""

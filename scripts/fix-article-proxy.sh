#!/bin/bash
#
# RavivarVichar — Fix article proxy in nginx
#
# Run this ON THE DROPLET if apply-seo-nginx.sh said "already present"
# but article pages still return the SPA shell instead of server-rendered HTML.
#
#   bash scripts/fix-article-proxy.sh

set -euo pipefail

CONFIG="/etc/nginx/sites-available/ravivarvichar"

echo "[INFO] Checking $CONFIG for article proxy blocks"

if [ ! -f "$CONFIG" ]; then
  echo "[FAIL] $CONFIG not found"
  exit 1
fi

# Check if article proxy already exists
if grep -q "location ~ \\^/articles/\\[\\^/\\]" "$CONFIG"; then
  echo "[INFO] Article proxy blocks already present — nothing to do"
  exit 0
fi

BACKUP="${CONFIG}.bak-fix-$(date +%Y%m%d%H%M%S)"
cp "$CONFIG" "$BACKUP"
echo "[INFO] Backup saved: $BACKUP"

# Find the proxy_pass from the /api/ block
PROXY=$(grep -A1 "location /api/" "$CONFIG" | grep proxy_pass | sed 's/.*proxy_pass\s*//;s/;.*//')
if [ -z "$PROXY" ]; then
  PROXY="http://localhost:5000"
fi
echo "[INFO] Using proxy: $PROXY"

# Insert article proxy blocks BEFORE the SPA location block
# Find the line number of the known SPA routes block
SPA_LINE=$(grep -n "location ~ \\^/(about|articles" "$CONFIG" | head -1 | cut -d: -f1)

if [ -z "$SPA_LINE" ]; then
  echo "[WARN] Could not find SPA routes block. Inserting before 'location / {' instead."
  SPA_LINE=$(grep -n "location / {" "$CONFIG" | tail -1 | cut -d: -f1)
fi

if [ -z "$SPA_LINE" ]; then
  echo "[FAIL] Could not find any location block to insert before"
  exit 1
fi

# Create the article proxy blocks
PROXY_BLOCKS="
    # ─── Server-rendered article/ recognition pages ───
    # (added by scripts/fix-article-proxy.sh)
    # Proxy single-article detail pages to Express so crawlers and social bots
    # see article-specific <title>, <meta>, canonical, OG tags, and JSON-LD
    # in the FIRST HTML response.  The SPA still loads and hydrates on top.
    location ~ ^/articles/[^/]+/?$ {
        proxy_pass ${PROXY};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location ~ ^/recognitions/[^/]+/?$ {
        proxy_pass ${PROXY};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

"

# Insert before the SPA line
sed -i "${SPA_LINE}i\\
${PROXY_BLOCKS}" "$CONFIG"

echo "[INFO] Article proxy blocks inserted"

# Test
echo "[INFO] Testing nginx config..."
nginx -t

echo "[INFO] Reloading nginx..."
systemctl reload nginx

echo ""
echo "[PASS] Done. Test with:"
echo "  curl -s https://ravivarvichar.in/articles/SLUG | grep '<title>'"
echo "  # Should show article-specific title, not generic site title"
echo ""
echo "  Rollback: cp ${BACKUP} ${CONFIG} && nginx -t && systemctl reload nginx"

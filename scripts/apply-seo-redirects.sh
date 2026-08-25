#!/bin/bash
#
# RavivarVichar — www → non-www + HTTP → HTTPS redirect
#
# Run this ON THE DROPLET (one-time, idempotent):
#
#   bash scripts/apply-seo-redirects.sh
#
# This adds:
#   1. www.ravivarvichar.in → ravivarvichar.in (301 permanent redirect)
#   2. http:// → https:// (301 permanent redirect, combined with #1)
#
# Without this, both www and non-www serve the same content = duplicate content
# in Google's eyes.  Google picks one, but the other wastes crawl budget.
#
# Safe: backs up the config, idempotent on re-run.

set -euo pipefail

CONFIG="/etc/nginx/sites-available/ravivarvichar"

echo "[INFO] Patching $CONFIG for www → non-www + HTTP → HTTPS redirects"

if [ ! -f "$CONFIG" ]; then
  echo "[FAIL] $CONFIG not found. Is the site deployed?"
  exit 1
fi

BACKUP="${CONFIG}.bak-redirects-$(date +%Y%m%d%H%M%S)"
cp "$CONFIG" "$BACKUP"
echo "[INFO] Backup saved: $BACKUP"

python3 <<'PY'
import re, sys

cfg_path = "/etc/nginx/sites-available/ravivarvichar"

with open(cfg_path) as f:
    cfg = f.read()

MARKER = "# ─── Redirects (managed by"
if MARKER in cfg:
    print("[INFO] Redirect blocks already present — nothing to do.")
    sys.exit(0)

# ─── Find the SSL cert paths from the existing config ───
ssl_cert_match = re.search(r"ssl_certificate\s+([^;]+);", cfg)
ssl_key_match = re.search(r"ssl_certificate_key\s+([^;]+);", cfg)

if not ssl_cert_match or not ssl_key_match:
    print("[WARN] No SSL cert found in config. Skipping HTTPS redirect (Cloudflare may handle it).")
    ssl_block = ""
else:
    ssl_cert = ssl_cert_match.group(1).strip()
    ssl_key = ssl_key_match.group(1).strip()
    print(f"[INFO] Using SSL cert: {ssl_cert}")

    # ─── 1. HTTP → HTTPS redirect (all hostnames) ───
    # Replace the existing HTTP server block if it just does return 301,
    # or add a new one if missing.
    http_server_pattern = re.compile(
        r"# ─── HTTP → HTTPS redirect.*?^}\n",
        re.MULTILINE | re.DOTALL
    )

    http_redirect_block = f"""    # ─── Redirects (managed by scripts/apply-seo-redirects.sh — do not edit by hand) ───
    # HTTP → HTTPS for all hostnames
    server {{
        listen 80;
        server_name ravivarvichar.in www.ravivarvichar.in admin.ravivarvichar.in;
        return 301 https://ravivarvichar.in$request_uri;
    }}

    # www → non-www redirect (HTTPS)
    server {{
        listen 443 ssl http2;
        server_name www.ravivarvichar.in;
        ssl_certificate {ssl_cert};
        ssl_certificate_key {ssl_key};
        ssl_protocols TLSv1.2 TLSv1.3;
        return 301 https://ravivarvichar.in$request_uri;
    }}
"""

    # Check if there's already an HTTP server block doing redirects
    http_server_match = re.search(
        r"server\s*\{\s*\n\s*listen\s+80\s*;.*?return\s+301\s+https://",
        cfg,
        re.DOTALL
    )

    if http_server_match:
        print("[INFO] HTTP → HTTPS redirect already exists — replacing with www-aware version")
        # Find the full server block
        start = cfg.rfind("server", 0, http_server_match.start())
        if start == -1:
            start = http_server_match.start()
        # Find matching closing brace
        depth = 0
        end = start
        in_block = False
        for i in range(start, len(cfg)):
            if cfg[i] == '{':
                depth += 1
                in_block = True
            elif cfg[i] == '}':
                depth -= 1
                if in_block and depth == 0:
                    end = i + 1
                    break
        old_block = cfg[start:end]
        cfg = cfg[:start] + http_redirect_block + cfg[end:]
    else:
        # Add at the very beginning of the file (before other server blocks)
        cfg = http_redirect_block + "\n" + cfg

    # ─── 2. Remove www from the main HTTPS server_name ───
    # The main server block should only listen for non-www + admin
    cfg = re.sub(
        r'(listen\s+443\s+ssl\s+http2\s*;\s*\n\s*server_name\s+)ravivarvichar\.in\s+www\.ravivarvichar\.in(\s*;)',
        r'\1ravivarvichar.in admin.ravivarvichar.in\2',
        cfg
    )

with open(cfg_path, "w") as f:
    f.write(cfg)
print("[INFO] nginx config updated with www → non-www + HTTP → HTTPS redirects.")
PY

echo "[INFO] Testing nginx config..."
nginx -t

echo "[INFO] Reloading nginx..."
systemctl reload nginx

echo ""
echo "[PASS] Done. Verify from your local machine:"
echo "  curl -sI http://www.ravivarvichar.in/       # expect 301 → https://ravivarvichar.in/"
echo "  curl -sI http://ravivarvichar.in/           # expect 301 → https://ravivarvichar.in/"
echo "  curl -sI https://www.ravivarvichar.in/      # expect 301 → https://ravivarvichar.in/"
echo "  curl -sI https://ravivarvichar.in/          # expect 200 (the site)"
echo ""
echo "  Rollback: cp ${CONFIG}.bak-redirects-* ${CONFIG} && nginx -t && systemctl reload nginx"

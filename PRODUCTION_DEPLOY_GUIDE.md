# 🚀 RavivarVichar — Production Deploy Guide (`ravivarvichar.in` + Cloudflare)

> **THE document to follow for the final production launch.**
> Follow the phases **in order** — each one ends with a check that must pass before you move on.
>
> - **Domain:** `ravivarvichar.in` (registered at **GoDaddy**, currently pointing to the old site)
> - **Old staging server:** `142.93.213.69` (keep it running until the new site is verified)
> - **New server:** brand-new DigitalOcean droplet (Ubuntu 24.04)
> - **SSL:** Cloudflare **Origin Certificate** + SSL mode **Full (strict)** — free, 15-year validity, no renewals
>
> Related docs: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) (daily ops / troubleshooting) ·
> [`OriginalDeploymentGuide.md`](./OriginalDeploymentGuide.md) (lessons learned)

---

## 0. The Master Plan (why this order)

```
PHASE 1-4   Build the server, deploy the app, test via the droplet IP
PHASE 5     Add ravivarvichar.in to Cloudflare + create DNS records (NOT live yet)
PHASE 6-7   Generate origin SSL cert → install on server → test HTTPS (still NOT live)
PHASE 8     GO LIVE: change nameservers at GoDaddy to Cloudflare's → DNS propagates
PHASE 9     Post-launch: verify, change admin password, email, backups
```

**Why this order:** nothing goes live until Phase 8. Up until then, the domain keeps
resolving (via GoDaddy) to the OLD site, so visitors are never affected. The new site is
tested directly against the droplet IP / via a hosts-file override. Only when everything
is verified do you flip the nameservers — a one-way switch that takes minutes to propagate.

### What changed in the repo for this launch (commit in Phase 2.1)

| File | Change |
|------|--------|
| `scripts/maintenance-on.sh` | Maintenance mode now also listens on **HTTPS (443)** with the origin cert — required because Cloudflare Full/strict always connects to the origin over 443. Old staging IP references replaced with `ravivarvichar.in`. |

> ⚠️ **Important:** the maintenance scripts assume the origin cert exists at
> `/etc/nginx/ssl/ravivarvichar-origin.crt` / `.key`. Only enable maintenance mode
> **after Phase 6** (cert installed).

---

## 1. Key Facts

| Item | Value |
|------|-------|
| Repo | `https://github.com/SarthakVaishampayan/RavivarVichar.git` |
| Local git remote | `RavivarVichar` (not `origin` — check with `git remote -v`) |
| Server path on droplet | `/var/www/RavivarVichar` |
| Node process (PM2) | `ravivarvichar-api` (port 5000) |
| Client | `apps/client/dist` · Admin | `apps/admin/dist` (base `/admin/`) |
| Database | MongoDB 7 on localhost (`ravivarvichar`) |
| Origin cert paths | `/etc/nginx/ssl/ravivarvichar-origin.crt` + `.key` |
| Seed admin (CHANGE AFTER LAUNCH) | `admin@ravivarvichar.org` / `Admin@123` |
| **Droplet IP** | `<DROPLET_IP>` — replace everywhere you see this |

---

## 2. Phase 0 — Local Prep (on your Windows machine)

### 2.1 — Make sure the latest code is pushed

```bash
git add -A
git commit -m "chore: ssl-aware maintenance scripts for Cloudflare launch"
git push RavivarVichar main
```

### 2.2 — Verify the admin vite base path (required for the admin to load)

```bash
grep "base" apps/admin/vite.config.js
```

Expected: `base: '/admin/',`. If missing, add it, commit, and push again.

### 2.3 — (Optional) Run the sanity check

```bash
node scripts/sanity-check.js
```

Expect: **0 failures**. (You can also just run it again later on the server.)

---

## 3. Phase 1 — Create the Droplet (DigitalOcean)

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com) → **Create → Droplet**
2. **Distribution:** Ubuntu **24.04 LTS**
3. **Size:** **$12/mo — 2 GB RAM / 2 vCPU / 50 GB SSD** *(do NOT go lower — the docs warn 1 GB kills the frontend builds)*
4. **Region:** **Bangalore (BLR1)** or **Mumbai** — closest to your users
5. **Authentication:** SSH key (recommended — add the same key you use for the staging server; you can also create a new one and download it)
6. **Hostname:** `ravivarvichar-production`
7. Click **Create Droplet**, then copy the **IP address** and save it as `<DROPLET_IP>`.

> Keep the **old droplet running** for now — it stays live until Phase 8.

### Check: SSH into the new server

```bash
ssh root@<DROPLET_IP>
```

You should get a root shell. Keep this terminal open — every phase below runs here.

---

## 4. Phase 2 — Install Server Dependencies (on the droplet)

Run this whole block once (it takes a few minutes):

```bash
apt update && apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org

# Nginx + Git + apache2-utils (needed by maintenance mode for htpasswd)
apt install -y nginx git apache2-utils

# PM2 (Node process manager)
npm install -g pm2
```

### 4.1 — Add swap space (protects builds from OOM "Killed" errors)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -m   # verify: Swap row shows ~2048 MB
```

### 4.2 — Start MongoDB and enable auto-start

```bash
systemctl start mongod
systemctl enable mongod
```

### 4.3 — Verify everything installed

```bash
node -v                      # v20.x
npm -v                       # 10.x
mongosh --eval "db.version()"  # 7.x
nginx -v                     # nginx/1.24.x
pm2 --version
```

### Check: all version commands print successfully.

---

## 5. Phase 3 — Clone, Configure, Seed, Start the App

### 5.1 — Clone the repo

```bash
cd /var
mkdir -p www && cd www
git clone https://github.com/SarthakVaishampayan/RavivarVichar.git
cd RavivarVichar
```

### 5.2 — Install dependencies (fresh Linux clone — no Windows mismatch here)

```bash
npm install
```

### 5.3 — Create the `.env` file (production)

Generate strong secrets first:

```bash
ACCESS=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")
REFRESH=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")
SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
```

Create the file with your real domains:

```bash
cat > apps/server/.env << ENVEOF
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=$ACCESS
JWT_REFRESH_SECRET=$REFRESH
IP_HASH_SALT=$SALT
CLIENT_URL=https://ravivarvichar.in
ADMIN_URL=https://admin.ravivarvichar.in
# Cloudinary: leave empty → uploads are saved to apps/server/uploads (local disk)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# Resend (password-reset emails) — set this in Phase 9
RESEND_API_KEY=
RESEND_FROM=Ravivar Vichar <onboarding@resend.dev>
ENVEOF
```

Create the uploads folder:

```bash
mkdir -p apps/server/uploads
```

> ℹ️ The server refuses to boot in production if `IP_HASH_SALT` is missing or JWT
> secrets are < 32 chars — the commands above generate all three correctly.

### 5.4 — Seed the database (FRESH droplet — this wipes + inserts starter data)

```bash
npm run seed -w apps/server
```

Default admin: **`admin@ravivarvichar.org`** / **`Admin@123`** — change it in Phase 9.

### 5.5 — Deploy (builds frontends + starts PM2 + verifies health)

The one-command path (same as documented in `DEPLOYMENT_GUIDE.md`):

```bash
bash scripts/deploy.sh
```

It will: check git state → build `client` + `admin` → start/restart PM2 process
`ravivarvichar-api` → check API health. **(If any step fails it auto-rolls back.)**

> Manual alternative if you prefer to see each step:
> ```bash
> NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
> NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
> pm2 start apps/server/src/server.js --name ravivarvichar-api
> ```

### 5.6 — Make PM2 auto-start on reboot

```bash
pm2 save
pm2 startup
# Copy & paste the command it prints (starts with "sudo env PATH=..."), then run it.
```

### Check: API is healthy on the droplet

```bash
curl http://localhost:5000/api/v1/health
```

Expected: `{"success":true,"message":"RavivarVichar API is running",...}`

---

## 6. Phase 4 — Nginx (HTTP) + First Test via the Droplet IP

### 6.1 — Create the Nginx config (HTTP-only for now)

```bash
nano /etc/nginx/sites-available/ravivarvichar
```

Paste this **v1 config** (serves site + admin + API + uploads over port 80):

```nginx
server {
    listen 80;
    server_name _;   # catch-all — works for the IP while we test

    root /var/www/RavivarVichar/apps/client/dist;
    index index.html;

    # Bigger uploads (the API accepts up to 50 MB — nginx default is only 1 MB)
    client_max_body_size 50m;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        alias /var/www/RavivarVichar/apps/admin/dist;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

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

    location /uploads/ {
        alias /var/www/RavivarVichar/apps/server/uploads/;
    }

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}
```

Enable it and reload:

```bash
rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/ravivarvichar /etc/nginx/sites-enabled/
nginx -t          # must say "syntax is ok ... test is successful"
systemctl restart nginx
```

### Check: site loads from the droplet IP

Open in your browser: `http://<DROPLET_IP>` → the client site should render.
`http://<DROPLET_IP>/api/v1/health` → the JSON health response.

> ℹ️ **Admin login will NOT work over plain HTTP** — the refresh-token cookie is
> `secure` in production, so admin login requires HTTPS (you'll test it in Phase 7).

---

## 7. Phase 5 — Connect Cloudflare (DNS records — still NOT live)

> At this point nothing about the domain has changed. You're just preparing Cloudflare.

### 7.1 — Add the site to Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) (create a free account if needed)
2. **Add a site** → enter `ravivarvichar.in` → **Free** plan → Continue
3. Cloudflare will **scan your existing GoDaddy DNS records** and list them.
4. ⚠️ **Keep every MX / TXT / SPF record** (email!). You will only **edit the A records**.
5. ⚠️ **Delete any conflicting CNAME records** that Cloudflare imports (e.g. a parked
   `www` CNAME or an `admin` CNAME from GoDaddy). `@`, `www`, and `admin` must be
   **true A records** pointing to the new droplet IP — a CNAME and an A record for the
   same name can't coexist, and a CNAME would send traffic somewhere else.
7. Update the A records to the **new droplet IP**:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | `<DROPLET_IP>` | 🟠 Proxied |
| A | `www` | `<DROPLET_IP>` | 🟠 Proxied |
| A | `admin` | `<DROPLET_IP>` | 🟠 Proxied |

8. On the **"Change your nameservers"** screen: **do NOT change them yet.**
   Just copy the **2 Cloudflare nameservers** it shows (e.g. `xxx.ns.cloudflare.com`).
   The zone will sit in **"Pending nameserver update"** — that's expected and fine.
9. Cloudflare shows you the 2 nameservers again later in **Domain Registration / DNS** settings.

### 7.2 — Set the SSL mode now (takes effect at go-live)

Dashboard → **SSL/TLS → Overview**:
- SSL mode: **Full (strict)** ✅
- (Optional) **Edge Certificates → Always Use HTTPS** → ON, **Automatic HTTPS Rewrites** → ON

> Because the zone is pending, none of this affects the live site yet. It all activates
> the moment the nameservers switch in Phase 8.

### Check: zone shows `Pending nameserver update` in Cloudflare; old site still live.

---

## 8. Phase 6 — Obtain SSL: Cloudflare Origin Certificate

> Why **Origin Certificate** and not Let's Encrypt?
> - **Free, 15-year validity, zero renewals** (Let's Encrypt = re-issue every 90 days).
> - Purpose-built for "origin behind Cloudflare" with **Full (strict)** mode.
> - Can be issued **while the zone is still pending** — exactly what we need, because
>   you want SSL on the new server *before* the nameserver switch.

### 8.1 — Generate the certificate (in Cloudflare)

1. Dashboard → **SSL/TLS → Origin Server → Create Certificate**
2. **Let Cloudflare generate a private key and a CSR** (default) — 15 years validity
3. Hostnames — include all of these:
   ```
   ravivarvichar.in
   *.ravivarvichar.in
   www.ravivarvichar.in
   admin.ravivarvichar.in
   ```
4. **Create** → you get two blocks:
   - **Origin Certificate** (PEM) — a long `-----BEGIN CERTIFICATE-----` blob
   - **Private key** — a `-----BEGIN PRIVATE KEY-----` blob
5. Copy both into a scratch file on your computer (e.g. `origin-cert.txt`) — you'll
   paste them onto the server next.

### 8.2 — Install the certificate on the droplet

```bash
mkdir -p /etc/nginx/ssl
nano /etc/nginx/ssl/ravivarvichar-origin.crt   # paste the full CERTIFICATE PEM (includes the chain)
nano /etc/nginx/ssl/ravivarvichar-origin.key   # paste the PRIVATE KEY
chmod 644 /etc/nginx/ssl/ravivarvichar-origin.crt
chmod 600 /etc/nginx/ssl/ravivarvichar-origin.key
```

### Check: certificate is readable

```bash
openssl x509 -in /etc/nginx/ssl/ravivarvichar-origin.crt -noout -dates -subject
```

Should print the cert dates (15 years out) and a subject containing `ravivarvichar.in`.

---

## 9. Phase 7 — Nginx HTTPS + Pre-Launch Testing (still NOT live)

### 9.1 — Replace the Nginx config with the final (HTTP + HTTPS) version

```bash
nano /etc/nginx/sites-available/ravivarvichar
```

Paste this **v2 config**:

```nginx
# ─── HTTP → HTTPS redirect (edge handles visitors; this catches direct-IP hits) ───
server {
    listen 80;
    server_name ravivarvichar.in www.ravivarvichar.in admin.ravivarvichar.in;
    return 301 https://$host$request_uri;
}

# ─── HTTPS server (Cloudflare Full/strict connects here) ───
server {
    listen 443 ssl http2;
    server_name ravivarvichar.in www.ravivarvichar.in admin.ravivarvichar.in;

    # Cloudflare Origin Certificate
    ssl_certificate /etc/nginx/ssl/ravivarvichar-origin.crt;
    ssl_certificate_key /etc/nginx/ssl/ravivarvichar-origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Bigger uploads (API accepts up to 50 MB)
    client_max_body_size 50m;

    root /var/www/RavivarVichar/apps/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        alias /var/www/RavivarVichar/apps/admin/dist;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

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

    location /uploads/ {
        alias /var/www/RavivarVichar/apps/server/uploads/;
    }

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    # ─── Cloudflare real visitor IPs (accurate analytics/rate-limiting) ───
    # Ranges from https://www.cloudflare.com/ips-v4 (re-check before enabling)
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    real_ip_header CF-Connecting-IP;

    # If the droplet has IPv6 enabled, add Cloudflare's v6 ranges too
    # (see https://www.cloudflare.com/ips-v6), e.g.:
    # set_real_ip_from 2400:cb00::/32;
}
```

Reload:

```bash
nginx -t
systemctl restart nginx
```

### 9.2 — Test HTTPS on the droplet (bypasses the domain entirely)

```bash
# From your LOCAL machine — sends the request straight to the droplet:
curl --resolve ravivarvichar.in:443:<DROPLET_IP> https://ravivarvichar.in/api/v1/health
```

Expected: the health JSON, **no `-k` needed** (the origin cert is valid for the domain).

Test the site + admin in a browser using a **hosts-file override** (so your machine
resolves the domain to the new droplet):

- **Windows** (Notepad as Administrator → `C:\Windows\System32\drivers\etc\hosts`)
- **macOS/Linux:** `sudo nano /etc/hosts`

Add these lines, save, and close the browser tab(s) first:

```
<DROPLET_IP> ravivarvichar.in
<DROPLET_IP> www.ravivarvichar.in
<DROPLET_IP> admin.ravivarvichar.in
```

Now visit:

| URL | Expect |
|-----|--------|
| `https://ravivarvichar.in` | Client site loads, **no cert warning** |
| `https://ravivarvichar.in/admin` | Admin login page loads |
| `https://admin.ravivarvichar.in/admin` | Admin login (subdomain also works) |
| `https://ravivarvichar.in/api/v1/health` | `{"success":true,...}` |

> 💡 **Windows users:** after editing `hosts`, run `ipconfig /flushdns` and use an
> **incognito window** — Chrome caches DNS and previously-seen redirects, which can
> otherwise silently show you the old site.

Log into the admin (seed credentials) and click through a few pages.

### 9.3 — (Optional) Test the maintenance flow now that SSL works

```bash
cd /var/www/RavivarVichar
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh
curl --resolve ravivarvichar.in:443:<DROPLET_IP> https://ravivarvichar.in/   # → maintenance page
bash scripts/maintenance-off.sh
```

> This verifies the SSL-aware maintenance scripts work with Full/strict before you go live.

> ℹ️ Note: from this point on, `http://<DROPLET_IP>` in a browser will 301-redirect to
> HTTPS (and show a cert warning for the raw IP). Testing now happens over HTTPS via
> the hosts-file method above — that's expected.

### Check: HTTPS works on the droplet with a valid cert; admin login works.

> **Remove the hosts-file lines after testing** (unless you want to keep testing the
> new server — it doesn't affect anyone else, only your machine).

---

## 10. Phase 8 — GO LIVE: Switch Nameservers at GoDaddy

> Do this only when you're happy with everything in Phase 7.
> After this, traffic flows: **Visitor → Cloudflare → (Full/strict) → your new droplet.**

### 10.1 — Change nameservers

1. Log into [GoDaddy](https://godaddy.com) → **Domains → ravivarvichar.in**
2. **Manage DNS / Nameservers** → **Change nameservers**
3. Select **"I'll use my own nameservers"** (or "Enter custom nameservers")
4. Enter the **2 Cloudflare nameservers** from Phase 5 (e.g. `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`)
5. Save. **Do not remove/change the A records in GoDaddy** — once nameservers point to
   Cloudflare, GoDaddy's DNS records stop being used entirely (Cloudflare's take over).

### 10.2 — Watch it propagate

```bash
# From your local machine (after ~5-30 min):
dig +short NS ravivarvichar.in        # should show the 2 Cloudflare nameservers
dig +short ravivarvichar.in           # resolves to the droplet IP (or Cloudflare's proxy IPs)

# No dig on Windows? Use nslookup (built-in):
nslookup -type=NS ravivarvichar.in    # shows the 2 Cloudflare nameservers
nslookup ravivarvichar.in             # shows the resolved IP
```

Also check [dnschecker.org](https://dnschecker.org) — wait until the new nameservers
show worldwide.

### 10.3 — Confirm in Cloudflare

- Dashboard → the zone should now read **"Active"** (no longer "Pending")
- **SSL/TLS → Overview:** mode = **Full (strict)**, certificate = **Universal SSL** (edge)
- **Always Use HTTPS:** ON

### 10.4 — Final public checks (from a normal browser, hosts-file lines removed)

| URL | Expect |
|-----|--------|
| `https://ravivarvichar.in` | Client site loads with a valid padlock |
| `https://ravivarvichar.in/admin` | Admin loads |
| `https://ravivarvichar.in/api/v1/health` | `{"success":true,...}` |
| `https://ravivarvichar.in/_rv_preview` | 404 / normal page (maintenance OFF) |

> 🎉 **The site is now live on the new production droplet, served through Cloudflare,
> with valid HTTPS on both edges.**

---

## 11. Phase 9 — Post-Launch Checklist

### 11.1 — Security (do immediately)

1. **Change the admin password:** `https://ravivarvichar.in/admin` → login with
   `admin@ravivarvichar.org` / `Admin@123` → **Settings → Change Password**
2. Verify the server refuses weak env (it does): secrets are all generated, `IP_HASH_SALT` set.
3. (Optional) **UFW firewall** on the droplet:
   ```bash
   ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
   ```
   For max security, allow 80/443 **only from Cloudflare IPs** (see
   https://www.cloudflare.com/ips-v4) and 22 from your own IP.

### 11.2 — Email (Resend) — password-reset links

Follow the steps in [`TODO.md`](./TODO.md): create a Resend account, add
`ravivarvichar.in`, paste the 2 DNS records (TXT + DKIM) into **Cloudflare DNS**, then add
`RESEND_API_KEY` to `apps/server/.env` and `pm2 restart ravivarvichar-api`.

### 11.3 — Backups (recommended cron)

```bash
cat > /root/backup-mongo.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups/mongodb"
mkdir -p "$BACKUP_DIR"
mongodump --db ravivarvichar --out "$BACKUP_DIR/$(date +%Y-%m-%d)"
gzip -r "$BACKUP_DIR/$(date +%Y-%m-%d)"
find "$BACKUP_DIR" -maxdepth 1 -mtime +7 -exec rm -rf {} \;
EOF
chmod +x /root/backup-mongo.sh
crontab -e   # add these two lines, then save:
# 0 3 * * * /root/backup-mongo.sh
# 0 4 * * * rsync -a /var/www/RavivarVichar/apps/server/uploads/ /root/backups/uploads/
```

### 11.4 — Old droplet

Once the new site has been verified for a few days, shut down the old droplet
`142.93.213.69` (keep a snapshot first if you want a fallback).

### 11.5 — Tell Buffy

After a successful launch, say **"Update deployment reference"** so
`DEPLOYMENT_REFERENCE.md` captures the new production state.

---

## 12. Troubleshooting (Cloudflare-specific)

| Error | Likely cause | Fix |
|-------|-------------|-----|
| **522** Connection timed out | Nothing listening on 443 on the droplet | `systemctl status nginx`; confirm the HTTPS server block is enabled |
| **525** SSL handshake failed | Cloudflare can't negotiate TLS with origin | Check nginx `ssl_protocols`; ensure 443 block is loaded |
| **526** Invalid SSL certificate | Origin cert missing / doesn't match hostname | Re-verify cert at `/etc/nginx/ssl/`; regenerate origin cert to include `ravivarvichar.in` |
| **ERR_TOO_MANY_REDIRECTS** after cutover | SSL mode still Flexible/Full while origin forces HTTPS | Set SSL mode to **Full (strict)** |
| Site goes down when maintenance enabled | Old maintenance script (HTTP-only) + Full/strict | Update repo (SSL-aware script) → `bash scripts/deploy.sh` → re-run maintenance |
| Admin white screen | Missing `base: '/admin/'` in `apps/admin/vite.config.js` | Add it, rebuild, redeploy |
| API returns HTML / 404 | Nginx `location /api/` block missing | Re-check the nginx config |
| Uploads fail with 413 | nginx `client_max_body_size` too small | Set `client_max_body_size 50m;` (already in v2 config) |
| Analytics IPs all Cloudflare | `real_ip` block not applied | Confirm `set_real_ip_from` ranges + `real_ip_header CF-Connecting-IP` |
| `git pull` fails on `package-lock.json` | Known quirk | `rm package-lock.json && git pull` (or use `bash scripts/deploy.sh` which handles it) |

---

## 13. Quick Reference — Daily Operations

### Deploy updates (standard cycle)

```bash
# LOCAL:
git push RavivarVichar main

# SERVER (ssh root@<DROPLET_IP>):
cd /var/www/RavivarVichar
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh   # enables HTTPS-aware maintenance
bash scripts/deploy.sh                                    # pull → sanity → build → restart
# test at https://ravivarvichar.in/_rv_preview (admin / secret)
bash scripts/maintenance-off.sh                           # take live
```

### Health & logs

```bash
pm2 status                              # process list
pm2 logs ravivarvichar-api --lines 100  # server logs
curl http://localhost:5000/api/v1/health
systemctl status nginx mongod
free -m && df -h
```

### Nginx / SSL

```bash
nginx -t
systemctl reload nginx
openssl x509 -in /etc/nginx/ssl/ravivarvichar-origin.crt -noout -dates   # cert validity
```

### Maintenance

```bash
MAINTENANCE_PASS=newpass bash scripts/maintenance-on.sh   # enable / change pass
bash scripts/maintenance-off.sh                           # disable (no password needed)
```

---

> **Next step when ready:** tell Buffy *"Update deployment reference"* and start on the
> remaining TODO items (Resend email, backups monitoring, Google Search Console).


# RavivarVichar CMS — Original Deployment Guide

> **For the final production deployment on a new server.**  
> This document captures every lesson learned, mistake made, and command needed from the testing/staging server so the production deploy is smooth and error-free.
>
> **Current testing server:** `STAGING_IP` (DigitalOcean, $6/mo, 1GB RAM)  
> **Target production server:** TBD (new droplet)
>
> *Replace `STAGING_IP` with your actual staging server IP when referencing the staging server.*

---

## Table of Contents

- [The Story](#the-story)
- [Lessons Learned](#lessons-learned)
- [Step 0: Pre-Deployment Checklist](#step-0-pre-deployment-checklist)
- [Step 1: Create Fresh Droplet](#step-1-create-fresh-droplet)
- [Step 2: Install System Dependencies](#step-2-install-system-dependencies)
- [Step 3: Clone & Configure](#step-3-clone--configure)
- [Step 4: Deploy (Use the Script)](#step-4-deploy-use-the-script)
- [Step 5: Configure Nginx](#step-5-configure-nginx)
- [Step 6: Set Up Maintenance Mode](#step-6-set-up-maintenance-mode)
- [Step 7: DNS & SSL](#step-7-dns--ssl)
- [Step 8: Final Verification](#step-8-final-verification)
- [Production-Specific Config](#production-specific-config)
- [Post-Deploy: Backups & Monitoring](#post-deploy-backups--monitoring)

---

## The Story

### Why This Document Exists

The current staging droplet was set up as a testing/staging environment to learn the deployment process, catch issues, and perfect the workflow. Now that we know exactly what to expect, the **production server will be a fresh deploy** with all lessons baked in from day one.

### What We Learned (The Hard Way)

| # | Lesson | What Happened | Production Fix |
|---|--------|---------------|----------------|
| 1 | **`package-lock.json` is NOT tracked in old commits** | `git pull` failed because the file existed locally but wasn't tracked in the current commit. Had to `rm package-lock.json` before pulling. | **On a fresh clone, this won't happen.** The lock file will be tracked from the start. |
| 2 | **Windows → Linux platform mismatch** | `node_modules` from Windows breaks on Linux (rollup-linux missing). | `deploy.sh` auto-detects and reinstalls. On fresh clone, `npm install` runs on Linux directly — no issue. |
| 3 | **1GB RAM is NOT enough for builds** | Build gets "Killed" with OOM error. | **Must add swap space** or use `NODE_OPTIONS="--max-old-space-size=512"`. Add swap during Step 2. |
| 4 | **`base: '/admin/'` is REQUIRED in vite.config.js** | Admin showed white screen on first deploy because paths were wrong. | **Verify this before first push.** Add checklist item. |
| 5 | **Admin idle timeout must reload, not redirect** | Old code redirected to `/login` (main site's login, blank page). Fixed with `window.location.reload()`. | The fix is already in the codebase. |
| 6 | **Nginx config must handle SPA routing** | Without `try_files $uri $uri/ /index.html`, inner routes return 404. | Template provided in Nginx section. |
| 7 | **Forgot the maintenance-off password?** | No problem — maintenance-off.sh doesn't need a password. Only turning it ON requires one. | Document this clearly. |
| 8 | **Deploy script auto-rollback works** | When build failed, script restored old builds and git commit automatically. | **Trust the deploy script** — it handles failures gracefully. |
| 9 | **.env file is NOT tracked in git** | Must be manually created on the server. | Add to post-clone checklist. |

---

## Step 0: Pre-Deployment Checklist (LOCAL)

### [ ] 0.1 — Push latest code to GitHub

```bash
git push origin main
```

### [ ] 0.2 — Verify admin vite config has base path

```bash
grep "base" apps/admin/vite.config.js
```

Expected output: `base: '/admin/',`

If missing, add it:
```js
export default defineConfig({
  plugins: [react()],
  base: '/admin/',    // ← REQUIRED
  ...
});
```

Then commit and push:
```bash
git add apps/admin/vite.config.js
git commit -m "fix: add base path for admin deployment"
git push origin main
```

### [ ] 0.3 — Run sanity check

```bash
node scripts/sanity-check.js
```

Or ask the AI assistant: **"Run sanity check"**

Fix any failures before proceeding.

---

## Step 1: Create Fresh Droplet

1. Go to [DigitalOcean](https://cloud.digitalocean.com) → Create Droplet
2. **Image:** Ubuntu 24.04 LTS
3. **Size:** $12/mo (2 GB RAM / 2 vCPU / 50 GB SSD) — *do NOT go lower for production*
4. **Region:** Bangalore (BLR1) or Mumbai — nearest to your users
5. **Authentication:** SSH key (recommended) or password
6. **Hostname:** `ravivarvichar-production`
7. Click **Create Droplet**

Once created, note the **IP address**.

---

## Step 2: Install System Dependencies

SSH into the server:
```bash
ssh root@<production-ip>   # Replace with your new droplet's IP
```

### 2.1 — System updates + all dependencies (one block)

```bash
apt update && apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org

# Nginx + Git + Apache2-utils (for maintenance mode)
apt install -y nginx git apache2-utils

# PM2 (Node.js process manager)
npm install -g pm2
```

### 2.2 — Add swap space (REQUIRED for builds)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -m   # Verify: should show ~2048MB swap
```

### 2.3 — Start MongoDB

```bash
systemctl start mongod
systemctl enable mongod
```

### 2.4 — Verify installations

```bash
node -v    # Should be v20.x
npm -v     # Should be 10.x
mongosh --eval "db.version()"  # Should show 7.x
nginx -v   # Should show nginx version
pm2 --version
```

---

## Step 3: Clone & Configure

### 3.1 — Clone repository

```bash
cd /var
mkdir -p www && cd www
git clone https://github.com/SarthakVaishampayan/RavivarVichar.git
cd RavivarVichar
```

### 3.2 — Install dependencies

> **Fresh clone on Linux** — no platform mismatch issues here.

```bash
npm install
```

### 3.3 — Create .env file

Generate JWT secrets first:
```bash
ACCESS=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
REFRESH=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

Then create `.env`:
```bash
cat > apps/server/.env << ENVEOF
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=$ACCESS
JWT_REFRESH_SECRET=$REFRESH
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
# Optional: Cloudinary (leave empty for local storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ENVEOF
```

Create uploads directory:
```bash
mkdir -p apps/server/uploads
```

### 3.4 — Seed initial data

```bash
npm run seed -w apps/server
```

Default admin credentials:
- **Email:** admin@ravivarvichar.org
- **Password:** Admin@123

> ⚠️ **Change the admin password after first login.**

---

## Step 4: Deploy (Use the Script)

Instead of doing everything manually, use the deploy script:

```bash
cd /var/www/RavivarVichar
bash scripts/deploy.sh
```

The script will automatically:
1. ✅ Run sanity checks (API health, frontend builds, project structure)
2. ✅ Build both frontends (`NODE_OPTIONS` already configured)
3. ✅ Start the server with PM2
4. ✅ Verify API health after restart
5. ✅ **Roll back if anything fails**

### Manual Build (if needed)

```bash
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
```

### Manual PM2 Setup

```bash
pm2 start apps/server/src/server.js --name ravivarvichar-api
pm2 save
pm2 startup  # Follow instructions
```

### Verify API

```bash
curl http://localhost:5000/api/v1/health
# Expected: {"success":true,"message":"RavivarVichar API is running",...}
```

---

## Step 5: Configure Nginx

### 5.1 — Create Nginx config

```bash
nano /etc/nginx/sites-available/ravivarvichar
```

Paste this config:

```nginx
server {
    listen 80;
    server_name _;   # Replace with your domain or IP

    # ─── Client Website ───
    root /var/www/RavivarVichar/apps/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # ─── Admin Panel ───
    location /admin {
        alias /var/www/RavivarVichar/apps/admin/dist;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    # ─── API Proxy ───
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

    # ─── Uploads ───
    location /uploads/ {
        alias /var/www/RavivarVichar/apps/server/uploads/;
    }
}
```

### 5.2 — Enable site and restart

```bash
rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/ravivarvichar /etc/nginx/sites-enabled/
nginx -t  # Test config — must say "syntax is ok"
systemctl restart nginx
```

---

## Step 6: Set Up Maintenance Mode

> ⚠️ Do this AFTER Nginx is configured and the site is running.

```bash
cd /var/www/RavivarVichar
MAINTENANCE_PASS=your-secret-password bash scripts/maintenance-on.sh
```

### How to use it for deployments:

```bash
cd /var/www/RavivarVichar

# Enable maintenance
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh

# Deploy updates
bash scripts/deploy.sh

# Test via preview (browser): open https://yourdomain.com/_rv_preview
# Enter: admin / secret → get bypass cookie → test everything

# Fix bugs → git push → deploy.sh again (maintenance stays ON)

# Take live when satisfied
bash scripts/maintenance-off.sh
```

### Quick reference:

| Command | What it does |
|---------|-------------|
| `MAINTENANCE_PASS=X bash scripts/maintenance-on.sh` | Enable with password X |
| `MAINTENANCE_PASS=X bash scripts/maintenance-on.sh` | Change password to X |
| `bash scripts/maintenance-off.sh` | Disable (no password needed) |

---

## Step 7: DNS & SSL

### 7.1 — Point DNS

| Type | Name | Value |
|------|------|-------|
| A | `@` | `<production-ip>` |
| A | `www` | `<production-ip>` |
| A | `admin` | `<production-ip>` |

### 7.2 — Update .env with real domains

```bash
nano apps/server/.env
```

Update:
```env
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

Restart server:
```bash
pm2 restart ravivarvichar-api
```

### 7.3 — Enable HTTPS

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
certbot renew --dry-run  # Verify auto-renewal
```

---

## Step 8: Final Verification

### 8.1 — Check all URLs

| URL | Expected |
|-----|----------|
| `https://yourdomain.com` | Client website loads with full content |
| `https://admin.yourdomain.com` | Admin login page loads |
| `https://yourdomain.com/api/v1/health` | `{"success":true,...}` |

### 8.2 — Login to admin

- URL: `https://admin.yourdomain.com`
- Email: `admin@ravivarvichar.org`
- Password: `Admin@123`

### 8.3 — Test core flows

- [ ] Create an article → publish → verify on client site
- [ ] Upload an image → verify it displays
- [ ] Submit contact form → verify it shows in admin
- [ ] Check analytics page loads
- [ ] Test mobile responsive (resize browser or use DevTools)

### 8.4 — Tell the AI to update reference

```bash
# After successful deploy, tell the AI:
# "Update deployment reference"
```

---

## Production-Specific Config

### Recommended Droplet Specs

| Environment | RAM | vCPU | Storage | Monthly Cost |
|-------------|-----|------|---------|-------------|
| 🧪 Staging (current) | 1 GB | 1 | 25 GB | $6 |
| 🚀 Production (target) | **2 GB** | **2** | **50 GB** | **$12** |

> **Why 2GB for production?** 1GB barely handles builds even with swap. For a live site with concurrent users, MongoDB queries, and image uploads, 2GB is the minimum.

### Performance Tuning

```bash
# Increase Node.js memory limit (add to .env or PM2 config)
NODE_OPTIONS="--max-old-space-size=1024"

# Nginx: enable gzip compression
nano /etc/nginx/nginx.conf
# Add or uncomment:
# gzip on;
# gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
# gzip_min_length 256;
```

### Security

```bash
# UFW firewall (only if not using DigitalOcean firewall)
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Fail2ban (protect against brute force)
apt install -y fail2ban
systemctl enable fail2ban
```

---

## Post-Deploy: Backups & Monitoring

### MongoDB Backup (Cron)

```bash
# Create backup script
cat > /root/backup-mongo.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups/mongodb"
mkdir -p "$BACKUP_DIR"
mongodump --db ravivarvichar --out "$BACKUP_DIR/$(date +%Y-%m-%d)"
gzip -r "$BACKUP_DIR/$(date +%Y-%m-%d)"
# Keep only last 7 days
find "$BACKUP_DIR" -maxdepth 1 -mtime +7 -exec rm -rf {} \;
EOF

chmod +x /root/backup-mongo.sh

# Add to crontab (runs daily at 3 AM)
echo "0 3 * * * /root/backup-mongo.sh" >> /var/spool/cron/crontabs/root
```

### Image Uploads Backup

```bash
# Rsync uploads to backup location
0 4 * * * rsync -a /var/www/RavivarVichar/apps/server/uploads/ /root/backups/uploads/
```

### Monitoring

```bash
# Install htop for live monitoring
apt install -y htop

# PM2 monitoring in browser
pm2 plus  # Optional: PM2's free monitoring dashboard
```

---

## Quick Reference

### Update Cycle

```bash
# LOCAL:
git push origin main

# SERVER:
ssh root@<production-ip>   # Replace with your new droplet's IP
cd /var/www/RavivarVichar
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh
bash scripts/deploy.sh
# Test via /_rv_preview
bash scripts/maintenance-off.sh
```

### Common Commands

```bash
pm2 logs ravivarvichar-api           # View logs
pm2 restart ravivarvichar-api        # Restart
nginx -t                             # Test Nginx config
systemctl reload nginx               # Reload Nginx
systemctl status mongod              # MongoDB status
free -m                              # Memory usage
df -h                                # Disk space
```

### If Something Goes Wrong

```bash
# Rollback manually
git reset --hard <last-good-commit>
pm2 restart ravivarvichar-api

# Or use the deploy script's rollback (runs automatically on failure)

# Emergency: take site down (maintenance without password)
bash scripts/maintenance-off.sh  # This disables it, not enables
# To force enable without knowing password, use any password:
MAINTENANCE_PASS=anything bash scripts/maintenance-on.sh
```

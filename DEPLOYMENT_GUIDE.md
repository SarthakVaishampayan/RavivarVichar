# RavivarVichar CMS — Deployment Guide

> **One-stop guide**: server setup, deployment workflow, maintenance, and daily management.
>
> For **API routes, data schemas, and sanity checks**, see [`DEPLOYMENT_REFERENCE.md`](./DEPLOYMENT_REFERENCE.md).  
> For a **quick reference** during daily operations, jump to [Quick Commands](#quick-commands).

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. Prerequisites (Fresh Server)](#2-prerequisites-fresh-server)
- [3. Step-by-Step Deployment](#3-step-by-step-deployment)
- [4. Maintenance Mode Workflow](#4-maintenance-mode-workflow)
- [5. Daily Operations](#5-daily-operations)
- [6. Troubleshooting](#6-troubleshooting)
- [7. Quick Commands](#7-quick-commands)

---

## 1. Overview

**Stack**: Node.js (Express) + React (Vite) + MongoDB  
**Server**: Ubuntu 24.04 LTS  
**Min Spec**: $6/mo (1 GB RAM, 1 vCPU, 25 GB SSD)  
**Recommended**: $12/mo (2 GB RAM) for production  

### Architecture

```
Internet → Nginx (port 80/443)
            ├── yourdomain.com     → apps/client/dist (public website)
            ├── admin.yourdomain.com → apps/admin/dist (admin dashboard)
            └── /api/*             → proxy_pass http://localhost:5000 (Express API)
```

---

## 2. Prerequisites (Fresh Server)

### 2.1 Install System Dependencies

```bash
apt update && apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org

# Nginx + Git + Utilities
apt install -y nginx git apache2-utils

# PM2 (Node.js process manager)
npm install -g pm2
```

Start MongoDB and enable auto-start:
```bash
systemctl start mongod
systemctl enable mongod
```

### 2.2 Add Swap Space (REQUIRED for 1GB RAM Droplets)

Without this, the frontend build will crash with "Killed" error due to out of memory.

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -m   # Verify: should show ~2048MB swap
```

### 2.3 Clone Repository

```bash
cd /var
mkdir -p www && cd www
git clone https://github.com/SarthakVaishampayan/RavivarVichar.git
cd RavivarVichar
```

### 2.4 Create .env File

```bash
cat > apps/server/.env << 'ENVEOF'
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=your-64-char-random-hex-here
JWT_REFRESH_SECRET=your-64-char-random-hex-here
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ENVEOF
```

Generate strong secrets:
```bash
ACCESS=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
REFRESH=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
sed -i "s/JWT_ACCESS_SECRET=.*/JWT_ACCESS_SECRET=$ACCESS/" apps/server/.env
sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$REFRESH/" apps/server/.env
```

Create uploads directory:
```bash
mkdir -p apps/server/uploads
```

---

## 3. Step-by-Step Deployment

### ⚠️ Critical: Fix Admin Vite Config

Before the first deploy, ensure `base: '/admin/'` is set in `apps/admin/vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/admin/',    // ← REQUIRED for deployment or admin will show white screen
  ...
});
```

### Step 1 — Install Dependencies

> If copying repo from Windows, delete platform-specific files first:
> ```bash
> rm -rf node_modules package-lock.json
> ```

```bash
npm install
```

### Step 2 — Build Frontends

```bash
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
```

### Step 3 — Seed Initial Data (Optional)

```bash
npm run seed -w apps/server
```

Default admin credentials (from seed):
- **Email**: admin@ravivarvichar.org
- **Password**: Admin@123

### Step 4 — Start Server with PM2

```bash
pm2 start apps/server/src/server.js --name ravivarvichar-api
pm2 save
pm2 startup  # Follow the instructions it gives you for auto-start on reboot
```

Verify:
```bash
curl http://localhost:5000/api/v1/health
# Expected: {"success":true,"message":"RavivarVichar API is running",...}
```

### Step 5 — Configure Nginx

Create `/etc/nginx/sites-available/ravivarvichar`:

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

Enable and restart Nginx:
```bash
rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/ravivarvichar /etc/nginx/sites-enabled/
nginx -t  # Test config
systemctl restart nginx
```

### Step 6 — Set Up DNS

| Type | Name | Value |
|------|------|-------|
| A | `@` | `<your-droplet-ip>` |
| A | `www` | `<your-droplet-ip>` |
| A | `admin` | `<your-droplet-ip>` |

Update `.env` with real domains, then restart:
```bash
pm2 restart ravivarvichar-api
```

### Step 7 — Enable HTTPS (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com
certbot renew --dry-run  # Verify auto-renewal
```

### Step 8 — Final Verification

| URL | Expected |
|-----|----------|
| `https://yourdomain.com` | Client website loads |
| `https://admin.yourdomain.com` | Admin login page loads |
| `https://yourdomain.com/api/v1/health` | `{"success":true,...}` |

---

## 4. Maintenance Mode Workflow

> Use maintenance mode when deploying updates so visitors see a clean "under maintenance" page instead of broken layout mid-build.

### How It Works

| URL | Behavior |
|-----|----------|
| `https://yourdomain.com/` | → Maintenance page (visitors) |
| `https://yourdomain.com/_rv_preview` | → Login dialog → enter `admin` / your password → gets bypass cookie |
| `https://yourdomain.com/?rv=YOUR_PASS` | → One-step: cookie set + redirect to home |
| `https://admin.yourdomain.com` | → Works normally (not blocked) |
| `curl https://domain.com/api/v1/...` | → Returns real data (API not blocked) |

### Standard Deploy Cycle

```bash
cd /var/www/RavivarVichar

# 1. Enable maintenance
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh

# 2. Deploy new code
bash scripts/deploy.sh

# 3. Test via preview (open in browser)
#    Visit https://yourdomain.com/_rv_preview → login → test everything

# 4. Found a bug? Fix → git push → run deploy.sh again
#    (maintenance stays ON the whole time — no toggling)

# 5. Satisfied? Take site live
bash scripts/maintenance-off.sh
```

### Maintenance Helpers

```bash
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh    # Enable
MAINTENANCE_PASS=newpass bash scripts/maintenance-on.sh   # Change password
bash scripts/maintenance-off.sh                           # Disable (no password needed)
```

### Deploy Script Auto-Rollback

The `bash scripts/deploy.sh` script automatically:
1. Saves current git commit + backs up old frontend builds
2. Pulls latest code
3. Reinstalls dependencies (handles platform mismatch)
4. Runs sanity checks
5. Builds frontends
6. Restarts PM2 server
7. **Rolls back everything if ANY step fails** (restores old git commit, old builds, old server)

---

## 5. Daily Operations

### PM2 (Process Manager)

```bash
pm2 status                              # List all processes
pm2 logs ravivarvichar-api              # Real-time logs
pm2 logs ravivarvichar-api --lines 100  # Last 100 lines
pm2 restart ravivarvichar-api           # Restart
pm2 stop ravivarvichar-api              # Stop
pm2 start apps/server/src/server.js --name ravivarvichar-api  # Start fresh
pm2 save                                # Save process list for reboot
pm2 startup                             # Generate systemd service (run once)
```

### MongoDB

```bash
systemctl status mongod                 # Status
systemctl restart mongod                # Restart
systemctl start mongod                  # Start if stopped
journalctl -u mongod -n 50              # Logs

mongosh                                 # Open shell
mongosh ravivarvichar                   # Use the database
show collections                        # List all collections
db.articles.countDocuments()            # Count articles
db.users.find()                         # See all users
```

### Nginx

```bash
nginx -t                                # Test config for syntax errors
systemctl reload nginx                  # Reload config (no downtime)
systemctl restart nginx                 # Full restart
systemctl status nginx                  # Status
```

### SSL (Let's Encrypt)

```bash
certbot renew --dry-run                 # Test auto-renewal
# Note: Auto-renewal is automatic (systemd timer), no action needed
```

### Update Cycle (Standard)

```bash
# LOCAL machine:
git push origin main

# SERVER:
ssh root@<your-droplet-ip>
cd /var/www/RavivarVichar
bash scripts/deploy.sh                  # Auto: pull → install → sanity → build → restart
```

### Project Structure (on Server)

```
/var/www/RavivarVichar/
├── apps/
│   ├── client/dist/       ← Built client website (served by Nginx)
│   ├── admin/dist/         ← Built admin panel (served by Nginx)
│   └── server/
│       ├── src/server.js   ← Express server (managed by PM2)
│       ├── uploads/        ← Uploaded images/files
│       └── .env            ← Environment variables
├── scripts/
│   ├── sanity-check.js     ← Pre-commit verification
│   ├── deploy.sh           ← Deploy with auto-rollback
│   ├── maintenance-on.sh   ← Enable maintenance mode
│   └── maintenance-off.sh  ← Disable maintenance mode
├── DEPLOYMENT_GUIDE.md     ← ← YOU ARE HERE
├── DEPLOYMENT_REFERENCE.md ← Schema/API reference (for sanity checks)
└── OriginalDeploymentGuide.md ← Lessons learned for final production deploy
```

---

## 6. Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| 502 Bad Gateway | Node server down | `pm2 restart ravivarvichar-api` |
| White screen on admin | Missing `base: '/admin/'` in vite.config.js | Add it and rebuild |
| Build gets "Killed" | Out of memory (1GB droplet) | Add swap space or use `NODE_OPTIONS="--max-old-space-size=512"` |
| Cannot find module (rollup-linux) | node_modules from Windows | `rm -rf node_modules package-lock.json && npm install` |
| API returns HTML | Nginx not proxying correctly | Check `location /api/` block in nginx config |
| MongoDB error | MongoDB not running | `systemctl start mongod` |
| `git pull` fails on `package-lock.json` | File wasn't tracked in old commit but is in new commit | `rm package-lock.json && git pull` |
| Can't SSH | Firewall / SSH key issue | Check DigitalOcean console for access |
| Out of disk space | Build artifacts piling up | `df -h`, check `/tmp/ravivarvichar-rollback` |

---

## 7. Quick Commands

### Deploy & Maintenance
```bash
bash scripts/deploy.sh                                    # Standard deploy
bash scripts/deploy.sh --force                            # Skip sanity checks
bash scripts/deploy.sh --dry-run                          # Preview only
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh    # Enable maintenance
MAINTENANCE_PASS=newpass bash scripts/maintenance-on.sh   # Change password
bash scripts/maintenance-off.sh                           # Disable maintenance
```

### Process & Server
```bash
pm2 logs ravivarvichar-api           # View live logs
pm2 restart ravivarvichar-api        # Restart server
pm2 status                           # List all processes
pm2 startup                          # Auto-start on reboot
```

### Nginx
```bash
nginx -t                             # Test config
systemctl restart nginx              # Restart Nginx
systemctl reload nginx               # Reload config
```

### MongoDB
```bash
systemctl status mongod              # Check MongoDB status
mongosh                              # Open MongoDB shell
```

### System
```bash
free -m                              # Memory usage
df -h                                # Disk space
htop                                 # Live monitoring (install: apt install htop)
journalctl -u nginx -n 30            # Nginx logs
journalctl -u mongod -n 30           # MongoDB logs
```

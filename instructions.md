# RavivarVichar CMS — Droplet Instructions

> Quick reference for managing the DigitalOcean droplet. All commands assume you're SSH'd into the server unless marked **[LOCAL]**.

---

## 📡 SSH Access

```bash
# Connect to the droplet
ssh root@142.93.213.69
```

---

## 🚀 Deployment

### Deploy Latest Code (on the droplet)

```bash
# Standard deploy — runs sanity checks first, auto-rollbacks on failure
cd /var/www/ravivarvichar-cms
bash scripts/deploy.sh

# Skip sanity checks (emergency deploy)
bash scripts/deploy.sh --force

# Preview what would happen
bash scripts/deploy.sh --dry-run
```

### What deploy.sh does:

| Step | Action | Safe to interrupt? |
|------|--------|-------------------|
| 0 | Verifies project directory exists | ✅ |
| 1 | Saves current git commit hash + backs up old frontend builds | ✅ |
| 2 | Pulls latest code from `main` | ⚠️ Before pull completes |
| 3 | Installs npm dependencies | ⚠️ |
| 4 | Runs `node scripts/sanity-check.js` | ✅ |
| 5 | Builds client + admin frontends | ⚠️ |
| 6 | Restarts PM2 server process | ⚠️ During restart |
| 7 | Cleans up rollback backup | ✅ |
| 8 | Verifies API health | ✅ |

### Auto-Rollback

If **any** step fails after new code has been pulled, `deploy.sh` automatically:

1. `git reset --hard` to the previous commit
2. Restores old `dist/` directories from backup
3. Restarts PM2 with the old server code
4. Cleans up the backup

You'll see:
```
╔══════════════════════════════════════════╗
║        ROLLBACK IN PROGRESS              ║
╚══════════════════════════════════════════╝
╔══════════════════════════════════════════╗
║     Rollback Complete — Droplet Restored ║
╚══════════════════════════════════════════╝
```

### Manual Rollback (if needed)

```bash
git log --oneline -5                           # See recent commits
git reset --hard <commit-hash>                 # Go back to a specific commit
npm install                                    # Reinstall deps for that version
npm run build -w apps/client                   # Rebuild client
npm run build -w apps/admin                    # Rebuild admin
pm2 restart ravivarvichar-api                  # Restart server
```

---

## ✅ Sanity Check

> Run **[LOCAL]** before every commit to verify nothing is broken.

```bash
# Full check (includes frontend builds)
node scripts/sanity-check.js

# Quick check (skip builds)
node scripts/sanity-check.js --skip-build

# Custom server URL
node scripts/sanity-check.js --server=http://localhost:5000
```

### What it checks (6 sections):

| # | Section | What it verifies |
|---|---------|------------------|
| 1 | Server Health | API is running at `/api/v1/health` |
| 2 | Public GET Endpoints | 13 routes respond with HTTP 200 and `success: true` |
| 3 | Single Item Endpoints | Article by ID, article by slug, program by slug, event by ID |
| 4 | Frontend Builds | Both client and admin build without errors |
| 5 | Project Structure | All critical files exist |
| 6 | Environment Check | Required env vars are set |

### Exit codes:

- **0** → All clear, safe to commit
- **1** → Issues found, review the output

> **Note:** The sanity check only reads data. It does NOT:
> - Create any test data in the database
> - Submit any contact forms or newsletter subscriptions
> - Attempt to log in or require authentication
> - Modify any files

---

## ⚙️ Server Management (PM2)

```bash
# Status
pm2 status                              # List all processes

# Logs
pm2 logs ravivarvichar-api              # Real-time logs
pm2 logs ravivarvichar-api --lines 100  # Last 100 lines

# Lifecycle
pm2 restart ravivarvichar-api           # Restart
pm2 stop ravivarvichar-api              # Stop
pm2 start apps/server/src/server.js --name ravivarvichar-api  # Start fresh

# Persistence
pm2 save                                # Save process list for reboot
pm2 startup                             # Generate systemd service (run once)
```

---

## 🗄️ MongoDB

```bash
# Service
systemctl status mongod                 # Status
systemctl restart mongod                # Restart
systemctl stop mongod                   # Stop
systemctl start mongod                  # Start
journalctl -u mongod -n 50              # Logs

# Shell
mongosh                                 # Open shell
mongosh ravivarvichar                   # Use the database
show collections                        # List all collections
db.articles.countDocuments()            # Count articles
db.articles.find().limit(5)             # See 5 articles
db.users.find()                         # See all users

# Seed data (run once)
cd /var/www/ravivarvichar-cms
npm run seed -w apps/server

# Default admin credentials (after seeding):
#   Email:    admin@ravivarvichar.org
#   Password: Admin@123
```

---

## 🌐 Nginx (Web Server)

```bash
nginx -t                                # Test config for syntax errors
systemctl reload nginx                  # Reload config (no downtime)
systemctl restart nginx                 # Full restart
systemctl status nginx                  # Status
```

### Config file location:
```
/etc/nginx/sites-available/ravivarvichar
/etc/nginx/sites-enabled/ravivarvichar  (symlink)
```

### Architecture:
```
Internet → Nginx (port 80/443)
            ├── yourdomain.com     → /var/www/ravivarvichar-cms/apps/client/dist
            ├── admin.yourdomain.com → /var/www/ravivarvichar-cms/apps/admin/dist
            └── /api/*             → proxy_pass http://localhost:5000
```

---

## 🔐 SSL (Let's Encrypt)

```bash
# Request or renew
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com

# Test auto-renewal
certbot renew --dry-run

# Auto-renewal is automatic (systemd timer), no action needed
```

---

## 📁 Project Structure (on droplet)

```
/var/www/ravivarvichar-cms/
├── apps/
│   ├── client/dist/       ← Built client website (served by Nginx)
│   ├── admin/dist/         ← Built admin panel (served by Nginx)
│   └── server/
│       ├── src/server.js   ← Express server (managed by PM2)
│       ├── uploads/        ← Uploaded images/files
│       └── .env            ← Environment variables (PORT, MONGO_URI, JWT secrets, etc.)
├── scripts/
│   ├── sanity-check.js     ← Pre-commit verification
│   └── deploy.sh           ← Deploy with auto-rollback
├── deployment.md           ← Full deployment guide
└── instructions.md         ← ← YOU ARE HERE
```

---

## 🔄 Update Cycle (Standard Workflow)

```
[LOCAL]  1. Make code changes
[LOCAL]  2. node scripts/sanity-check.js   (verify nothing broke)
[LOCAL]  3. git add . && git commit -m "..."
[LOCAL]  4. git push

[DROPLET] 5. ssh root@142.93.213.69
[DROPLET] 6. cd /var/www/ravivarvichar-cms
[DROPLET] 7. bash scripts/deploy.sh         (auto: pull → sanity → build → restart)
```

---

## 📊 Monitoring & Troubleshooting

### Quick health check:
```bash
curl http://localhost:5000/api/v1/health
# Expected: {"success":true,"message":"RavivarVichar API is running",...}
```

### Common issues:

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| 502 Bad Gateway | Node server down | `pm2 restart ravivarvichar-api` |
| Cannot GET /article/xyz | SPA routing broken | Check Nginx `try_files $uri $uri/ /index.html;` |
| MongoDB connection failed | MongoDB not running | `systemctl start mongod` |
| Uploaded images 404 | Uploads path mismatch | Check Nginx `alias` path vs server path |
| Let's Encrypt expiry | Port 80 blocked | Check firewall: `ufw status` |
| Out of disk space | Build artifacts | `df -h`, check `/tmp/ravivarvichar-rollback` |

### Useful system commands:
```bash
df -h                          # Disk space
free -m                        # Memory usage
htop                           # Live monitoring (install: apt install htop)
journalctl -u nginx -n 30      # Nginx logs
journalctl -u mongod -n 30     # MongoDB logs
```

---

## 🛠️ One-time Setup Recap

If setting up a fresh droplet, follow the full guide in `deployment.md`. Quick summary:

```bash
apt update && apt upgrade -y
apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
# Install MongoDB 7.0 (see deployment.md for repo setup)
# Install PM2: npm install -g pm2
```

---

## 📝 Environment Variables (.env)

Location: `apps/server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API server port | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ravivarvichar` |
| `JWT_ACCESS_SECRET` | JWT access token secret | (64-char random hex) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | (64-char random hex) |
| `CLIENT_URL` | Client domain for CORS | `https://yourdomain.com` |
| `ADMIN_URL` | Admin domain for CORS | `https://admin.yourdomain.com` |
| `CLOUDINARY_*` | Optional — image hosting | (Cloudinary credentials) |

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

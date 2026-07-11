# RavivarVichar CMS — DigitalOcean Deployment Guide

## Overview

Deploy the full stack (API + Client frontend + Admin frontend + MongoDB) on a single DigitalOcean Droplet.

**Stack**: Node.js (Express) + React (Vite) + MongoDB  
**Droplet size**: $6/month (s-1vcpu-1gb) — enough for staging/dev. Upgrade to $12 for production.  
**Recommended region**: Bangalore (India) or nearest to your client.

---

## Step 1: Create the Droplet

1. Go to [DigitalOcean](https://cloud.digitalocean.com) and create a Droplet
2. **Choose image**: Ubuntu 24.04 LTS
3. **Size**: Basic → $6/month (1 GB / 1 vCPU / 25 GB SSD)
4. **Region**: Bangalore (BLR1) or Mumbai
5. **Authentication**: SSH key (recommended) or password
6. **Hostname**: `ravivarvichar`
7. Click **Create Droplet**

Once created, note the **IP address**. You'll use it to SSH in.

---

## Step 2: SSH into the Droplet

```bash
ssh root@<your-droplet-ip>
```

---

## Step 3: Install Dependencies

Run these commands on the droplet:

```bash
# Update packages
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install Nginx
apt install -y nginx

# Install PM2 (process manager for Node.js)
npm install -g pm2

# Install Git
apt install -y git
```

Verify installations:
```bash
node -v    # Should be v20.x
npm -v     # Should be 10.x
mongosh --eval "db.version()"  # Should show 7.x
nginx -v   # Should show nginx version
```

---

## Step 4: Add swap space (REQUIRED for 1GB droplets)

Without this, the frontend build will crash with "Killed" error due to out of memory.

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Verify
free -m   # Should show ~2048MB swap
```

---

## Step 5: Clone the Repository

```bash
cd /var
mkdir -p www && cd www
git clone https://github.com/SarthakVaishampayan/RavivarVichar.git
cd RavivarVichar
```

---

## Step 6: Create .env File

```bash
cat > apps/server/.env << 'ENVEOF'
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=your-64-char-random-hex-here
JWT_REFRESH_SECRET=your-64-char-random-hex-here
CLIENT_URL=http://your-droplet-ip
ADMIN_URL=http://your-droplet-ip
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

Create the uploads directory:
```bash
mkdir -p apps/server/uploads
```

---

## Step 7: Install Dependencies

> ⚠️ **IMPORTANT**: If you copied the repo from a Windows machine, delete node_modules first!
> ```bash
> rm -rf node_modules package-lock.json
> ```

```bash
npm install
```

---

## Step 8: Build the Frontends

```bash
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
```

---

## Step 9: Seed Initial Data (Optional)

If you want sample data (admin user, articles, etc.):

```bash
npm run seed -w apps/server
```

Default admin credentials (from seed file):
- **Email**: admin@ravivarvichar.com
- **Password**: Sarthak@2003

---

## Step 10: Start the Server with PM2

```bash
pm2 start apps/server/src/server.js --name ravivarvichar-api
pm2 save
pm2 startup  # Follow the instructions it gives you
```

Verify:
```bash
curl http://localhost:5000/api/v1/health
# Should return: { "success": true, "message": "RavivarVichar API is running", ... }
```

---

## Step 11: Configure Nginx

```bash
nano /etc/nginx/sites-available/ravivarvichar
```

Paste this config (replace `your-droplet-ip` with your actual IP):

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

Enable the site and restart Nginx:

```bash
rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/ravivarvichar /etc/nginx/sites-enabled/
nginx -t  # Test config
systemctl restart nginx
```

---

## Step 12: Set Up Maintenance Mode (Optional)

> ⚠️ **Do this AFTER Nginx is configured and the site is running**

To set up maintenance mode so you can preview changes privately before going live:

### 12a. Install `apache2-utils` (for `htpasswd`)
```bash
apt install -y apache2-utils
```

### 12b. Enable maintenance mode
```bash
cd /var/www/RavivarVichar
MAINTENANCE_PASS=your-secret-password bash scripts/maintenance-on.sh
```

### How it works

The maintenance mode uses a **cookie-based bypass** (not Basic Auth on the root URL). This avoids browser URL-stripping issues:

| URL | What happens |
|-----|-------------|
| `http://yourdomain.com/` | Public → sees maintenance page (no login dialog) |
| `http://yourdomain.com/_rv_preview` | Login dialog → enter `admin` / your password → gets cookie |
| Then `http://yourdomain.com/` | Cookie active → client site loads (2-hour session) |
| `http://yourdomain.com/?rv=YOUR_PASS` | One-step: cookie set + redirected to `/` |
| `http://yourdomain.com/admin` | Admin login works normally (no maintenance block) |
| `curl http://domain.com/api/v1/...` | API returns real data (not blocked) |

### Turn off maintenance
```bash
cd /var/www/RavivarVichar
bash scripts/maintenance-off.sh
```

### Change password
```bash
MAINTENANCE_PASS=new-password bash scripts/maintenance-on.sh
```

> **Tip:** No password is needed to turn maintenance OFF — only to turn it ON.

---

## Step 13: Set Up Domains (DNS)

In your domain registrar (e.g., GoDaddy, Namecheap), point these A records to your droplet IP:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `<your-droplet-ip>` |
| A | `www` | `<your-droplet-ip>` |
| A | `admin` | `<your-droplet-ip>` |

---

## Step 14: Enable HTTPS with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx

# Get SSL for both domains
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com

# Auto-renewal is set up automatically, verify:
certbot renew --dry-run
```

---

## Step 15: Verify Everything

| URL | Expected |
|-----|----------|
| `http://your-droplet-ip` | Client website loads |
| `http://your-droplet-ip/admin` | Admin login page loads |
| `http://your-droplet-ip/api/v1/health` | `{"success":true,...}` |

Login with: admin@ravivarvichar.com / Sarthak@2003

---

## Updating the Site (Future Deploys)

### Recommended workflow with maintenance mode:

Deploying updates while the site is live can cause visual glitches (broken CSS, missing assets, etc.) if visitors load the page mid-build. Use maintenance mode to show visitors a clean "under maintenance" page while you update.

```bash
cd /var/www/RavivarVichar

# 1. Enable maintenance mode (visitors see maintenance page)
MAINTENANCE_PASS=standbymode bash scripts/maintenance-on.sh

# 2. Deploy latest code
bash scripts/deploy.sh

# 3. (Optional) Test the site with your bypass cookie
#    Visit http://yourdomain.com/?rv=standbymode in your browser
#    to get the bypass cookie and verify everything works

# 4. Take the site live again
bash scripts/maintenance-off.sh
```

### One-command deploy (without maintenance):
```bash
cd /var/www/RavivarVichar
bash scripts/deploy.sh
```

The script **automatically**:
- Pulls latest code (stashes any local changes first)
- Checks platform compatibility of node_modules
- Builds frontends
- Restarts the server
- Rolls back everything if any step fails

### Manual update (without maintenance):
```bash
cd /var/www/RavivarVichar
git pull origin main
npm install
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
pm2 restart ravivarvichar-api
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| White screen on admin | Missing `base: '/admin/'` in vite.config.js | Push the fix and redeploy |
| Build gets "Killed" | Out of memory (1GB droplet) | Add swap space: see Step 4 |
| 502 Bad Gateway | Node server not running | `pm2 restart ravivarvichar-api` |
| Cannot find module (rollup-linux) | node_modules from Windows | `rm -rf node_modules package-lock.json && npm install` |
| API returns HTML | Nginx not proxying correctly | Check `location /api/` block in nginx config |
| MongoDB error | MongoDB not running | `systemctl start mongod` |

---

## Useful Commands

```bash
# Server management
pm2 status                    # List all processes
pm2 logs ravivarvichar-api    # View logs
pm2 restart ravivarvichar-api # Restart
pm2 stop ravivarvichar-api    # Stop
pm2 startup                   # Auto-start on server reboot

# MongoDB
mongosh                       # Open MongoDB shell
mongosh ravivarvichar         # Use the database
db.articles.find()            # List all articles

# Disk & Memory
df -h                         # Disk space
free -m                       # Memory usage
htop                          # Live monitoring (install: apt install htop)

# Nginx
nginx -t                      # Test config
systemctl reload nginx        # Reload config
systemctl restart nginx       # Restart Nginx
```

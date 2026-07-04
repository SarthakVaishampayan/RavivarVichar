# 🚀 RavivarVichar CMS — Deployment Checklist

> **For fresh deployments on a new DigitalOcean Droplet (or any Ubuntu 24.04 server)**
>
> Use this checklist to deploy from scratch. Tick off each step as you go.

---

## ⚙️ Server Specs

| Item | Recommended | Min |
|------|-------------|-----|
| Droplet Size | $12/mo (2GB RAM) | $6/mo (1GB RAM) |
| OS | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |
| Region | Bangalore/Mumbai | Any |
| Auth | SSH Key | Password OK |

---

## ✅ Pre-Deployment (Local Machine)

### [ ] 1. Push latest code to GitHub
```bash
git push origin main
```

### [ ] 2. Fix `vite.config.js` for admin base path
Edit `apps/admin/vite.config.js` — add `base: '/admin/'`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/admin/',    // ← REQUIRED for deployment
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ...
});
```

> ⚠️ **Do this BEFORE pushing** — or you'll need to manually fix paths after every build.

### [ ] 3. Commit and push the vite.config.js change
```bash
git add apps/admin/vite.config.js
git commit -m "add base path for admin deployment"
git push origin main
```

---

## 🖥️ Server Setup (on the Droplet)

### [ ] 4. SSH into the droplet
```bash
ssh root@<your-droplet-ip>
```

### [ ] 5. Install system dependencies
```bash
apt update && apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# MongoDB 7.0
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org

# Nginx + Git
apt install -y nginx git

# PM2 (Node.js process manager)
npm install -g pm2
```

### [ ] 6. Start MongoDB
```bash
systemctl start mongod
systemctl enable mongod
```

### [ ] 7. Verify installations
```bash
node -v      # Should be v20.x
npm -v       # Should be 10.x
mongosh --eval "db.version()"   # Should show 7.x
nginx -v     # Should show nginx version
pm2 --version
```

---

## 📦 Project Setup

### [ ] 8. Clone the repository
```bash
cd /var
mkdir -p www && cd www
git clone https://github.com/SarthakVaishampayan/RavivarVichar.git
cd RavivarVichar
```

### [ ] 9. Install dependencies (on the Linux server!)
```bash
npm install
```

> ⚠️ **CRITICAL**: Delete `node_modules` and `package-lock.json` if they were copied from Windows.
> ```bash
> rm -rf node_modules package-lock.json && npm install
> ```

### [ ] 10. Create `.env` file
```bash
cat > apps/server/.env << 'ENVEOF'
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=your-64-char-random-hex-here
JWT_REFRESH_SECRET=your-64-char-random-hex-here
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
ENVEOF
```

### [ ] 11. Generate strong JWT secrets
```bash
ACCESS=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
REFRESH=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
sed -i "s/JWT_ACCESS_SECRET=.*/JWT_ACCESS_SECRET=$ACCESS/" apps/server/.env
sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$REFRESH/" apps/server/.env
```

### [ ] 12. Add Cloudinary credentials
```bash
nano apps/server/.env
```
Add these lines:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### [ ] 13. Create uploads directory
```bash
mkdir -p apps/server/uploads
```

### [ ] 14. Update domain URLs in .env
If you have domains:
```
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```
If using IP only temporarily:
```
CLIENT_URL=http://142.93.213.69
ADMIN_URL=http://142.93.213.69
```

---

## 🏗️ Build Frontends

### [ ] 15. Add swap space (for 1GB RAM droplets — prevents OOM kills)
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### [ ] 16. Verify `base: '/admin/'` is in vite.config.js
```bash
grep "base" apps/admin/vite.config.js
```
Should output: `base: '/admin/',`

### [ ] 17. Build both frontends
```bash
# Use limited memory to prevent OOM on 1GB droplets
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
```

---

## 🗄️ Seed Database (Optional)

### [ ] 18. Seed sample data
```bash
npm run seed -w apps/server
```

Default login:
- **Email:** admin@ravivarvichar.org
- **Password:** Admin@123

---

## 🚀 Start Server

### [ ] 19. Start with PM2
```bash
pm2 start apps/server/src/server.js --name ravivarvichar-api
pm2 save
```

### [ ] 20. Verify API
```bash
curl http://localhost:5000/api/v1/health
```
Expected: `{"success":true,"message":"RavivarVichar API is running",...}`

### [ ] 21. Set PM2 to auto-start on reboot
```bash
pm2 startup
```
Copy and run the command it outputs.

---

## 🌐 Configure Nginx

### [ ] 22. Create Nginx config
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

### [ ] 23. Enable site & restart Nginx
```bash
rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/ravivarvichar /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 📡 DNS & SSL (For Production)

### [ ] 24. Point your domain A records
| Type | Name | Value |
|------|------|-------|
| A | `@` | `<your-droplet-ip>` |
| A | `www` | `<your-droplet-ip>` |
| A | `admin` | `<your-droplet-ip>` |

### [ ] 25. Update `.env` with real domains
```bash
nano apps/server/.env
```
Update:
```
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

### [ ] 26. Restart server with new domains
```bash
pm2 restart ravivarvichar-api
```

### [ ] 27. Enable HTTPS with Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com

# Verify auto-renewal
certbot renew --dry-run
```

---

## ✅ Final Verification

### [ ] 28. Check all URLs
| URL | Expected |
|-----|----------|
| `https://yourdomain.com` | Client website loads |
| `https://admin.yourdomain.com` | Admin login page loads |
| `https://yourdomain.com/api/v1/health` | `{"success":true,...}` |

### [ ] 29. Login to admin
- **URL:** `https://admin.yourdomain.com`
- **Email:** admin@ravivarvichar.org
- **Password:** Admin@123

---

## 🔄 Future Updates

### On the server (manual deploy):
```bash
cd /var/www/RavivarVichar
git pull origin main
npm install
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/client
NODE_OPTIONS="--max-old-space-size=512" npm run build -w apps/admin
pm2 restart ravivarvichar-api
```

### Or use the deploy script:
```bash
bash scripts/deploy.sh
```

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| White screen on admin | Missing `base: '/admin/'` in vite.config.js | Add it and rebuild |
| Build gets "Killed" | Out of memory | Add swap space or use `NODE_OPTIONS="--max-old-space-size=512"` |
| 502 Bad Gateway | Node server not running | `pm2 restart ravivarvichar-api` |
| Cannot find module | node_modules from wrong OS | `rm -rf node_modules package-lock.json && npm install` |
| API returns HTML | Nginx not proxying correctly | Check `location /api/` block in nginx config |
| MongoDB error | MongoDB not running | `systemctl start mongod` |

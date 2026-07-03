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

## Step 4: Clone the Repository

```bash
cd /var
mkdir www && cd www
git clone https://github.com/your-username/ravivarvichar-cms.git
cd ravivarvichar-cms

# Install all dependencies (workspaces)
npm install
```

---

## Step 5: Create .env File

Create `/var/www/ravivarvichar-cms/apps/server/.env`:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/ravivarvichar
JWT_ACCESS_SECRET=<generate-a-random-64-char-string>
JWT_REFRESH_SECRET=<generate-another-random-64-char-string>
CLIENT_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com

# Optional — set up later
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the uploads directory:
```bash
mkdir -p /var/www/ravivarvichar-cms/apps/server/uploads
```

---

## Step 6: Build the Frontends

```bash
cd /var/www/ravivarvichar-cms

# Build client
npm run build -w apps/client

# Build admin
npm run build -w apps/admin
```

---

## Step 7: Seed Initial Data (Optional)

If you want sample data (admin user, articles, etc.):

```bash
npm run seed -w apps/server
```

Default admin credentials (from the seed file):
- **Email**: admin@ravivarvichar.org
- **Password**: Admin@123

---

## Step 8: Start the Server with PM2

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

## Step 9: Configure Nginx

Create `/etc/nginx/sites-available/ravivarvichar`:

```nginx
# ─── Client Website (yourdomain.com) ───
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/ravivarvichar-cms/apps/client/dist;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Node.js
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

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/ravivarvichar-cms/apps/server/uploads/;
    }
}

# ─── Admin Panel (admin.yourdomain.com) ───
server {
    listen 80;
    server_name admin.yourdomain.com;

    root /var/www/ravivarvichar-cms/apps/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Node.js
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
        alias /var/www/ravivarvichar-cms/apps/server/uploads/;
    }
}
```

Enable the site and restart Nginx:

```bash
ln -s /etc/nginx/sites-available/ravivarvichar /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t  # Test config
systemctl restart nginx
```

---

## Step 10: Set Up Domains (DNS)

In your domain registrar (e.g., GoDaddy, Namecheap), point these A records to your droplet IP:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `<your-droplet-ip>` |
| A | `www` | `<your-droplet-ip>` |
| A | `admin` | `<your-droplet-ip>` |

---

## Step 11: Enable HTTPS with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx

# Get SSL for both domains
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d admin.yourdomain.com

# Auto-renewal is set up automatically, verify:
certbot renew --dry-run
```

---

## Step 12: Verify Everything

- **Client**: https://yourdomain.com
- **Admin**: https://admin.yourdomain.com
- **API**: https://yourdomain.com/api/v1/health
- **Login with**: admin@ravivarvichar.org / Admin@123

---

## Updating the Site

### Manual update on the server:

```bash
cd /var/www/ravivarvichar-cms
git pull
npm install
npm run build -w apps/client
npm run build -w apps/admin
pm2 restart ravivarvichar-api
```

### Optional: Auto-deploy with GitHub Actions

Create `.github/workflows/deploy.yml` in the repo:

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/ravivarvichar-cms
            git pull
            npm install
            npm run build -w apps/client
            npm run build -w apps/admin
            pm2 restart ravivarvichar-api
```

Then add `DROPLET_IP` and `SSH_PRIVATE_KEY` as secrets in your GitHub repo.

---

## Troubleshooting

### "502 Bad Gateway" from Nginx
- The Node.js server might not be running: `pm2 status`
- Check logs: `pm2 logs ravivarvichar-api`

### "MongoDB connection error"
- Check MongoDB is running: `systemctl status mongod`
- Check MongoDB logs: `journalctl -u mongod -n 50`

### "Cannot GET /" for frontend routes
- The Nginx config needs `try_files $uri $uri/ /index.html;` for SPA routing
- Make sure the dist directories exist

### Uploaded images return 404
- Check the uploads directory exists
- `/uploads/` in the browser must match Nginx's `alias` path

### Port 5000 already in use
- Change `PORT` in `.env` or kill the existing process: `pm2 delete ravivarvichar-api`

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

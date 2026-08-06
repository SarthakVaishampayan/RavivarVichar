# 🚀 RavivarVichar Production Launch — Resume Prompt

> **Session resume point:** Phase 6 in progress — creating the Cloudflare Origin Certificate.
> Paste this file's contents into a new session to continue exactly where we left off.

---

## 📌 The Goal

Deploy RavivarVichar to production at **`https://ravivarvichar.in`** on a new DigitalOcean droplet, fronted by **Cloudflare** (new account), with a Cloudflare **Origin Certificate** (15-year, free). The domain is registered at **GoDaddy**.

**Critical facts:**
- **New droplet IP:** `159.65.153.153` (Ubuntu 24.04, $6/mo = 1 vCPU / 1 GB RAM / 25 GB SSD — same size as old staging, works fine, swap is MANDATORY)
- **Old droplet IP (still live):** `142.93.213.69` — keep running until Phase 8
- **GitHub repo:** `https://github.com/SarthakVaishampayan/RavivarVichar.git` (public, remote name `RavivarVichar`)
- **Cloudflare:** NEW account `Ravivardigest01@gmail.com` — the domain was previously on SOMEONE ELSE's Cloudflare account (nameservers `sasha` + `rene.ns.cloudflare.com`). We are migrating it to the new account.
- **Repo prep work (already committed & pushed as "final" `eb5b8b3f`):** `scripts/maintenance-on.sh` made SSL-aware (443 block + origin cert check, old IP refs removed) and `PRODUCTION_DEPLOY_GUIDE.md` created (full step-by-step guide).

**The master plan (nothing goes live until Phase 8):**
```
PHASE 1-4   Server setup + deploy on droplet → tested via http://159.65.153.153 ✅ DONE
PHASE 5     Cloudflare DNS in NEW account (not live yet)                 ✅ DONE
PHASE 6     Origin Certificate generation                                 ⏳ IN PROGRESS
PHASE 7     Install cert + HTTPS on nginx, hosts-file test                ⬜ REMAINING
PHASE 8     GO LIVE: switch nameservers at GoDaddy to kipp/laila          ⬜ REMAINING
PHASE 9     Post-launch: admin password, Resend email, backups, UFW       ⬜ REMAINING
```

---

## ✅ What's DONE

### Repo prep (committed & pushed, commit `eb5b8b3f` "final")
- `scripts/maintenance-on.sh`: now listens on **443 with the origin cert** (required for Cloudflare Full/strict), fails fast if cert missing (skipped in `--dry-run`), old IP `142.93.213.69` refs replaced with `ravivarvichar.in`
- `PRODUCTION_DEPLOY_GUIDE.md`: full production guide (droplet → server → Cloudflare → origin cert → go-live)
- Code-reviewed; validation `bash -n` passes

### Phase 1 — Droplet ✅
- Created `ravivarvichar-production` in DigitalOcean, region **BLR1**, Ubuntu 24.04 LTS, **$6/mo** (1 GB RAM — user prefers this over the guide's recommended $12; it matches the old working setup)
- **Authentication: Password** (user's preference; old password `ravivar2026Vichar` was shared in chat → user said password will be changed before production)

### Phase 2 — Server dependencies ✅
- Node `v20.20.2`, npm `10.8.2`, MongoDB `7.0.39`, nginx `1.24.0`, PM2 `7.0.3`, apache2-utils installed
- **Swap: 2047 MB active** (`/swapfile`, in fstab) — CRITICAL on 1 GB RAM for builds
- mongod started + enabled
- Had a hiccup: `sshd_config` debconf prompt during apt upgrade was interrupted with ^C; fixed by `dpkg --configure -a` and choosing "keep the local version currently installed". Reboot recommended but server worked fine.

### Phase 3 — App deployed ✅
- Cloned to `/var/www/RavivarVichar`
- `.env` created at `apps/server/.env` with generated secrets (JWT access/refresh 48-byte base64, `IP_HASH_SALT` 32-byte; `CLIENT_URL=https://ravivarvichar.in`, `ADMIN_URL=https://admin.ravivarvichar.in`; Cloudinary empty → local uploads; Resend empty)
- DB seeded (fresh): `npm run seed -w apps/server`
- `bash scripts/deploy.sh` → SUCCESS: client + admin built, PM2 `ravivarvichar-api` online & healthy
- PM2 startup (systemd) configured, `pm2 save` done
- Health: `{"success":true,"message":"RavivarVichar API is running",...}`

### Phase 4 — Nginx HTTP ✅
- Config `/etc/nginx/sites-available/ravivarvichar` (v1, HTTP-only): serves client SPA at `/`, admin at `/admin` (alias), proxies `/api/` → localhost:5000, `/uploads/` alias, `client_max_body_size 50m`
- Enabled, `nginx -t` OK, restarted
- Verified: `curl http://localhost/api/v1/health` returns success JSON
- Site renders at `http://159.65.153.153` ✅ (user confirmed "website loaded")

### Phase 5 — Cloudflare DNS (NEW account) ✅
- Added `ravivarvichar.in` to new Cloudflare account (Free plan) — domain was previously on someone else's CF account
- DNS records cleaned up — **final 7 records**:
  | Type | Name | Value | Proxy |
  |---|---|---|---|
  | A | `@` | `159.65.153.153` | 🟠 Proxied |
  | A | `www` | `159.65.153.153` | 🟠 Proxied |
  | A | `admin` | `159.65.153.153` | 🟠 Proxied |
  | MX | `@` | `smtp.google.com` | DNS only (Google Workspace — DO NOT DELETE) |
  | TXT | `default._domainkey` | DKIM string (keep!) | DNS only |
  | TXT | `@` | `google-site-verification=fQsW...` | DNS only |
  | TXT | `@` | `google-site-verification=9ooA...` | DNS only |
  - Deleted: old A/AAAA proxy records, `_acme-challenge` TXT ×4, `_cf-custom-hostname`
- SSL mode set to **Full (strict)** (verify this was saved!)
- **New nameservers (for Phase 8): `kipp.ns.cloudflare.com` + `laila.ns.cloudflare.com`**
- Zone is **"Pending nameserver update"** — expected; old site still live at ravivarvichar.in
- ⛔ **GoDaddy nameservers NOT changed yet — that's Phase 8**

---

## ⏳ CURRENT STEP — Phase 6: Origin Certificate (IN PROGRESS)

### What happened
- In Cloudflare → SSL/TLS → **Origin Server** → Create Certificate
- Filled: Cloudflare generates key (RSA 2048), hostnames `*.ravivarvichar.in`, `ravivarvichar.in`, `www.ravivarvichar.in`, `admin.ravivarvichar.in`, validity **15 years**
- ❌ **ERROR on Create:** *"Failed to validate requested hostname `*.ravivarvichar.in`: This zone is either not part of your account, or you do not have access to it."*

### The fix (in order)
1. **Remove the wildcard `*.ravivarvichar.in`** (click its `×`) — keep only:
   ```
   ravivarvichar.in
   www.ravivarvichar.in
   admin.ravivarvichar.in
   ```
   → The 3 explicit hostnames fully cover what we need; wildcard was just convenience.
2. Click **Create** again.
3. If still fails: **wait 15–30 min** (Cloudflare backend syncs new zones) and retry.
4. Sanity: logged into the NEW account `Ravivardigest01@gmail.com`, zone `ravivarvichar.in` visible under it.

### When the cert generates — you get TWO blocks:
1. `-----BEGIN CERTIFICATE-----` block → save as `origin-cert.txt` (or paste into `nano /etc/nginx/ssl/ravivarvichar-origin.crt` on the droplet)
2. `-----BEGIN PRIVATE KEY-----` block → `nano /etc/nginx/ssl/ravivarvichar-origin.key`
- 🔒 Private key is shown only once — copy it before closing the page.

### Then install on droplet (Phase 6 Part 2):
```bash
mkdir -p /etc/nginx/ssl
nano /etc/nginx/ssl/ravivarvichar-origin.crt   # paste CERTIFICATE block
nano /etc/nginx/ssl/ravivarvichar-origin.key   # paste PRIVATE KEY block
chmod 644 /etc/nginx/ssl/ravivarvichar-origin.crt
chmod 600 /etc/nginx/ssl/ravivarvichar-origin.key
openssl x509 -in /etc/nginx/ssl/ravivarvichar-origin.crt -noout -dates -subject
```
✅ Done when: dates ~15 years apart, subject contains `ravivarvichar.in`.

---

## ⬜ REMAINING — Phases 7–9

### Phase 7 — Nginx HTTPS + pre-launch testing (still NOT live)
- Replace nginx config with **v2** (from `PRODUCTION_DEPLOY_GUIDE.md` section 9.1): HTTP→HTTPS 301 redirect server + 443 ssl server with origin cert, `server_name ravivarvichar.in www.ravivarvichar.in admin.ravivarvichar.in`, Cloudflare `set_real_ip_from` ranges + `real_ip_header CF-Connecting-IP`
- `nginx -t && systemctl restart nginx`
- Test via `curl --resolve ravivarvichar.in:443:159.65.153.153 https://ravivarvichar.in/api/v1/health`
- Hosts-file override on Windows (`C:\Windows\System32\drivers\etc\hosts`):
  ```
  159.65.153.153 ravivarvichar.in
  159.65.153.153 www.ravivarvichar.in
  159.65.153.153 admin.ravivarvichar.in
  ```
  → `ipconfig /flushdns`, incognito window
- Test: `https://ravivarvichar.in` (site + valid padlock), `/admin` login works (first time — needs HTTPS for secure cookie), health JSON
- Optional: test maintenance `MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh` + off
- Remove hosts lines after

### Phase 8 — GO LIVE (only when user is ready)
- At **GoDaddy**: Domains → ravivarvichar.in → Nameservers → replace current (`sasha` + `rene.ns.cloudflare.com`) with **`kipp.ns.cloudflare.com` + `laila.ns.cloudflare.com`**
- ⚠️ Check **DNSSEC is OFF** at GoDaddy first (Cloudflare warned about this)
- Propagation: `nslookup -type=NS ravivarvichar.in` (Windows) → zone flips Pending → **Active**
- Verify in normal browser: `https://ravivarvichar.in` new site + padlock, `/admin` login, health JSON

### Phase 9 — Post-launch
1. **Change admin password** immediately (`admin@ravivarvichar.org` / `Admin@123` → Settings → Change Password) — user also plans to change droplet root password ("changed before production only")
2. UFW firewall: `ufw allow 22,80,443 && ufw enable` (optionally restrict 80/443 to Cloudflare IPs)
3. **Resend** for password-reset emails: create account, add TXT + DKIM records in Cloudflare DNS, set `RESEND_API_KEY` in `apps/server/.env`, `pm2 restart ravivarvichar-api`
4. **Backups cron**: mongodump + uploads rsync (see guide section 11.3)
5. Verify email (Google Workspace MX intact in new zone)
6. Old droplet: keep a few days, then shutdown (snapshot first)
7. Tell Buffy **"Update deployment reference"** → update `DEPLOYMENT_REFERENCE.md`

---

## 🔑 Key credentials/locations
| Item | Value |
|---|---|
| Droplet IP | `159.65.153.153` |
| Server path | `/var/www/RavivarVichar` |
| PM2 process | `ravivarvichar-api` (port 5000) |
| SSH | `ssh root@159.65.153.153` (password auth; user prefers password) |
| Origin cert paths | `/etc/nginx/ssl/ravivarvichar-origin.crt` + `.key` |
| New CF nameservers | `kipp.ns.cloudflare.com` + `laila.ns.cloudflare.com` |
| Old CF nameservers (to replace) | `sasha.ns.cloudflare.com` + `rene.ns.cloudflare.com` |
| Seed admin | `admin@ravivarvichar.org` / `Admin@123` (CHANGE in Phase 9) |

## 📄 Reference docs (in repo)
- `PRODUCTION_DEPLOY_GUIDE.md` — the master guide (Phases 0–9, troubleshooting table)
- `DEPLOYMENT_GUIDE.md` — daily ops / troubleshooting
- `OriginalDeploymentGuide.md` — lessons learned (swap, base path, node_modules mismatch)

## 🎯 Next action when resuming
1. Try Phase 6 origin cert creation **without** the wildcard `*.ravivarvichar.in` (or wait 15–30 min if needed)
2. Install cert on droplet (commands above)
3. Verify with `openssl x509 ...` → then Phase 7 (HTTPS nginx config)








What YOU do — step by step
STEP 1 — GoDaddy: check DNSSEC is OFF (5 min)
- Go to GoDaddy → your domain → DNS → look for DNSSEC
- If it says "not set up" → good, move on. If it's ON → turn it OFF (Cloudflare will warn you about this if it's on).
STEP 2 — Cloudflare: set SSL to "Flexible" (2 min) ⚠️ IMPORTANT
- Cloudflare dashboard → your domain → SSL/TLS → Overview
- Change the mode from Full (strict) to Flexible
- Why: if you don't do this, the website will show an error to everyone as soon as you switch. Flexible = safe during the switch.
STEP 3 — GoDaddy: change nameservers (5 min) 🟢 THIS IS THE "GO LIVE" MOMENT
- GoDaddy → your domain → Nameservers → "I'll use my own nameservers"
- Type:  kipp.ns.cloudflare.com  and  laila.ns.cloudflare.com  → Save
⚠️ Honest warning: the second this saves, your NEW website goes live for everyone — with the sample/test data in it (not the old site's content). That's normal for this migration; the old site will stop showing. So only do this when you're ready for that.
STEP 4 — Wait (5–30 min)
- Open your terminal and run:  nslookup -type=NS ravivarvichar.in 
- When you see  kipp  and  laila  in the answer → you're done waiting.
- In Cloudflare, your domain should now say "Active" instead of "Pending".
STEP 5 — Create the certificate (5 min) ✅ will work now
- Cloudflare → SSL/TLS → Origin Server → Create Certificate
- Hostnames:  ravivarvichar.in ,  www.ravivarvichar.in ,  admin.ravivarvichar.in  (no wildcard)
- Validity: 15 years → Create
- You get 2 blocks of text:
- CERTIFICATE block → copy it
- PRIVATE KEY block → copy it ⚠️ It's shown only once! Save it in a notepad file immediately.
STEP 6 — Put it on your server (10 min)
- SSH into your server ( ssh root@159.65.153.153 )
- Run these, one by one (it will open a text editor to paste the blocks):
// bash
mkdir -p /etc/nginx/ssl
nano /etc/nginx/ssl/ravivarvichar-origin.crt   # paste the CERTIFICATE block, save (Ctrl+O, Enter, Ctrl+X)
nano /etc/nginx/ssl/ravivarvichar-origin.key   # paste the PRIVATE KEY block, save
chmod 644 /etc/nginx/ssl/ravivarvichar-origin.crt
chmod 600 /etc/nginx/ssl/ravivarvichar-origin.key
- Then replace the nginx config with the v2 version — it's written out in full in your file  PRODUCTION_DEPLOY_GUIDE.md , section 9.1. Paste it into:
// bash
nano /etc/nginx/sites-available/ravivarvichar
- Then restart:
// bash
nginx -t && systemctl restart nginx
STEP 7 — Flip SSL back to "Full (strict)" (2 min)
- Cloudflare → SSL/TLS → Overview → change Flexible back to Full (strict)
STEP 8 — Check everything (5 min)
- Open  https://ravivarvichar.in  → site loads with a padlock ✅
-  https://ravivarvichar.in/admin  → login page loads, log in with  admin@ravivarvichar.org  /  Admin@123  ✅
- Open  https://ravivarvichar.in/api/v1/health  in browser → shows  {"success":true,...}  ✅
STEP 9 — After that (security, do soon)
1. Change the admin password (Admin panel → Settings → Change Password)
2. Turn on the firewall (I'll give you the command when you get here)
3. Set up email (Resend) + backups
────────────────────────────────────────────────────────────────────────────────
The short version: GoDaddy (check DNSSEC) → Cloudflare (set Flexible) → GoDaddy (change nameservers) → wait → Cloudflare (create cert) → server (paste cert + config) → Cloudflare (set Full strict) → test.
Tell me when you've done Step 1 & 2, and I'll guide you through the rest one step at a time. Want me to also update your resume_prompt.md with this new order so we don't lose it?
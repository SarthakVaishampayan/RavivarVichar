# 🚀 RavivarVichar Production Launch — Resume Prompt

> **Session resume point:** Nameservers switched at GoDaddy → waiting for Cloudflare zone to flip **Pending → Active** (typically 1–2 h, up to 24 h). Origin cert comes AFTER activation.
> Paste this file's contents into a new session to continue exactly where we left off.

---

## 📌 The Goal

Deploy RavivarVichar to production at **`https://ravivarvichar.in`** on a new DigitalOcean droplet, fronted by **Cloudflare** (new account), with a Cloudflare **Origin Certificate** (15-year, free). Domain registered at **GoDaddy** (expires Jan 25, 2027 — auto-renew is OFF, renew later).

**Critical facts:**
- **New droplet IP:** `159.65.153.153` (Ubuntu 24.04, $6/mo = 1 vCPU / 1 GB RAM / 25 GB SSD; swap is MANDATORY, 2047 MB active)
- **Old droplet IP (still running):** `142.93.213.69` — keep running until the new site is verified for a few days
- **GitHub repo:** `https://github.com/SarthakVaishampayan/RavivarVichar.git` (public, remote name `RavivarVichar`)
- **Cloudflare:** NEW account `Ravivardigest01@gmail.com` — Zone ID `5ae5a4b21dff934e7e6c71fbe64e604b`, Account ID `2747109e271adb6479071b4fbb95a844`, Free plan. Domain was previously on SOMEONE ELSE's CF account (`sasha` + `rene.ns.cloudflare.com`)
- **Repo prep (committed & pushed "final" `eb5b8b3f`):** `scripts/maintenance-on.sh` SSL-aware (443 + origin cert check), `PRODUCTION_DEPLOY_GUIDE.md` created (master guide)

**The master plan (REVISED — cert now comes AFTER nameserver switch, because Cloudflare refuses to issue the origin cert while the zone is pending):**
```
PHASE 1-4   Server setup + deploy → tested via http://159.65.153.153          ✅ DONE
PHASE 5     Cloudflare DNS records in NEW account                             ✅ DONE
STEP 1      DNSSEC check at GoDaddy → OFF                                     ✅ DONE
STEP 2      Cloudflare SSL mode → Flexible (safe window)                      ✅ DONE
STEP 3      GO LIVE: nameservers switched at GoDaddy → kipp/laila             ✅ DONE
STEP 4      Wait for propagation → Cloudflare zone → "Active"                 ⏳ IN PROGRESS
STEP 5      Create origin cert (3 hostnames, no wildcard)                     ⬜ AFTER ACTIVE
STEP 6      Install cert + nginx HTTPS (v2 config) on droplet                 ⬜ REMAINING
STEP 7      Flip SSL mode → Full (strict)                                     ⬜ REMAINING
STEP 8      Verify site/admin/health in browser                               ⬜ REMAINING
PHASE 9     Post-launch: admin password, UFW, Resend, backups                 ⬜ REMAINING
```

---

## ✅ What's DONE

### Repo prep (commit `eb5b8b3f` "final")
- `scripts/maintenance-on.sh`: listens on **443 with the origin cert** (required for Cloudflare Full/strict), fails fast if cert missing (`--dry-run` skips), old IP refs replaced with `ravivarvichar.in`
- `PRODUCTION_DEPLOY_GUIDE.md`: full production guide incl. **section 9.1 — the exact v2 nginx config** (HTTP→HTTPS redirect + 443 ssl server + `set_real_ip_from` CF ranges + `real_ip_header CF-Connecting-IP`)

### Phase 1 — Droplet ✅
- `ravivarvichar-production` in DigitalOcean, **BLR1**, Ubuntu 24.04 LTS, **$6/mo**
- **Auth: Password** (user preference; droplet root password to be changed after launch)

### Phase 2 — Server dependencies ✅
- Node `v20.20.2`, npm `10.8.2`, MongoDB `7.0.39`, nginx `1.24.0`, PM2 `7.0.3`, apache2-utils
- **Swap 2047 MB active** (`/swapfile` in fstab) — CRITICAL on 1 GB RAM for builds
- mongod started + enabled; `sshd_config` debconf hiccup fixed via `dpkg --configure -a`

### Phase 3 — App deployed ✅
- Cloned to `/var/www/RavivarVichar`; `.env` at `apps/server/.env` (generated JWT secrets, `IP_HASH_SALT`; `CLIENT_URL=https://ravivarvichar.in`, `ADMIN_URL=https://admin.ravivarvichar.in`; Cloudinary + Resend empty)
- DB seeded fresh; `bash scripts/deploy.sh` SUCCESS; PM2 `ravivarvichar-api` online & healthy; PM2 startup + `pm2 save` done
- Health: `{"success":true,"message":"RavivarVichar API is running",...}`

### Phase 4 — Nginx HTTP ✅
- v1 config at `/etc/nginx/sites-available/ravivarvichar` (HTTP-only): SPA at `/`, admin alias `/admin`, proxy `/api/` → localhost:5000, `/uploads/` alias, `client_max_body_size 50m`
- `nginx -t` OK; site renders at `http://159.65.153.153` (user confirmed)

### Phase 5 — Cloudflare DNS (NEW account) ✅
- Final **7 records — ALL VERIFIED on 2026-08-07** (page shows "7 of 200 used"):
  | Type | Name | Value | Proxy |
  |---|---|---|---|
  | A | `@` | `159.65.153.153` | 🟠 Proxied |
  | A | `www` | `159.65.153.153` | 🟠 Proxied |
  | A | `admin` | `159.65.153.153` | 🟠 Proxied |
  | MX | `@` | `smtp.google.com` | DNS only (Google Workspace — DO NOT DELETE) |
  | TXT | `default._domainkey` | DKIM string | DNS only (keep!) |
  | TXT | `@` | `google-site-verification=fQsW...` | DNS only |
  | TXT | `@` | `google-site-verification=9ooA...` | DNS only |

### GO-LIVE steps done TODAY ✅
- **STEP 1 — DNSSEC:** OFF at GoDaddy (DS Records tab is empty — do NOT click "Add" there)
- **STEP 2 — SSL mode:** set to **Flexible** in Cloudflare (SSL/TLS → Overview)
- **STEP 3 — Nameservers:** switched at GoDaddy → **`kipp.ns.cloudflare.com` + `laila.ns.cloudflare.com`** (GoDaddy shows "Success — your request is in progress"; GoDaddy page now lists kipp/laila)
- **Pre-flight:** droplet healthy — API health JSON ✅, homepage HTTP 200 ✅, admin HTTP 200 ✅
- **Rollback saved:** old nameservers `sasha.ns.cloudflare.com` + `rene.ns.cloudflare.com` noted by user (DNSSEC off ⇒ clean rollback possible)

---

## ⏳ CURRENT STEP — STEP 4: Waiting for propagation

- Cloudflare Overview shows: **"Waiting for your registrar to propagate your new nameservers… typically 1–2 hours, may take up to 24 hours."** Zone status: **"Pending nameserver update"**
- DNS checks (2026-08-07 ~22:00 IST): Google 8.8.8.8 / 1.1.1.1 / local resolver all **still return old NS** (`sasha`/`rene`, TTL 21600 = 6 h cache) — NORMAL. A records resolve to Cloudflare proxy IPs (both old & new zones use CF).
- **Do NOT roll back during this wait.** Only investigate if still 100% old after ~1 hour.

### What "done" looks like
- Cloudflare **Overview → "Active"** (the ONLY signal that matters — Cloudflare checks the registry directly, can flip before public resolvers update)
- Public DNS eventually shows `kipp`/`laila` via `nslookup -type=NS ravivarvichar.in 8.8.8.8`

---

## ⬜ REMAINING

### STEP 5 — Create the origin certificate (ONLY after zone shows "Active")
Cloudflare → **SSL/TLS → Origin Server → Create Certificate**:
- "Let Cloudflare generate a private key", RSA (2048), validity **15 years**
- Hostnames — **NO wildcard**, exactly these 3:
  ```
  ravivarvichar.in
  www.ravivarvichar.in
  admin.ravivarvichar.in
  ```
- Create → you get TWO blocks:
  - `-----BEGIN CERTIFICATE-----` → save to `origin-cert.txt`
  - `-----BEGIN PRIVATE KEY-----` → save to `origin-key.txt`
- 🔒 **Private key shown only ONCE** — copy both blocks to a notepad file before closing the page

### STEP 6 — Install cert + HTTPS nginx on the droplet
```bash
ssh root@159.65.153.153
mkdir -p /etc/nginx/ssl
nano /etc/nginx/ssl/ravivarvichar-origin.crt   # paste CERTIFICATE block (Ctrl+O, Enter, Ctrl+X)
nano /etc/nginx/ssl/ravivarvichar-origin.key   # paste PRIVATE KEY block
chmod 644 /etc/nginx/ssl/ravivarvichar-origin.crt
chmod 600 /etc/nginx/ssl/ravivarvichar-origin.key
openssl x509 -in /etc/nginx/ssl/ravivarvichar-origin.crt -noout -dates -subject
# ✅ dates ~15 years apart, subject contains ravivarvichar.in
```
Then replace `/etc/nginx/sites-available/ravivarvichar` with the **v2 config** (full text in `PRODUCTION_DEPLOY_GUIDE.md` section 9.1 — also pasted in full in the chat of 2026-08-07): 80→443 301 redirect server + 443 ssl server with origin cert + CF `set_real_ip_from` ranges. Then:
```bash
nginx -t
systemctl restart nginx
```
Verify from LOCAL machine (bypasses Cloudflare, works regardless of SSL mode):
```bash
curl --resolve ravivarvichar.in:443:159.65.153.153 https://ravivarvichar.in/api/v1/health
# expect health JSON, no -k needed
```

### STEP 7 — Flip SSL mode back
Cloudflare → **SSL/TLS → Overview** → **Flexible → Full (strict)**. (Optional: Always Use HTTPS → ON.)

### STEP 8 — Final public checks (normal browser; if local ISP still cached: `ipconfig /flushdns` + incognito)
| URL | Expect |
|---|---|
| `https://ravivarvichar.in` | New site loads, valid padlock |
| `https://ravivarvichar.in/admin` | Login → `admin@ravivarvichar.org` / `Admin@123` |
| `https://ravivarvichar.in/api/v1/health` | `{"success":true,...}` |

**Error map:** `521` = 443 not listening → re-check nginx · `525` = TLS handshake → check cert files · `526` = cert/hostname mismatch → re-create cert · `ERR_TOO_MANY_REDIRECTS` = mode still Flexible while config redirects → set **Full (strict)**.

### PHASE 9 — Post-launch (do soon)
1. **Change admin password** immediately: admin → Settings → Change Password. Also change droplet root password.
2. **UFW firewall:** `ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable` (optionally restrict 80/443 to Cloudflare IPs only)
3. **Resend** for password-reset emails: create account, add TXT + DKIM records in Cloudflare DNS, set `RESEND_API_KEY` in `apps/server/.env`, `pm2 restart ravivarvichar-api`
4. **Backups cron:** mongodump + uploads rsync (guide section 11.3)
5. **Email:** verify Google Workspace MX intact (already correct in new zone). Optional: add SPF (`v=spf1 include:_spf.google.com ~all`) + DMARC records in Cloudflare DNS
6. **Old droplet:** keep a few days, then shutdown (snapshot first)
7. Tell Buffy **"Update deployment reference"** → update `DEPLOYMENT_REFERENCE.md`

---

## 🔑 Key credentials/locations
| Item | Value |
|---|---|
| Droplet IP | `159.65.153.153` |
| Server path | `/var/www/RavivarVichar` |
| PM2 process | `ravivarvichar-api` (port 5000) |
| SSH | `ssh root@159.65.153.153` (password auth) |
| Origin cert paths | `/etc/nginx/ssl/ravivarvichar-origin.crt` + `.key` |
| New CF nameservers (live) | `kipp.ns.cloudflare.com` + `laila.ns.cloudflare.com` |
| Old CF nameservers (rollback) | `sasha.ns.cloudflare.com` + `rene.ns.cloudflare.com` |
| Cloudflare zone/account IDs | Zone `5ae5a4b21dff934e7e6c71fbe64e604b` / Account `2747109e271adb6479071b4fbb95a844` |
| Seed admin (CHANGE in Phase 9) | `admin@ravivarvichar.org` / `Admin@123` |
| Domain expiry | Jan 25, 2027 (auto-renew OFF) |

## 📄 Reference docs (in repo)
- `PRODUCTION_DEPLOY_GUIDE.md` — the master guide (Phases 0–9, v2 nginx config in 9.1, troubleshooting table)
- `DEPLOYMENT_GUIDE.md` — daily ops / troubleshooting
- `OriginalDeploymentGuide.md` — lessons learned (swap, base path, node_modules mismatch)

## 🎯 Next action when resuming
1. Check Cloudflare **Overview** — if the zone now reads **"Active"**, proceed
2. **STEP 5:** create origin cert (3 hostnames, no wildcard) → save both PEM blocks immediately
3. **STEP 6:** install cert on droplet + v2 nginx config → `nginx -t && systemctl restart nginx` → `curl --resolve` test
4. **STEP 7:** flip SSL mode Flexible → **Full (strict)** → **STEP 8:** verify in browser → Phase 9

# RavivarVichar — TODO

> Pending tasks to complete before / during production deployment on the new DigitalOcean droplet.
> Tick boxes off as you complete them.

---

## 📧 Resend — Password Reset Email Setup (⏳ Pending)

The **forgot / reset password** functionality is fully implemented and tested. The only missing piece is the email provider so reset links actually reach the admin's inbox.

**What already works (no action needed):**
- [x] `POST /api/v1/auth/forgot-password` — creates a secure, hashed, single-use reset token (valid 1 hour)
- [x] `POST /api/v1/auth/reset-password` — sets new password + revokes all old sessions
- [x] Admin pages: `Forgot Password` (linked from login) + `Reset Password` (reads `?token=`)
- [x] Without an API key, the reset link is printed in server logs as `[DEV-EMAIL]` (dev fallback)

**Setup on the droplet (to do later):**

- [ ] Create a Resend account → https://resend.com (free tier: 100 emails/day is plenty for password resets)
- [ ] In Resend, add your domain (e.g. `ravivarvichar.org`)
- [ ] Copy the **2 DNS records** Resend gives you (TXT + DKIM)
- [ ] Paste those DNS records into **GoDaddy DNS settings** for your domain
- [ ] Wait for domain verification in Resend (usually a few minutes, up to a few hours)
- [ ] Add to `apps/server/.env` on the droplet:
      ```
      RESEND_API_KEY=re_your_key_here
      RESEND_FROM=Ravivar Vichar <admin@yourdomain.com>
      ```
- [ ] Restart the API: `pm2 restart ravivarvichar-api`
- [ ] **Test:** login screen → "Forgot password?" → enter admin email → confirm the reset email arrives → set a new password → log in with it

**Notes:**
- Option B (using GoDaddy SMTP directly instead of Resend) is possible but requires a code change (nodemailer + SMTP creds) and has lower daily send limits. Resend is the recommended path — no code changes needed.
- Keep `onboarding@resend.dev` as the sender if you skip domain verification (works immediately, but emails come from Resend's address).

---

## 🔐 After-Launch Security Checklist (⏳ Pending)

- [ ] Change the seeded admin password (`Admin@123`) immediately via **Settings → Change Password**
- [ ] Verify `NODE_ENV=production` + strong JWT secrets + `IP_HASH_SALT` are set (server refuses to boot otherwise)
- [ ] Confirm nginx security headers are in place (already added to `DEPLOYMENT_GUIDE.md`)
- [ ] Run `node scripts/sanity-check.js` after deploy (expect: 0 failures)

---

## 📝 How to add tasks

Append new sections below. Use `- [ ]` for open tasks and `- [x]` for done ones.

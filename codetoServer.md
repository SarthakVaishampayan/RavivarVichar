📤 Step 1 — Push from your local machine
// bash
git add -A
git commit -m "your change description"
git push RavivarVichar main
> ⚠️ Note: your git remote is named  RavivarVichar  (not  origin ), so use that name in the push.

🖥️ Step 2 — SSH into the server
// bash

ssh root@159.65.153.153 (new server)

(No SSH config file found on this machine — you connect straight to the IP. If you have a saved alias, use that instead.)

🚀 Step 3 — Deploy

cd /var/www/RavivarVichar
MAINTENANCE_PASS=secret bash scripts/maintenance-on.sh   # enable mainmodeon
bash scripts/deploy.sh                                     # deploy
bash scripts/maintenance-off.sh                            # take site live

The  deploy.sh  script automatically does everything:
1. Checks for uncommitted changes (aborts if any, unless  --force )
2. Backs up current git commit + old frontend builds
3. Pulls the latest code
4. Reinstalls dependencies (handles Windows↔Linux platform mismatch)
5. Runs sanity checks
6. Builds client + admin frontends
7. Restarts the PM2 server ( ravivarvichar-api )
8. Auto-rolls back everything if ANY step fails

🛡️ Optional — Deploy with maintenance mode (recommended for bigger updates)

So visitors see a clean "under maintenance" page instead of a broken layout mid-build:




✅ Verify after deploy
// bash
pm2 logs ravivarvichar-api --lines 50     # check server logs
curl http://localhost:5000/api/v1/health  # expect {"success":true,...}
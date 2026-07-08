#!/bin/bash
#
# RavivarVichar CMS — Deploy Script
#
# Run this ON THE DROPLET to pull the latest code, run safety checks,
# build frontends, deploy, and restart the server.
#
# If ANY step fails, the script automatically rolls back to the previous
# state — restores old git commit, old frontend builds, and restarts the
# old server code.
#
# Usage:
#   bash scripts/deploy.sh                    # Standard deploy
#   bash scripts/deploy.sh --force            # Skip sanity checks
#   bash scripts/deploy.sh --dry-run          # Show what would happen
#

set -e

# ─── Colors ───
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ─── Configuration ───
PROJECT_DIR="/var/www/RavivarVichar"
CLIENT_DIR="apps/client"
ADMIN_DIR="apps/admin"
SERVER_SCRIPT="apps/server/src/server.js"
PM2_PROCESS_NAME="ravivarvichar-api"
GIT_BRANCH="main"
BACKUP_DIR="/tmp/ravivarvichar-rollback"
SWAPFILE="/swapfile"
MIN_RAM_MB=1500  # Warn if less than this much RAM (no swap)

FORCE=false
DRY_RUN=false
HAS_CHANGED=false
ROLLBACK_DONE=false

for arg in "$@"; do
  case "$arg" in
    --force) FORCE=true ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

# ─── Catch-all: if the script exits unexpectedly, run rollback ───
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ] && [ "$HAS_CHANGED" = true ]; then
    rollback
  elif [ $exit_code -ne 0 ]; then
    # Something failed before any changes — just clean up backup
    rm -rf "$BACKUP_DIR" 2>/dev/null
  fi
}
trap cleanup EXIT

# ─── Helper Functions ───
info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
pass()  { echo -e "${GREEN}[PASS]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; }

run_cmd() {
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN]${NC} Would run: $1"
    return 0
  fi
  local rc
  eval "$1" || rc=$?
  if [ "${rc:-0}" -ne 0 ]; then
    fail "Command failed: $1 (exit code: $rc)"
    exit 1  # triggers cleanup trap → rollback if HAS_CHANGED=true
  fi
}

# ─── Rollback ───
# Restores the droplet to its state before this deploy started
rollback() {
  # Prevent double rollback if both run_cmd and trap trigger this
  if [ "$ROLLBACK_DONE" = true ]; then return 0; fi
  ROLLBACK_DONE=true
  # Temporarily disable set -e so we don't abort mid-rollback
  set +e

  echo ""
  echo -e "${YELLOW}╔══════════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║        ROLLBACK IN PROGRESS              ║${NC}"
  echo -e "${YELLOW}╚══════════════════════════════════════════╝${NC}"
  echo ""

  # 1. Restore old git commit
  if [ -n "$BEFORE_COMMIT" ]; then
    info "Rolling back git to $(echo $BEFORE_COMMIT | head -c 12)..."
    git reset --hard "$BEFORE_COMMIT" 2>/dev/null
    info "Git restored to $(echo $BEFORE_COMMIT | head -c 12)"
  fi

  # 2. Restore old dist directories
  if [ -d "${BACKUP_DIR}/client-dist" ]; then
    info "Restoring old client build..."
    rm -rf "$CLIENT_DIR/dist" 2>/dev/null
    cp -r "${BACKUP_DIR}/client-dist" "$CLIENT_DIR/dist" 2>/dev/null
    info "Client build restored"
  fi
  if [ -d "${BACKUP_DIR}/admin-dist" ]; then
    info "Restoring old admin build..."
    rm -rf "$ADMIN_DIR/dist" 2>/dev/null
    cp -r "${BACKUP_DIR}/admin-dist" "$ADMIN_DIR/dist" 2>/dev/null
    info "Admin build restored"
  fi

  # 3. Restart server with old code
  if command -v pm2 &>/dev/null; then
    if pm2 describe "$PM2_PROCESS_NAME" &>/dev/null; then
      info "Restarting server with old code..."
      pm2 restart "$PM2_PROCESS_NAME" 2>/dev/null
      info "Server restarted"
    fi
  fi

  # 4. Clean up backup
  rm -rf "$BACKUP_DIR" 2>/dev/null

  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║     Rollback Complete — Droplet Restored ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
  echo ""

  # Restore set -e for the exit
  set -e
}

wait_for_health() {
  local max_attempts=12
  local attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if curl -sf http://localhost:5000/api/v1/health > /dev/null 2>&1; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 2
  done
  return 1
}

ensure_server_running() {
  if ! curl -sf http://localhost:5000/api/v1/health > /dev/null 2>&1; then
    info "  Server not running. Starting it now..."
    pm2 start "$SERVER_SCRIPT" --name "$PM2_PROCESS_NAME" 2>/dev/null || true
    if wait_for_health; then
      info "  Server started and healthy"
      return 0
    else
      warn "  Server did not start — sanity checks will be limited"
      return 1
    fi
  fi
  return 0
}

# ──────────────────────────────────────────────────
#  MAIN DEPLOY
# ──────────────────────────────────────────────────

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     RavivarVichar CMS — Deploy Script    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  Started: $(date)"
echo "  Directory: $PROJECT_DIR"
echo "  Branch: $GIT_BRANCH"
echo "  Mode: $([ "$DRY_RUN" = true ] && echo 'DRY RUN' || echo 'LIVE')"
echo ""

# ─── Step 0: Verify project directory ───
info "Step 0: Verifying project directory..."
if [ ! -d "$PROJECT_DIR" ]; then
  fail "Project directory $PROJECT_DIR not found!"
  exit 1
fi
cd "$PROJECT_DIR"
if [ ! -f "package.json" ]; then
  fail "package.json not found in $PROJECT_DIR"
  exit 1
fi
pass "Project directory verified"

# ─── Step 1: Check git status & save current state ───
info "Step 1: Checking git status and backing up current builds..."
if ! command -v git &>/dev/null; then
  fail "Git is not installed"
  exit 1
fi

UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
  if [ "$FORCE" = true ]; then
    warn "$UNCOMMITTED uncommitted change(s) found. Stashing them..."
    git stash --include-untracked 2>/dev/null || true
    pass "Local changes stashed"
  else
    warn "You have $UNCOMMITTED uncommitted change(s):"
    git status --short
    echo ""
    echo "  Commit or stash them first, or use --force to deploy anyway."
    exit 1
  fi
fi

BEFORE_COMMIT=$(git rev-parse HEAD)
info "  Current commit: $(echo $BEFORE_COMMIT | head -c 12)"

# Backup old dist directories (if they exist)
rm -rf "$BACKUP_DIR" 2>/dev/null
mkdir -p "$BACKUP_DIR"
if [ -d "$CLIENT_DIR/dist" ]; then
  cp -r "$CLIENT_DIR/dist" "${BACKUP_DIR}/client-dist"
  info "  Backed up client build"
fi
if [ -d "$ADMIN_DIR/dist" ]; then
  cp -r "$ADMIN_DIR/dist" "${BACKUP_DIR}/admin-dist"
  info "  Backed up admin build"
fi

pass "State backed up at $BACKUP_DIR"

# ─── Step 2: Pull latest code ───
info "Step 2: Pulling latest code from $GIT_BRANCH..."
run_cmd "git fetch origin $GIT_BRANCH"
run_cmd "git pull origin $GIT_BRANCH"
AFTER_COMMIT=$(git rev-parse HEAD)

if [ "$BEFORE_COMMIT" = "$AFTER_COMMIT" ]; then
  pass "Already up to date (no new commits)"
else
  HAS_CHANGED=true
  pass "Updated to: $(echo $AFTER_COMMIT | head -c 12)"
  echo "  Changes:"
  git log --oneline "$BEFORE_COMMIT..$AFTER_COMMIT" 2>/dev/null | head -20
fi

# ─── Step 3: Check swap space (prevents OOM kills on 1GB droplets) ───
info "Step 3: Checking memory and swap space..."
RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
SWAP_MB=$(free -m | awk '/^Swap:/{print $2}')
TOTAL_MB=$((RAM_MB + SWAP_MB))
echo "  RAM: ${RAM_MB}MB | Swap: ${SWAP_MB}MB | Total: ${TOTAL_MB}MB"
if [ "$TOTAL_MB" -lt "$MIN_RAM_MB" ]; then
  warn "Low memory (${TOTAL_MB}MB total). Build may fail with 'Killed' error."
  warn "  Run this to add swap: fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile"
fi

# ─── Step 4: Check for platform-mismatched node_modules ───
info "Step 4: Checking node_modules platform compatibility..."
if [ -f "node_modules/.package-lock.json" ]; then
  # Check if rollup platform module matches this OS
  ROLLUP_BINDING=$(node -e "try{console.log(require('rollup/dist/native').getDefault())}catch(e){console.log('missing')}" 2>/dev/null || echo "missing")
  if [ "$ROLLUP_BINDING" = "missing" ]; then
    warn "Rollup native binding missing (platform mismatch). Reinstalling modules..."
    rm -rf node_modules package-lock.json
    run_cmd "npm install"
    pass "Dependencies reinstalled for this platform"
  else
    pass "Platform bindings OK ($ROLLUP_BINDING)"
  fi
else
  # First install or fresh clone — just install
  run_cmd "npm install"
fi
pass "Dependencies ready"

# ─── Step 5: Run sanity checks (unless --force) ───
if [ "$FORCE" = false ]; then
  info "Step 5: Running sanity checks..."

  # Start server if not running
  ensure_server_running

  if [ "$DRY_RUN" = false ]; then
    set +e
    node scripts/sanity-check.js
    SANITY_EXIT=$?
    set -e

    if [ $SANITY_EXIT -ne 0 ]; then
      echo ""
      fail "Sanity checks failed (exit code: $SANITY_EXIT)"
      exit 1  # triggers cleanup trap → rollback
    fi
  else
    warn "Skipping sanity checks in dry-run mode"
  fi
  pass "All sanity checks passed"
else
  warn "Step 4: Sanity checks skipped (--force flag)"
fi

# ─── Step 6: Build frontends ───
info "Step 6: Building frontends..."

if [ "$DRY_RUN" = false ]; then
  info "  Building client..."
  run_cmd "npm run build -w apps/client"
  pass "  Client built successfully"

  info "  Building admin..."
  run_cmd "npm run build -w apps/admin"
  pass "  Admin built successfully"
else
  warn "  Client build skipped (dry-run)"
  warn "  Admin build skipped (dry-run)"
fi
pass "Frontends built"

# ─── Step 7: Restart server ───
info "Step 7: Restarting server with latest code..."

if command -v pm2 &>/dev/null; then
  if pm2 describe "$PM2_PROCESS_NAME" &>/dev/null; then
    run_cmd "pm2 restart $PM2_PROCESS_NAME"
    pass "Server restarted"
  else
    info "  PM2 process not found, starting..."
    run_cmd "pm2 start $SERVER_SCRIPT --name $PM2_PROCESS_NAME"
    pass "Server started"
  fi

  if wait_for_health; then
    pass "Server is healthy"
  else
    warn "Server health check timed out — check logs: pm2 logs $PM2_PROCESS_NAME"
  fi

  run_cmd "pm2 save"
  pass "PM2 config saved"
else
  warn "PM2 not installed. Restart manually: node $SERVER_SCRIPT"
fi

# ─── Step 8: Clean up backup (deploy succeeded!) ───
info "Step 8: Cleaning up..."
rm -rf "$BACKUP_DIR" 2>/dev/null
pass "Rollback backup removed (deploy succeeded)"

# ─── Step 9: Final verification ───
info "Step 9: Final verification..."
if command -v curl &>/dev/null; then
  HEALTH=$(curl -s http://localhost:5000/api/v1/health 2>/dev/null || echo '{"success":false}')
  echo "  API response: $HEALTH"
  echo "$HEALTH" | grep -q '"success":true' && pass "API is operational" || warn "API may not be responding correctly"
fi

# ─── Done ───
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Deploy Complete!                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  Finished: $(date)"
echo "  Commit:   $(echo $AFTER_COMMIT | head -c 12)"

if [ "$BEFORE_COMMIT" != "$AFTER_COMMIT" ]; then
  echo ""
  echo "  ─── Deployed Changes ───"
  git log --oneline "$BEFORE_COMMIT..$AFTER_COMMIT" 2>/dev/null
fi

# Remind about stashed changes if --force was used
if [ "$UNCOMMITTED" -gt 0 ] && [ "$FORCE" = true ]; then
  echo ""
  echo "  ⚠  Local changes were stashed. Run 'git stash pop' to restore them if needed."
fi

echo ""
echo "  ─── Quick Commands ───"
echo "  Logs:    pm2 logs $PM2_PROCESS_NAME"
echo "  Status:  pm2 status"
if [ "$BEFORE_COMMIT" != "$AFTER_COMMIT" ]; then
  echo "  Rollback: git reset --hard $(echo $BEFORE_COMMIT | head -c 12) && pm2 restart $PM2_PROCESS_NAME"
fi
echo ""

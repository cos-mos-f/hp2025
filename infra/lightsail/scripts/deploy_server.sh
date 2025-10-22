#!/usr/bin/env bash
set -euo pipefail

# 手動デプロイ用スクリプト（SSH/rsync）。必要に応じて編集してください。

REMOTE_USER="${REMOTE_USER:-ubuntu}"
REMOTE_HOST="${REMOTE_HOST:-example.com}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/hp2025}"

echo "[deploy] building server bundle..."
pushd ../../..
npm ci
npm run build -w packages/shared
npm run build -w apps/server
rm -rf bundle && mkdir -p bundle
cp -r apps/server/dist bundle/dist
cp apps/server/package.json bundle/package.json
cp apps/server/.env.example bundle/.env.example
cp -r apps/server/src/db/prisma bundle/prisma
mkdir -p bundle/data
pushd bundle
npm ci --omit=dev
popd
popd

echo "[deploy] rsync to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"
rsync -az --delete ./bundle/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"

echo "[deploy] post-commands via ssh"
ssh "${REMOTE_USER}@${REMOTE_HOST}" <<'EOF'
set -e
cd ${REMOTE_DIR}
npx prisma migrate deploy || true
if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrReload ecosystem.config.cjs || pm2 restart all || true
else
  echo "Please restart your service manually (systemd or other)."
fi
EOF

echo "[deploy] done"

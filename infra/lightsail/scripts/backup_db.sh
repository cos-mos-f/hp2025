#!/usr/bin/env bash
set -euo pipefail

# SQLite のシンプルなバックアップ（コールド）
# 停止できない場合は .backup コマンドや WAL も検討してください。

DB_PATH="${DB_PATH:-/var/www/hp2025/data/app.sqlite}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/hp2025}"
STAMP=$(date +"%Y%m%d-%H%M%S")
mkdir -p "${BACKUP_DIR}"

cp -v "${DB_PATH}" "${BACKUP_DIR}/app-${STAMP}.sqlite"
echo "backup: ${BACKUP_DIR}/app-${STAMP}.sqlite"

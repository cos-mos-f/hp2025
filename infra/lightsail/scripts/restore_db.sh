#!/usr/bin/env bash
set -euo pipefail

# SQLite のシンプルな復元

DB_PATH="${DB_PATH:-/var/www/hp2025/data/app.sqlite}"
BACKUP_FILE="${BACKUP_FILE:-}"

if [[ -z "${BACKUP_FILE}" ]]; then
  echo "Usage: BACKUP_FILE=/path/to/app-YYYYMMDD-HHMMSS.sqlite $0"
  exit 1
fi

cp -v "${BACKUP_FILE}" "${DB_PATH}"
echo "restored: ${DB_PATH}"

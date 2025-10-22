# @hp/server

Fastify ベースの Node.js サーバーです。Lightsail 上での運用を想定しています。

## スクリプト

- 開発: `npm run dev -w apps/server`
- ビルド: `npm run build -w apps/server`
- 実行: `npm run start -w apps/server`

## 環境変数

`.env.example` をコピーして `.env` を作成してください。

- `SERVER_PORT` サーバーのポート番号
- `DATABASE_URL` SQLite のパス（例: `file:./data/app.sqlite`）
- `CORS_ORIGIN` フロントのオリジン
- `LOG_LEVEL` ログレベル（info など）

## Prisma

初期スキーマは `src/db/prisma/schema.prisma` にあります。

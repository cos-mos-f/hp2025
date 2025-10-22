# @hp/web

GitHub Pages 向けの Next.js アプリです。`next.config.mjs` で `output: 'export'` を有効化しています。

## スクリプト

- 開発: `npm run dev -w apps/web`
- ビルド: `npm run build -w apps/web` （`out/` に静的出力）
- エクスポート: `npm run export -w apps/web`

## 環境変数

- `NEXT_PUBLIC_API_ORIGIN` バックエンド API のオリジン
- `NEXT_PUBLIC_BASE_PATH` GitHub Pages のサブパス（例: `/repo-name`）
- `NEXT_PUBLIC_ASSET_PREFIX` アセット配信のプレフィックス

`.env.local.example` をコピーして `.env.local` を作成してください。

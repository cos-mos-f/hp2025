import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Database from "better-sqlite3"
import { z } from "zod"
import path from "node:path"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// SQLite 接続（ファイルがなければ作成されます）
const dbPath = process.env.DB_PATH || path.resolve("src/data/app.db")
const db = new Database(dbPath)

// 初回起動時テーブル作成（サンプル）
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

// ヘルスチェック
app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

// 追加（POST /api/items {title}）
app.post("/api/items", (req, res) => {
  const schema = z.object({ title: z.string().min(1) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }
  const stmt = db.prepare("INSERT INTO items (title) VALUES (?)")
  const info = stmt.run(parsed.data.title)
  const row = db.prepare("SELECT * FROM items WHERE id = ?").get(info.lastInsertRowid)
  res.status(201).json(row)
})

// 一覧（GET /api/items）
app.get("/api/items", (_req, res) => {
  const rows = db.prepare("SELECT * FROM items ORDER BY id DESC").all()
  res.json(rows)
})

const port = Number(process.env.PORT || 3000)
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})

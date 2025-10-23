import type { FastifyPluginAsync } from 'fastify'
import { NotifySchema, type NotifyInput } from '../schemas/notify.js'
import { request } from 'undici'

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL

const notifyRoute: FastifyPluginAsync = async (app) => {
  app.post<{ Body: NotifyInput }>('/notify', async (req, reply) => {
    const parsed = NotifySchema.safeParse(req.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid body', issues: parsed.error.issues })
    }
    if (!WEBHOOK) {
      return reply.code(500).send({ error: 'Webhook not configured' })
    }
    const content = `event: ${parsed.data.event}\n${JSON.stringify(parsed.data.payload ?? {}, null, 2)}`
    await request(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    return { ok: true }
  })
}

export default notifyRoute

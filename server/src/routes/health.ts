import type { FastifyPluginAsync } from 'fastify'

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => {
    return { ok: true, time: new Date().toISOString() }
  })
}

export default healthRoute

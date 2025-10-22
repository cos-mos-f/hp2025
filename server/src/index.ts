import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import pino from 'pino'
import healthRoute from './routes/health.js'
import notifyRoute from './routes/notify.js'

const app = Fastify({
  logger: pino({ level: 'info' })
})

await app.register(cors, {
  origin: process.env.ALLOWED_ORIGIN ?? false,
  methods: ['GET','POST','OPTIONS']
})

app.register(healthRoute, { prefix: '/api' })
app.register(notifyRoute, { prefix: '/api' })

const port = Number(process.env.PORT ?? 3000)
const host = '0.0.0.0'

app.listen({ port, host }).then(() => {
  app.log.info(`Server running on http://localhost:${port}`)
})

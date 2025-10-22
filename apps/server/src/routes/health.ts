// @ts-nocheck
import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ status: "ok", time: new Date().toISOString() }));
}

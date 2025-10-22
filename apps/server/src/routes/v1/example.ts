// @ts-nocheck
import { FastifyInstance } from "fastify";

export async function exampleRoutes(app: FastifyInstance) {
  app.get("/v1/example", async () => ({ message: "example", version: 1 }));
}

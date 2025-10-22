// @ts-nocheck
import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadEnv } from "./env";

export function buildApp() {
  const env = loadEnv();
  const app = Fastify({
    logger: { level: env.LOG_LEVEL }
  });

  // CORS
  app.register(cors, {
    origin: env.CORS_ORIGIN || true
  });

  // Routes
  app.get("/health", async () => ({ status: "ok", time: new Date().toISOString() }));
  app.register(async (instance) => {
    instance.get("/v1/example", async () => ({ message: "example", version: 1 }));
  }, { prefix: "/" });

  return app;
}

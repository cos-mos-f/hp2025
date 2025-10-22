import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import pino from "pino";
import healthRoute from "./routes/health.js";
import notifyRoute from "./routes/notify.js";

const app = Fastify({
  // Fastify expects logger options or boolean, not a pino instance
  logger: { level: "info" },
});

// Handle CJS/ESM interop for @fastify/cors under NodeNext + verbatimModuleSyntax
/* biome-ignore lint/suspicious/noExplicitAny: interop shim for CJS/ESM default export */
const corsPlugin = (fastifyCors as any).default ?? (fastifyCors as any);
await app.register(corsPlugin, {
  origin: process.env.ALLOWED_ORIGIN ?? false,
  methods: ["GET", "POST", "OPTIONS"],
});

app.register(healthRoute, { prefix: "/api" });
app.register(notifyRoute, { prefix: "/api" });

const port = Number(process.env.PORT ?? 3000);
const host = "0.0.0.0";

app.listen({ port, host }).then(() => {
  app.log.info(`Server running on http://localhost:${port}`);
});

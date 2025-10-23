import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import healthRoute from "./routes/health.js";
import notifyRoute from "./routes/notify.js";
const app = Fastify({
    // Fastify のロガーはオプション指定または boolean で有効化可能（外部 pino インスタンスは不要）
    logger: { level: "info" },
});
// Handle CJS/ESM interop for @fastify/cors under NodeNext + verbatimModuleSyntax
/* biome-ignore lint/suspicious/noExplicitAny: interop shim for CJS/ESM default export */
const corsPlugin = fastifyCors.default ?? fastifyCors;
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
//# sourceMappingURL=index.js.map
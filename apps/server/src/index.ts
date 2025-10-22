// @ts-nocheck
import "dotenv/config";
import { buildApp } from "./app";
import { loadEnv } from "./env";

async function main() {
  const env = loadEnv();
  const app = buildApp();
  try {
    await app.listen({ port: env.SERVER_PORT, host: "0.0.0.0" });
    app.log.info(`Server started on http://localhost:${env.SERVER_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();

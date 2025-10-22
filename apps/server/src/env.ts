// @ts-nocheck
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  SERVER_PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().url().optional(),
  DATABASE_URL: z.string().min(1).default("file:./data/app.sqlite"),
  LOG_LEVEL: z.enum(["fatal","error","warn","info","debug","trace","silent"]).default("info")
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("[env] Invalid environment variables:", parsed.error.flatten());
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

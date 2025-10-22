// @ts-nocheck
import { z } from "zod";

export const ExampleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  createdAt: z.string().datetime()
});

export type Example = z.infer<typeof ExampleSchema>;

import { z } from 'zod'

export const NotifySchema = z.object({
  event: z.string().min(1),
  payload: z.record(z.any(), z.any()).optional()
})
export type NotifyInput = z.infer<typeof NotifySchema>

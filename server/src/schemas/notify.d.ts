import { z } from 'zod';
export declare const NotifySchema: z.ZodObject<{
    event: z.ZodString;
    payload: z.ZodOptional<z.ZodRecord<z.ZodAny, z.ZodAny>>;
}, z.core.$strip>;
export type NotifyInput = z.infer<typeof NotifySchema>;
//# sourceMappingURL=notify.d.ts.map
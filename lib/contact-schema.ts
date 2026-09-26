import { z } from "zod";

/** Error messages are field codes; the form turns them into FR/EN text. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(80),
  email: z.email("email").max(120),
  type: z.string().trim().max(40).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(10, "message").max(3000),
  /** honeypot: must stay empty */
  company: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ton nom, s'il te plaît.").max(80),
  email: z.email("Courriel invalide.").max(120),
  type: z.string().trim().max(40).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(10, "Dis-m'en un peu plus (10 caractères min.).").max(3000),
  /** honeypot: must stay empty */
  company: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

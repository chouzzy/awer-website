import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  clientId: z.string().min(1, "É obrigatório selecionar um cliente."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
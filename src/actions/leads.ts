"use server";

// src/actions/leads.ts
// Leads da página /escala-6x1 (Planejador de Escalas). Gravados em help_awer.leads_escala_6x1.

import { z } from "zod";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";

import { FAIXAS_FUNCIONARIOS, SEGMENTOS } from "@/data/escala6x1";

const leadSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome").max(120),
  empresa: z.string().trim().min(2, "Informe a empresa").max(160),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "WhatsApp inválido"),
  email: z.union([z.literal(""), z.string().trim().email("E-mail inválido").max(160)]),
  funcionarios: z.enum(FAIXAS_FUNCIONARIOS, { message: "Selecione a faixa" }),
  segmento: z.enum(SEGMENTOS, { message: "Selecione o segmento" }),
  // Campo isca: pessoas não veem, robôs preenchem
  website: z.string().max(0).optional(),
});

export type LeadEscalaInput = z.input<typeof leadSchema>;

export type LeadEscalaResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function createLeadEscala6x1(input: LeadEscalaInput): Promise<LeadEscalaResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // Robô que preencheu o campo isca: finge sucesso e não grava nada
    if (fieldErrors.website) return { ok: true };
    return { ok: false, error: "Confira os campos destacados.", fieldErrors };
  }

  const { website: _ignored, ...data } = parsed.data;

  try {
    const h = await headers();
    const client = await clientPromise;
    await client
      .db("help_awer")
      .collection("leads_escala_6x1")
      .insertOne({
        ...data,
        origem: "site_escala_6x1",
        status: "novo",
        userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
        referer: h.get("referer")?.slice(0, 300) ?? null,
        createdAt: new Date(),
      });
    return { ok: true };
  } catch (err) {
    console.error("[leads] falha ao gravar lead escala 6x1", err);
    return { ok: false, error: "Não conseguimos registrar agora. Fale com a gente pelo WhatsApp." };
  }
}

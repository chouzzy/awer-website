// src/lib/leadsAdmin.ts
// Consultas da base de leads do Planejador de Escalas (help_awer.leads_escala_6x1).
// Sem verificação de acesso aqui: quem chama (server action) verifica antes.

import { Db, ObjectId } from "mongodb";

import { LEAD_STATUS, type LeadStatus } from "@/data/escala6x1";

export type { LeadStatus };

export interface LeadAdmin {
  id: string;
  nome: string;
  empresa: string;
  whatsapp: string;
  email: string;
  funcionarios: string;
  segmento: string;
  status: LeadStatus;
  nota: string;
  origem: string;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

const COLLECTION = "leads_escala_6x1";

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === "string" && LEAD_STATUS.some((s) => s.value === v);
}

export async function listLeads(db: Db): Promise<LeadAdmin[]> {
  const rows = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).limit(2000).toArray();
  return rows.map((r) => ({
    id: r._id.toString(),
    nome: r.nome ?? "",
    empresa: r.empresa ?? "",
    whatsapp: r.whatsapp ?? "",
    email: r.email ?? "",
    funcionarios: r.funcionarios ?? "",
    segmento: r.segmento ?? "",
    status: isLeadStatus(r.status) ? r.status : "novo",
    nota: r.nota ?? "",
    origem: r.origem ?? "",
    createdAt: (r.createdAt instanceof Date ? r.createdAt : r._id.getTimestamp()).toISOString(),
    updatedAt: r.updatedAt instanceof Date ? r.updatedAt.toISOString() : null,
    updatedBy: r.updatedBy ?? null,
  }));
}

export async function updateLead(
  db: Db,
  id: string,
  changes: { status?: LeadStatus; nota?: string },
  by: string,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const set: Record<string, unknown> = { updatedAt: new Date(), updatedBy: by };
  if (changes.status !== undefined) set.status = changes.status;
  if (changes.nota !== undefined) set.nota = changes.nota.slice(0, 2000);
  const res = await db.collection(COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: set });
  return res.matchedCount === 1;
}

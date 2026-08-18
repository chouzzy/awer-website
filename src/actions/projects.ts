"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export interface Projeto {
  id: string;
  nome: string;
  cliente: string;
}

/**
 * Projetos que um usuário pode ver.
 * Se o usuário for admin (@awer.co), enxerga todos os projetos ativos.
 */
export async function getProjetosDoUsuario(clientId: string): Promise<Projeto[]> {
  if (!ObjectId.isValid(clientId)) return [];

  const client = await clientPromise;
  const db = client.db("help_awer");

  const user = await db.collection("users").findOne({ _id: new ObjectId(clientId) });
  if (!user) return [];

  const ehAwer = typeof user.email === "string" && user.email.endsWith("@awer.co");

  const filtro = ehAwer
    ? { ativo: { $ne: false } }
    : { _id: { $in: (user.projectIds || []) as ObjectId[] }, ativo: { $ne: false } };

  const projetos = await db.collection("projects").find(filtro).sort({ nome: 1 }).toArray();

  return projetos.map((p) => ({
    id: p._id.toString(),
    nome: p.nome,
    cliente: p.cliente || "",
  }));
}

/**
 * Chamados de um usuário — buscados NO SERVIDOR.
 *
 * Antes, a página buscava todos os chamados de todos os clientes e mandava para o
 * navegador, deixando o filtro para o componente de tela. Isso expunha os chamados
 * de um cliente para os outros. Agora o filtro acontece aqui.
 */
export async function getTicketsDoUsuario(clientId: string) {
  if (!ObjectId.isValid(clientId)) return [];

  const client = await clientPromise;
  const db = client.db("help_awer");

  const user = await db.collection("users").findOne({ _id: new ObjectId(clientId) });
  if (!user) return [];

  const ehAwer = typeof user.email === "string" && user.email.endsWith("@awer.co");
  const meusProjetos = (user.projectIds || []) as ObjectId[];

  // Time Awer vê tudo. Cliente vê os chamados dos PROJETOS a que tem acesso
  // (não importa quem abriu — a Awer costuma registrar em nome dele) e também
  // qualquer chamado que ele mesmo tenha aberto.
  const filtro = ehAwer
    ? {}
    : {
        $or: [
          { projectId: { $in: meusProjetos } },
          { clientId: new ObjectId(clientId) },
        ],
      };

  const raw = await db.collection("tickets").find(filtro).sort({ createdAt: -1 }).toArray();

  // nomes dos projetos, para exibir junto
  const nomes = new Map<string, string>();
  const projetos = await db.collection("projects").find({}).toArray();
  for (const p of projetos) nomes.set(p._id.toString(), p.nome);

  return raw.map((t) => ({
    id: t._id.toString(),
    title: t.title || "(sem título)",
    description: t.description || "",
    status: t.status || "OPEN",
    priority: t.priority || "MEDIUM",
    attachments: t.attachments || [],
    createdAt: (t.createdAt instanceof Date ? t.createdAt : t._id.getTimestamp()).toISOString(),
    clientId: t.clientId ? t.clientId.toString() : "",
    projectId: t.projectId ? t.projectId.toString() : "",
    projectName: t.projectId ? nomes.get(t.projectId.toString()) || "" : "",
  }));
}

/** Todos os projetos ativos — usado no filtro do painel admin. */
export async function getTodosProjetos(): Promise<Projeto[]> {
  const client = await clientPromise;
  const db = client.db("help_awer");
  const projetos = await db
    .collection("projects")
    .find({ ativo: { $ne: false } })
    .sort({ nome: 1 })
    .toArray();

  return projetos.map((p) => ({
    id: p._id.toString(),
    nome: p.nome,
    cliente: p.cliente || "",
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Administração de projetos e de quem enxerga cada um
// ─────────────────────────────────────────────────────────────────────────────

export interface UsuarioComProjetos {
  id: string;
  nome: string;
  email: string;
  projetoIds: string[];
  ehAwer: boolean;
}

/** Lista os usuários e os projetos que cada um enxerga. */
export async function getUsuariosComProjetos(): Promise<UsuarioComProjetos[]> {
  const client = await clientPromise;
  const db = client.db("help_awer");
  const users = await db.collection("users").find({}).sort({ email: 1 }).toArray();

  return users.map((u) => ({
    id: u._id.toString(),
    nome: u.name || (u.email ? u.email.split("@")[0] : "(sem nome)"),
    email: u.email || "",
    projetoIds: (u.projectIds || []).map((p: ObjectId) => p.toString()),
    ehAwer: typeof u.email === "string" && u.email.endsWith("@awer.co"),
  }));
}

/** Cria um projeto. Retorna erro se já existir um com o mesmo nome. */
export async function criarProjeto(nome: string, cliente: string) {
  const limpo = (nome || "").trim();
  if (limpo.length < 2) return { success: false, error: "O nome do projeto é muito curto." };

  const client = await clientPromise;
  const db = client.db("help_awer");

  // comparação sem diferenciar maiúsculas: são poucas dezenas de projetos
  const existentes = await db.collection("projects").find({}).toArray();
  const jaTem = existentes.some(
    (p) => (p.nome || "").trim().toLowerCase() === limpo.toLowerCase()
  );
  if (jaTem) return { success: false, error: "Já existe um projeto com esse nome." };

  await db.collection("projects").insertOne({
    nome: limpo,
    cliente: (cliente || "").trim(),
    ativo: true,
    createdAt: new Date(),
  });

  revalidatePath("/awer-admin/projetos");
  revalidatePath("/help");
  return { success: true };
}

/** Liga ou desliga o acesso de um usuário a um projeto. */
export async function alternarAcesso(userId: string, projetoId: string, liberar: boolean) {
  if (!ObjectId.isValid(userId) || !ObjectId.isValid(projetoId)) {
    return { success: false, error: "Identificador inválido." };
  }

  const client = await clientPromise;
  const db = client.db("help_awer");
  const pid = new ObjectId(projetoId);

  if (liberar) {
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { projectIds: pid } }
    );
  } else {
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { projectIds: pid } } as never
    );
  }

  revalidatePath("/awer-admin/projetos");
  revalidatePath("/help");
  return { success: true };
}

/** Ativa ou desativa um projeto (não apaga — os chamados continuam existindo). */
export async function alternarProjetoAtivo(projetoId: string, ativo: boolean) {
  if (!ObjectId.isValid(projetoId)) return { success: false, error: "Identificador inválido." };

  const client = await clientPromise;
  const db = client.db("help_awer");
  await db.collection("projects").updateOne({ _id: new ObjectId(projetoId) }, { $set: { ativo } });

  revalidatePath("/awer-admin/projetos");
  revalidatePath("/help");
  return { success: true };
}

/**
 * Diz se um usuário pode abrir um chamado.
 * Regra: time Awer vê tudo; cliente vê o que é do projeto a que tem acesso,
 * ou o que ele mesmo abriu. Antes a checagem era só pelo dono do chamado, o
 * que escondia do cliente os chamados que a Awer registrou em nome dele.
 */
export async function podeVerTicket(clientId: string, ticketId: string): Promise<boolean> {
  if (!ObjectId.isValid(clientId) || !ObjectId.isValid(ticketId)) return false;

  const client = await clientPromise;
  const db = client.db("help_awer");

  const [user, ticket] = await Promise.all([
    db.collection("users").findOne({ _id: new ObjectId(clientId) }),
    db.collection("tickets").findOne({ _id: new ObjectId(ticketId) }),
  ]);
  if (!user || !ticket) return false;

  if (typeof user.email === "string" && user.email.endsWith("@awer.co")) return true;
  if (ticket.clientId && ticket.clientId.toString() === clientId) return true;

  const meus = (user.projectIds || []).map((p: ObjectId) => p.toString());
  return !!ticket.projectId && meus.includes(ticket.projectId.toString());
}

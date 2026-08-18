#!/usr/bin/env node
/**
 * Help Awer — CLI para registrar chamados a partir do que o cliente mandou
 * por WhatsApp/e-mail, sem depender de o cliente abrir o chamado.
 *
 * USO
 *   node scripts/ticket.mjs clientes
 *   node scripts/ticket.mjs listar [--status OPEN]
 *   node scripts/ticket.mjs criar --cliente <email|id> --projeto "Stech — Portal do Aluno" --titulo "..." --desc "..." [--prioridade HIGH] [--confirmar]
 *
 * Sem --confirmar, o comando "criar" só mostra o que seria gravado (dry-run).
 *
 * PRIORIDADES: LOW | MEDIUM | HIGH | URGENT   (padrão: MEDIUM)
 * STATUS:      OPEN | IN_PROGRESS | RESOLVED | CLOSED
 */
import { MongoClient, ObjectId } from "mongodb";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function carregarEnv() {
  for (const arq of [".env.local", ".env"]) {
    const caminho = resolve(raiz, arq);
    if (!existsSync(caminho)) continue;
    for (const linha of readFileSync(caminho, "utf8").split("\n")) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

const args = process.argv.slice(2);
const comando = args[0];
function opt(nome, padrao = null) {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : padrao;
}
const temFlag = (nome) => args.includes(`--${nome}`);

const PRIORIDADES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const CORES = { LOW: "[baixa]", MEDIUM: "[media]", HIGH: "[ALTA]", URGENT: "[URGENTE]" };

const AJUDA = `
Help Awer — registrar chamados pelo terminal

  node scripts/ticket.mjs clientes
  node scripts/ticket.mjs listar [--status OPEN]
  node scripts/ticket.mjs criar --cliente <email|id> --projeto "Stech — Portal do Aluno" --titulo "..." --desc "..." [--prioridade HIGH] [--confirmar]

Sem --confirmar, o comando "criar" apenas mostra o que seria gravado.
`;

async function cmdClientes(db) {
  const users = await db.collection("users").find({}).sort({ name: 1 }).toArray();
  if (users.length === 0) {
    console.log("Nenhum cliente cadastrado.");
    return;
  }
  console.log(`\n${users.length} cliente(s):\n`);
  for (const u of users) {
    const nome = (u.name || "(sem nome)").padEnd(30);
    const email = (u.email || "-").padEnd(35);
    console.log(`  ${nome} ${email} ${u._id}`);
  }
  console.log();
}

async function cmdListar(db) {
  const filtro = opt("status") ? { status: opt("status") } : {};
  const tickets = await db
    .collection("tickets")
    .find(filtro)
    .sort({ createdAt: -1 })
    .limit(40)
    .toArray();

  if (tickets.length === 0) {
    console.log("Nenhum chamado encontrado.");
    return;
  }
  console.log(`\n${tickets.length} chamado(s):\n`);
  for (const t of tickets) {
    const dt = t.createdAt instanceof Date ? t.createdAt : t._id.getTimestamp();
    const data = dt.toLocaleDateString("pt-BR");
    const p = CORES[t.priority] || "[--]";
    const st = (t.status || "OPEN").padEnd(12);
    console.log(`  ${p} [${st}] ${data}  ${t.title || "(sem titulo)"}`);
    console.log(`     id: ${t._id}`);
  }
  console.log();
}

async function cmdCriar(db) {
  const alvo = opt("cliente");
  const nomeProjeto = opt("projeto");
  const titulo = opt("titulo");
  const desc = opt("desc");
  const prioridade = (opt("prioridade") || "MEDIUM").toUpperCase();

  if (!alvo || !titulo || !desc) {
    console.error("Faltou argumento.");
    console.error('Ex.: node scripts/ticket.mjs criar --cliente joao@x.com --titulo "Kahoot entra na sala errada" --desc "O aluno clica no Kahoot novo e cai no do dia anterior." --prioridade URGENT');
    process.exitCode = 1;
    return;
  }
  if (!PRIORIDADES.includes(prioridade)) {
    console.error(`Prioridade invalida: ${prioridade}. Use ${PRIORIDADES.join(" | ")}`);
    process.exitCode = 1;
    return;
  }
  if (titulo.length < 5) {
    console.error("O titulo precisa de pelo menos 5 caracteres (mesma regra do formulario).");
    process.exitCode = 1;
    return;
  }
  if (desc.length < 10) {
    console.error("A descricao precisa de pelo menos 10 caracteres (mesma regra do formulario).");
    process.exitCode = 1;
    return;
  }

  const users = db.collection("users");
  let dono = null;
  if (ObjectId.isValid(alvo)) dono = await users.findOne({ _id: new ObjectId(alvo) });
  if (!dono) dono = await users.findOne({ email: alvo });
  if (!dono) dono = await users.findOne({ name: { $regex: alvo, $options: "i" } });

  if (!dono) {
    console.error(`Cliente nao encontrado: "${alvo}"`);
    console.error("Rode 'node scripts/ticket.mjs clientes' para ver a lista.");
    process.exitCode = 1;
    return;
  }

  // resolve o projeto pelo nome (sem diferenciar maiúsculas)
  let projeto = null;
  if (nomeProjeto) {
    const todos = await db.collection("projects").find({}).toArray();
    projeto = todos.find(
      (p) => (p.nome || "").trim().toLowerCase() === nomeProjeto.trim().toLowerCase()
    );
    if (!projeto) {
      console.error(`Projeto nao encontrado: "${nomeProjeto}"`);
      console.error("Rode 'node scripts/projetos.mjs listar' para ver os nomes.");
      process.exitCode = 1;
      return;
    }
  }

  const novo = {
    title: titulo,
    description: desc,
    priority: prioridade,
    clientId: dono._id,
    status: "OPEN",
    attachments: [],
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    registradoPor: "awer-cli",
    ...(projeto ? { projectId: projeto._id } : {}),
  };

  console.log("\n---------- CHAMADO A REGISTRAR ----------");
  console.log(`  Cliente    : ${dono.name || "(sem nome)"} <${dono.email || "-"}>`);
  console.log(`  Projeto    : ${projeto ? projeto.nome : "(NENHUM — passe --projeto)"}`);
  console.log(`  Titulo     : ${novo.title}`);
  console.log(`  Prioridade : ${CORES[prioridade]} ${prioridade}`);
  console.log(`  Descricao  : ${novo.description}`);
  console.log("----------------------------------------");

  if (!temFlag("confirmar")) {
    console.log("\nDRY-RUN — nada foi gravado.");
    console.log("Para registrar de verdade, repita o comando com --confirmar\n");
    return;
  }

  const r = await db.collection("tickets").insertOne(novo);
  console.log("\nChamado registrado.");
  console.log(`  id : ${r.insertedId}`);
  console.log(`  ver: https://www.awer.co/awer-admin/tickets/${r.insertedId}\n`);
}

async function main() {
  carregarEnv();
  const URI = process.env.HELPAWER_DATABASE_URL;
  if (!URI) {
    console.error("HELPAWER_DATABASE_URL nao encontrada no .env.local");
    process.exitCode = 1;
    return;
  }

  if (!comando || !["clientes", "listar", "criar"].includes(comando)) {
    console.log(AJUDA);
    return;
  }

  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db("help_awer");
    if (comando === "clientes") await cmdClientes(db);
    else if (comando === "listar") await cmdListar(db);
    else if (comando === "criar") await cmdCriar(db);
  } catch (e) {
    console.error("Erro:", e.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

await main();

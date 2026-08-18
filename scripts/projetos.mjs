#!/usr/bin/env node
/**
 * Help Awer — gestão de projetos e de quem enxerga o quê.
 *
 *   node scripts/projetos.mjs listar
 *   node scripts/projetos.mjs criar --nome "PDBot" --cliente "Paulista Distressed"  [--confirmar]
 *   node scripts/projetos.mjs vincular --usuario <email> --projeto "PDBot"          [--confirmar]
 *   node scripts/projetos.mjs desvincular --usuario <email> --projeto "PDBot"       [--confirmar]
 *   node scripts/projetos.mjs atribuir --projeto "PDBot" --busca "PDBot"            [--confirmar]
 *       (marca os chamados cujo título contém --busca como sendo do projeto)
 *   node scripts/projetos.mjs semprojeto
 *       (lista os chamados que ainda não têm projeto)
 *
 * Sem --confirmar, tudo roda em dry-run.
 */
import { MongoClient, ObjectId } from "mongodb";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const arq of [".env.local", ".env"]) {
  const caminho = resolve(raiz, arq);
  if (!existsSync(caminho)) continue;
  for (const linha of readFileSync(caminho, "utf8").split("\n")) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (n, d = null) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d;
};
const confirmar = args.includes("--confirmar");
const AJUDA = `
Help Awer — projetos

  node scripts/projetos.mjs listar
  node scripts/projetos.mjs criar --nome "PDBot" --cliente "Paulista Distressed" [--confirmar]
  node scripts/projetos.mjs vincular --usuario <email> --projeto "PDBot" [--confirmar]
  node scripts/projetos.mjs desvincular --usuario <email> --projeto "PDBot" [--confirmar]
  node scripts/projetos.mjs atribuir --projeto "PDBot" --busca "PDBot" [--confirmar]
  node scripts/projetos.mjs semprojeto

Sem --confirmar, roda em dry-run.
`;

async function acharProjeto(db, nome) {
  if (ObjectId.isValid(nome)) {
    const p = await db.collection("projects").findOne({ _id: new ObjectId(nome) });
    if (p) return p;
  }
  return db.collection("projects").findOne({ nome: { $regex: `^${nome}$`, $options: "i" } });
}

async function main() {
  const URI = process.env.HELPAWER_DATABASE_URL;
  if (!URI) {
    console.error("HELPAWER_DATABASE_URL nao encontrada");
    process.exitCode = 1;
    return;
  }
  if (!cmd || !["listar", "criar", "vincular", "desvincular", "atribuir", "semprojeto"].includes(cmd)) {
    console.log(AJUDA);
    return;
  }

  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db("help_awer");
    const projetos = db.collection("projects");
    const users = db.collection("users");
    const tickets = db.collection("tickets");

    // ---------------- LISTAR ----------------
    if (cmd === "listar") {
      const ps = await projetos.find({}).sort({ cliente: 1, nome: 1 }).toArray();
      if (ps.length === 0) {
        console.log("Nenhum projeto cadastrado.");
      } else {
        console.log(`\n${ps.length} projeto(s):\n`);
        for (const p of ps) {
          const qtd = await tickets.countDocuments({ projectId: p._id });
          const quem = await users.countDocuments({ projectIds: p._id });
          const flag = p.ativo === false ? " [inativo]" : "";
          console.log(`  ${p.nome.padEnd(28)} ${(p.cliente || "-").padEnd(28)} ${String(qtd).padStart(3)} chamados  ${quem} usuario(s)${flag}`);
        }
        console.log();
      }
    }

    // ---------------- CRIAR ----------------
    else if (cmd === "criar") {
      const nome = opt("nome");
      const cliente = opt("cliente") || "";
      if (!nome) {
        console.error('Faltou --nome. Ex.: --nome "PDBot" --cliente "Paulista Distressed"');
        process.exitCode = 1;
        return;
      }
      const jaTem = await acharProjeto(db, nome);
      if (jaTem) {
        console.log(`Projeto "${nome}" ja existe (id ${jaTem._id}).`);
        return;
      }
      console.log(`\nCriar projeto: ${nome}  |  cliente: ${cliente || "(vazio)"}`);
      if (!confirmar) {
        console.log("DRY-RUN — nada gravado. Use --confirmar.\n");
      } else {
        const r = await projetos.insertOne({ nome, cliente, ativo: true, createdAt: new Date() });
        console.log(`Criado. id: ${r.insertedId}\n`);
      }
    }

    // ---------------- VINCULAR / DESVINCULAR ----------------
    else if (cmd === "vincular" || cmd === "desvincular") {
      const email = opt("usuario");
      const nomeProj = opt("projeto");
      if (!email || !nomeProj) {
        console.error("Faltou --usuario <email> e/ou --projeto <nome>");
        process.exitCode = 1;
        return;
      }
      const u = await users.findOne({ email });
      if (!u) {
        console.error(`Usuario nao encontrado: ${email}`);
        process.exitCode = 1;
        return;
      }
      const p = await acharProjeto(db, nomeProj);
      if (!p) {
        console.error(`Projeto nao encontrado: ${nomeProj}`);
        process.exitCode = 1;
        return;
      }
      const acao = cmd === "vincular" ? "VINCULAR" : "DESVINCULAR";
      console.log(`\n${acao}: ${u.email}  <->  ${p.nome}`);
      if (!confirmar) {
        console.log("DRY-RUN — nada gravado. Use --confirmar.\n");
      } else {
        const update = cmd === "vincular"
          ? { $addToSet: { projectIds: p._id } }
          : { $pull: { projectIds: p._id } };
        await users.updateOne({ _id: u._id }, update);
        console.log("Feito.\n");
      }
    }

    // ---------------- ATRIBUIR chamados a um projeto ----------------
    else if (cmd === "atribuir") {
      const nomeProj = opt("projeto");
      const busca = opt("busca");
      if (!nomeProj || !busca) {
        console.error('Faltou --projeto e/ou --busca. Ex.: --projeto "PDBot" --busca "PDBot"');
        process.exitCode = 1;
        return;
      }
      const p = await acharProjeto(db, nomeProj);
      if (!p) {
        console.error(`Projeto nao encontrado: ${nomeProj}`);
        process.exitCode = 1;
        return;
      }
      const filtro = { title: { $regex: busca, $options: "i" }, projectId: { $exists: false } };
      const alvo = await tickets.find(filtro).toArray();
      console.log(`\n${alvo.length} chamado(s) sem projeto contendo "${busca}" -> ${p.nome}:\n`);
      for (const t of alvo) console.log(`   ${t.title}`);
      if (!confirmar) {
        console.log("\nDRY-RUN — nada gravado. Use --confirmar.\n");
      } else {
        const r = await tickets.updateMany(filtro, { $set: { projectId: p._id, updatedAt: new Date() } });
        console.log(`\n${r.modifiedCount} chamado(s) atribuido(s) a ${p.nome}.\n`);
      }
    }

    // ---------------- SEM PROJETO ----------------
    else if (cmd === "semprojeto") {
      const alvo = await tickets.find({ projectId: { $exists: false } }).sort({ createdAt: -1 }).toArray();
      console.log(`\n${alvo.length} chamado(s) sem projeto:\n`);
      for (const t of alvo) console.log(`   ${t.title}`);
      console.log();
    }
  } catch (e) {
    console.error("Erro:", e.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

await main();

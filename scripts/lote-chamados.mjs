#!/usr/bin/env node
/**
 * Registra em lote os chamados que já estavam mapeados fora do sistema
 * (backlog da Stech + pendências de Cannova e Mazzotini).
 *
 * Vincula tudo a uma conta interna da Awer. Quando o cliente criar a conta
 * dele de verdade (login Auth0), use scripts/transferir.mjs para reapontar.
 *
 *   node scripts/lote-chamados.mjs            -> dry-run, só mostra
 *   node scripts/lote-chamados.mjs --confirmar -> grava
 */
import { MongoClient } from "mongodb";
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

const CONFIRMAR = process.argv.includes("--confirmar");
const EMAIL_INTERNO = "admin@awer.co";

// ordem = ordem da fila. Os URGENT são os que furam a fila.
const CHAMADOS = [
  // ---------------- STECH ----------------
  {
    cliente: "Stech",
    priority: "URGENT",
    title: "Stech — Kahoot abre a sala do dia anterior, sem pedir o código",
    description:
      "O aluno clica para entrar no Kahoot novo, o campo do código não aparece, e ele cai direto no Kahoot que o professor criou no dia anterior. Trava a participação na aula do dia. Apareceu depois da correção do polling — verificar se a sessão ativa está sendo resolvida por 'última criada' em vez de 'a da aula atual'.",
  },
  {
    cliente: "Stech",
    priority: "URGENT",
    title: "Stech — aluno só avança de aula ao completar 100% dos exercícios",
    description:
      "Relato do professor: os alunos só conseguem ir para a próxima aula quando completam 100% dos exercícios. INVESTIGAR PRIMEIRO se a regra é 100% dos exercícios concluídos ou nota 100%. Se for nota, é bug (exigir gabarito perfeito trava a turma). Se for conclusão, é decisão de regra de negócio: definir com a Stech se o aluno pode assistir a próxima aula sem ter fechado a lista.",
  },
  {
    cliente: "Stech",
    priority: "URGENT",
    title: "Stech — aluno Kelvin não consegue entrar na plataforma",
    description:
      "O aluno Kelvin não consegue acessar. Verificar se é o mesmo padrão do bloqueio por tentativas que já apareceu antes (erro de excesso de tentativas sem o aluno ter tentado).",
  },
  {
    cliente: "Stech",
    priority: "HIGH",
    title: "Stech — remover prêmios indevidos da loja (cesta básica e outros)",
    description:
      "Há itens cadastrados na loja de recompensas que não podem estar lá, entre eles cesta básica. Risco não-técnico. Confirmar com a Stech quais prêmios podem permanecer antes de recadastrar qualquer coisa.",
  },
  {
    cliente: "Stech",
    priority: "HIGH",
    title: "Stech — professor não consegue passar os slides pelo controle",
    description:
      "O controle não avança os slides durante a aula. Pedido deles: disponibilizar um link externo que abra o PPT diretamente. Alternativa levantada: um botão de download do arquivo.",
  },
  {
    cliente: "Stech",
    priority: "MEDIUM",
    title: "Stech — avaliação não mostra confirmação de que foi concluída",
    description:
      "O aluno termina a avaliação e não recebe nenhum sinal visual de que ela foi enviada/concluída. Está gerando reclamação: o aluno fica sem saber se a resposta foi registrada.",
  },
  {
    cliente: "Stech",
    priority: "MEDIUM",
    title: "Stech — aulas práticas não aparecem na plataforma (calendário + módulo mão na massa)",
    description:
      "Duas demandas sobre o mesmo assunto: (1) incluir as aulas práticas no calendário, porque só as fotos não estão bastando para o aluno se orientar; (2) pedido do Lucas Laion de um módulo do tipo 'mão na massa' para as práticas em sala, que permita justificar os gaps de confecção. Sugere necessidade de registro de atividade prática, não apenas de listagem. Alinhar o produto com a Stech antes de desenvolver.",
  },
  {
    cliente: "Stech",
    priority: "MEDIUM",
    title: "Stech — cadastrar as datas da pré-jornada",
    description:
      "Passar as datas da pré-jornada na plataforma. São aproximadamente 5 dias — confirmar o número exato e as datas com a Stech.",
  },
  {
    cliente: "Stech",
    priority: "LOW",
    title: "Stech — criar o fluxo de desistência do aluno",
    description:
      "Feature: quando um aluno desiste, ele perde o acesso, o admin registra o motivo da desistência, e o aluno passa a exibir um ícone/marcação de DESISTENTE.",
  },

  // ---------------- SISTEMA MAZZOTINI ----------------
  {
    cliente: "Mazzotini",
    priority: "HIGH",
    title: "Sistema Mazzotini — e-mail de verificação não chega ao cliente (causa raiz)",
    description:
      "Um cliente não recebeu o e-mail de verificação (não chegou nem na caixa de spam). Paliativo já entregue: botão para o admin validar o e-mail manualmente. FALTA A CAUSA RAIZ — provável problema de entrega (SPF, DKIM, reputação do domínio remetente), não de código. Sem resolver, o problema se repete com os próximos clientes.",
  },

  // ---------------- CANNOVA ----------------
  {
    cliente: "Cannova",
    priority: "HIGH",
    title: "Cannova — responder o e-mail da loja Augusta sobre a troca de embalagem",
    description:
      "A loja Augusta enviou em 10/08 a relação dos itens trocados por embalagem e pediu definição: repor as unidades faltantes ou emitir nota de retorno. Análise já concluída: faltam 18 unidades, sobra 1 difusor de chá e citron, e há 2 linhas com erro na tabela deles ('creme hidratante folha seca' e 'difusor folha seca' marcam FALTOU 1, mas saiu 2 e voltou 2). Esclarecer essas 2 linhas antes de fechar o número — com elas, seriam 20 unidades.",
  },
  {
    cliente: "Cannova",
    priority: "MEDIUM",
    title: "Cannova — emitir as notas fiscais das vendas de julho",
    description:
      "Emitir as notas das vendas de julho registradas na planilha: Silvana Gallo, Rafaela Lemos, Tomie Sakamoto, Renata Silveira, Vera Siqueira e Lavinia, mais as duas retiradas (Marcia vendedora e Cristina Martins).",
  },
  {
    cliente: "Cannova",
    priority: "MEDIUM",
    title: "Cannova — pedir o romaneio e as vendas faltantes da Varanda Orgânica",
    description:
      "O estoque da Varanda Orgânica não fecha: os romaneios somam 42 unidades enviadas, mas a contagem da loja em 08/08 tem 47 — 5 a mais do que foi enviado, sobrando principalmente creme hidratante (10) e sabonete (3). Pedir ao Fenólio/Cannova o envio que não teve romaneio emitido e a planilha de vendas da Varanda, que não existe.",
  },
];

const client = new MongoClient(process.env.HELPAWER_DATABASE_URL);
try {
  await client.connect();
  const db = client.db("help_awer");
  const dono = await db.collection("users").findOne({ email: EMAIL_INTERNO });
  if (!dono) throw new Error(`conta interna ${EMAIL_INTERNO} não encontrada`);

  const agora = new Date();
  const docs = CHAMADOS.map((c, i) => ({
    title: c.title,
    description: c.description,
    priority: c.priority,
    clientId: dono._id,
    status: "OPEN",
    attachments: [],
    messages: [],
    createdAt: new Date(agora.getTime() + i * 1000), // mantém a ordem da fila
    updatedAt: agora,
    registradoPor: "awer-cli",
    clienteNome: c.cliente, // para transferir depois para a conta real
  }));

  const porCliente = {};
  for (const c of CHAMADOS) porCliente[c.cliente] = (porCliente[c.cliente] || 0) + 1;

  console.log(`\n${CHAMADOS.length} chamados a registrar:\n`);
  for (const [k, v] of Object.entries(porCliente)) console.log(`   ${k}: ${v}`);
  console.log();
  for (const c of CHAMADOS) console.log(`   [${c.priority.padEnd(6)}] ${c.title}`);

  if (!CONFIRMAR) {
    console.log("\nDRY-RUN — nada gravado. Rode com --confirmar para registrar.\n");
  } else {
    const r = await db.collection("tickets").insertMany(docs);
    console.log(`\n${r.insertedCount} chamados registrados.`);
    console.log("Ver em: https://www.awer.co/awer-admin/tickets\n");
  }
} catch (e) {
  console.error("Erro:", e.message);
  process.exitCode = 1;
} finally {
  await client.close();
}

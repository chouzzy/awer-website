// src/data/escala6x1.ts
// Conteúdo da página /escala-6x1 (Planejador de Escalas 6x1).
// Fatos legais conferidos em 16/10/2026: Senado aprovou a PEC 221/2019 em 14/10/2026 (75 x 1),
// mesmo texto da Câmara, segue para promulgação. Revisar quando a Emenda for promulgada.

export const FAIXAS_FUNCIONARIOS = ["Até 20", "21 a 50", "51 a 200", "Mais de 200"] as const;

export const SEGMENTOS = [
  "Varejo",
  "Supermercado",
  "Farmácia ou saúde",
  "Indústria",
  "Serviços",
  "Outro",
] as const;

// Etapas do lead na base do admin (/awer-admin/leads)
export const LEAD_STATUS = [
  { value: "novo", label: "Novo", color: "brand.400" },
  { value: "em_contato", label: "Em contato", color: "blue.300" },
  { value: "diagnostico", label: "Diagnóstico", color: "purple.300" },
  { value: "proposta", label: "Proposta", color: "orange.300" },
  { value: "cliente", label: "Cliente", color: "green.300" },
  { value: "descartado", label: "Descartado", color: "gray.500" },
] as const;

export type LeadStatus = (typeof LEAD_STATUS)[number]["value"];

export const escala6x1Video = {
  src: "/escala-6x1/planejador-escalas-6x1.mp4",
  poster: "/escala-6x1/planejador-escalas-6x1-capa.webp",
};

export const linhaDoTempo = [
  {
    quando: "14/10/2026",
    titulo: "Senado conclui a votação",
    texto: "PEC 221/2019 aprovada com o mesmo texto da Câmara. Segue para promulgação.",
  },
  {
    quando: "Promulgação + 60 dias",
    titulo: "Escala 5x2 e 42 horas",
    texto: "Duas folgas por semana e jornada máxima de 42 horas, sem redução de salário.",
  },
  {
    quando: "+ 12 meses",
    titulo: "40 horas semanais",
    texto: "A jornada máxima cai para 40 horas. Mais gente para cobrir o mesmo horário.",
  },
];

export const comoAjudamos = [
  {
    passo: "01",
    titulo: "Diagnóstico com números",
    texto:
      "Com o Planejador de Escalas, calculamos quantas pessoas a mais cada função vai precisar em cada etapa e quanto isso custa por mês e por ano.",
  },
  {
    passo: "02",
    titulo: "Plano de ação",
    texto:
      "Comparamos os caminhos (contratar, hora extra, jornada parcial ou reorganizar escalas) e buscamos no resto do negócio o resultado que compensa o novo custo: preço, margem, compras e despesas.",
  },
  {
    passo: "03",
    titulo: "Acompanhamento",
    texto:
      "Seguimos junto com você na execução, mês a mês, medindo se o plano está entregando o resultado esperado e ajustando o que for preciso.",
  },
];

export const recursosPlanejador = [
  { titulo: "Quadro por grupo", texto: "Quantas pessoas a mais cada função precisa, etapa por etapa." },
  { titulo: "Custo detalhado", texto: "Salários, encargos, benefícios, custo único e projeção mês a mês." },
  { titulo: "Rotas comparáveis", texto: "Contratar, hora extra, jornada parcial ou reorganização." },
  { titulo: "Escalas com datas reais", texto: "Turnos, folgas, cobertura hora a hora e validação das regras." },
  { titulo: "Cenários lado a lado", texto: "Compare escalas e consolide a empresa inteira." },
  { titulo: "Premissas transparentes", texto: "Fato, premissa e pendência separados e ajustáveis." },
];

export const avisoLegal =
  "Ferramenta de diagnóstico: estima ordem de grandeza e não substitui a convenção coletiva nem a validação jurídica.";

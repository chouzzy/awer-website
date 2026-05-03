import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inteligência Artificial para Empresas",
  description:
    "Integre IA no seu negócio: chatbots, análise de dados, automação inteligente e geração de conteúdo. Implementamos Gemini, OpenAI e Claude nos seus processos. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/tecnologia/ai" },
  openGraph: {
    title: "Inteligência Artificial para Empresas | Awer Consultoria",
    description:
      "Integre IA no seu negócio: chatbots, análise de dados, automação inteligente e geração de conteúdo com Gemini, OpenAI e Claude.",
    url: "https://www.awer.co/tecnologia/ai",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

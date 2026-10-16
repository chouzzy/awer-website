import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fim da Escala 6x1: Planejador de Escalas",
  description:
    "A PEC do fim da escala 6x1 foi aprovada. Descubra quantas pessoas a mais sua operação vai precisar, quanto isso custa e como reorganizar as escalas sem perder resultado. Planejador de Escalas da Awer.",
  alternates: { canonical: "https://www.awer.co/escala-6x1" },
  openGraph: {
    title: "Fim da Escala 6x1: quanto vai custar para a sua empresa? | Awer Consultoria",
    description:
      "Planejador de Escalas da Awer: quadro por função, custo detalhado e o melhor caminho para a nova jornada, com plano de ação e acompanhamento.",
    url: "https://www.awer.co/escala-6x1",
    images: [{ url: "/gestao/planejador-escalas-6x1.jpg", width: 1440, height: 960 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

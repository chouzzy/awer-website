import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acompanhamento de Desempenho Comercial",
  description:
    "KPIs, dashboards em tempo real e reuniões periódicas de revisão para tomar decisões baseadas em dados. Pare de gerir no achismo. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/gestao/acompanhamento-desempenho" },
  openGraph: {
    title: "Acompanhamento de Desempenho Comercial | Awer Consultoria",
    description:
      "KPIs, dashboards em tempo real e reuniões de revisão periódicas para tomar decisões baseadas em dados reais.",
    url: "https://www.awer.co/gestao/acompanhamento-desempenho",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria de Gestão e Estratégia Empresarial",
  description:
    "Planejamento estratégico, OKRs, reestruturação de processos e diagnóstico organizacional para PMEs. Consultoria com diagnóstico gratuito. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/gestao/gestao-estrategia" },
  openGraph: {
    title: "Consultoria de Gestão e Estratégia | Awer Consultoria",
    description:
      "Planejamento estratégico, OKRs, reestruturação de processos e diagnóstico organizacional para PMEs.",
    url: "https://www.awer.co/gestao/gestao-estrategia",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

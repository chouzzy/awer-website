import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria em Gestão Financeira para PMEs",
  description:
    "Fluxo de caixa, DRE, planejamento orçamentário e precificação para PMEs. Sua empresa fatura mas não sobra? Temos a solução. Awer Consultoria, Florianópolis.",
  alternates: { canonical: "https://www.awer.co/gestao/gestao-financeira" },
  openGraph: {
    title: "Consultoria em Gestão Financeira para PMEs | Awer Consultoria",
    description:
      "Fluxo de caixa, DRE, planejamento orçamentário e precificação. Clareza financeira para decisões assertivas em PMEs.",
    url: "https://www.awer.co/gestao/gestao-financeira",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

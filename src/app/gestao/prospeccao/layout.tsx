import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria em Prospecção de Clientes",
  description:
    "Defina seu ICP, mapeie o mercado e construa cadências de prospecção eficazes via LinkedIn e email outbound. Mais reuniões com os clientes certos. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/gestao/prospeccao" },
  openGraph: {
    title: "Consultoria em Prospecção de Clientes | Awer Consultoria",
    description:
      "Defina seu ICP, mapeie o mercado e construa cadências de prospecção via LinkedIn e email outbound. Mais reuniões com os clientes certos.",
    url: "https://www.awer.co/gestao/prospeccao",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

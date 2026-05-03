import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria Comercial e de Vendas",
  description:
    "Estruture seu funil de vendas, defina metas e crie um playbook comercial eficaz. Consultoria para aumentar receita de forma previsível. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/gestao/comercial-vendas" },
  openGraph: {
    title: "Consultoria Comercial e de Vendas | Awer Consultoria",
    description:
      "Estruture seu funil de vendas, defina metas e crie um playbook comercial eficaz para aumentar receita de forma previsível.",
    url: "https://www.awer.co/gestao/comercial-vendas",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

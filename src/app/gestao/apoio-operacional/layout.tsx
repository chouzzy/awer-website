import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria para Apoio Operacional",
  description:
    "Mapeamento de processos, otimização de fluxos e identificação de automações para escalar sua operação sem caos. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/gestao/apoio-operacional" },
  openGraph: {
    title: "Consultoria para Apoio Operacional | Awer Consultoria",
    description:
      "Mapeamento de processos, otimização de fluxos e automação para escalar sua operação sem aumentar o caos.",
    url: "https://www.awer.co/gestao/apoio-operacional",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

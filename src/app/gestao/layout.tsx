import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultoria de Gestão Empresarial",
  description:
    "Consultoria especializada em gestão financeira, comercial, prospecção, estratégia e operações para PMEs. Diagnóstico gratuito. Awer Consultoria, Florianópolis.",
  alternates: { canonical: "https://www.awer.co/consultoria" },
  openGraph: {
    title: "Consultoria de Gestão Empresarial | Awer Consultoria",
    description:
      "Consultoria especializada em gestão financeira, comercial, prospecção, estratégia e operações. Diagnóstico gratuito para PMEs.",
    url: "https://www.awer.co/consultoria",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

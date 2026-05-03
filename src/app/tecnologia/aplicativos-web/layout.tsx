import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desenvolvimento de Aplicações Web",
  description:
    "Desenvolvimento fullstack com Next.js, Node.js e MongoDB. APIs robustas, autenticação Auth0, deploy em nuvem e integrações com qualquer serviço. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/tecnologia/aplicativos-web" },
  openGraph: {
    title: "Desenvolvimento de Aplicações Web | Awer Consultoria",
    description:
      "Desenvolvimento fullstack com Next.js, Node.js e MongoDB. APIs robustas, autenticação, deploy em nuvem e integrações completas.",
    url: "https://www.awer.co/tecnologia/aplicativos-web",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Scraping e Crawlers Profissionais",
  description:
    "Coleta automatizada de dados da web com Puppeteer e Playwright. Monitoramento de mercado, alertas de mudança e exportação para CSV, JSON ou banco de dados. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/tecnologia/crawlers" },
  openGraph: {
    title: "Web Scraping e Crawlers Profissionais | Awer Consultoria",
    description:
      "Coleta automatizada de dados da web com Puppeteer e Playwright. Monitoramento de mercado e exportação em múltiplos formatos.",
    url: "https://www.awer.co/tecnologia/crawlers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

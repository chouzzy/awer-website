import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce Headless de Alta Performance",
  description:
    "Lojas virtuais headless com Next.js e Shopify: design exclusivo, PageSpeed 90+, checkout otimizado e SEO avançado. Aumente suas conversões. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/tecnologia/ecommerce" },
  openGraph: {
    title: "E-commerce Headless de Alta Performance | Awer Consultoria",
    description:
      "Lojas virtuais headless com Next.js e Shopify: design exclusivo, PageSpeed 90+, checkout otimizado e SEO avançado.",
    url: "https://www.awer.co/tecnologia/ecommerce",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

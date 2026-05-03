import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluções Tecnológicas",
  description:
    "Desenvolvimento de software sob medida: e-commerce headless, aplicações web, IA, crawlers e landing pages de alta performance. Awer Consultoria, Florianópolis.",
  alternates: { canonical: "https://www.awer.co/tecnologia" },
  openGraph: {
    title: "Soluções Tecnológicas | Awer Consultoria",
    description:
      "Desenvolvimento de software sob medida: e-commerce headless, aplicações web, IA, crawlers e landing pages de alta performance.",
    url: "https://www.awer.co/tecnologia",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

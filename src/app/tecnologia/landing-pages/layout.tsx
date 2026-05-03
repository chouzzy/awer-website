import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Pages de Alta Conversão",
  description:
    "Landing pages profissionais com Google PageSpeed 90+, tracking completo e integrações com HubSpot, RD Station e Mailchimp. Maximize o ROI das suas campanhas. Awer Consultoria.",
  alternates: { canonical: "https://www.awer.co/tecnologia/landing-pages" },
  openGraph: {
    title: "Landing Pages de Alta Conversão | Awer Consultoria",
    description:
      "Landing pages profissionais com Google PageSpeed 90+, tracking completo e integrações com as principais ferramentas de marketing.",
    url: "https://www.awer.co/tecnologia/landing-pages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

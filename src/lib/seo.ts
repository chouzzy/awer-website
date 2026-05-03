import type { Metadata } from "next";

export const siteConfig = {
  name: "Awer Consultoria",
  url: "https://www.awer.co",
  description:
    "Awer Consultoria — tecnologia sob medida e consultoria estratégica para pequenas e médias empresas. Automação, e-commerce, aplicações web, IA e gestão financeira.",
  logo: "https://www.awer.co/main/logo.svg",
  ogImage: "https://www.awer.co/og-image.png",
  twitter: "@awerconsultoria",
  instagram: "https://www.instagram.com/awer.consultoria/",
  linkedin:
    "https://br.linkedin.com/company/awer-assessoria-de-gest%C3%A3o-e-solu%C3%A7%C3%B5es-tecnol%C3%B3gicas",
  whatsapp: "https://wa.me/5511939437893",
  address: {
    street: "Av. Prof. Othon Gama D'Eça, 677",
    city: "Florianópolis",
    state: "SC",
    zip: "88015-240",
    country: "BR",
  },
  phone: "+55 11 93943-7893",
  email: "danilo@awer.co",
};

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

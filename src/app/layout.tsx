// src/app/layout.tsx
import './global.css'
import type { Metadata } from "next";
import Provider from "./providers"
import { Header } from "@/components/layout/Header";
import { Container, Flex, Image } from "@chakra-ui/react";
import { Footer } from "@/components/layout/Footer";
import { BottomFooter } from "@/components/layout/BottomFooter";
import { Auth0ProviderWithHistory } from '@/components/providers/Auth0ProviderWithHistory';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner';
import WhatsButton from '@/components/ui/WhatsButton';
import GoogleTagManager from '@/components/GoogleTagManager';
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from '@/components/ui/toaster'


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.awer.co"),
  title: {
    default: "Awer Consultoria — Tecnologia e Gestão para PMEs",
    template: "%s | Awer Consultoria",
  },
  description:
    "Awer Consultoria: tecnologia sob medida e consultoria estratégica para PMEs. Automação, e-commerce headless, aplicações web, IA e gestão financeira em Florianópolis.",
  keywords: [
    "consultoria empresarial",
    "tecnologia para empresas",
    "automação de processos",
    "e-commerce headless",
    "aplicações web",
    "inteligência artificial",
    "gestão financeira",
    "consultoria Florianópolis",
    "desenvolvimento de software",
    "BotRT",
  ],
  authors: [{ name: "Awer Consultoria", url: "https://www.awer.co" }],
  creator: "Awer Consultoria",
  publisher: "Awer Consultoria",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://www.awer.co" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.awer.co",
    siteName: "Awer Consultoria",
    title: "Awer Consultoria — Tecnologia e Gestão para PMEs",
    description:
      "Automação, e-commerce headless, aplicações web, IA e consultoria estratégica para pequenas e médias empresas.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Awer Consultoria" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awer Consultoria — Tecnologia e Gestão para PMEs",
    description:
      "Automação, e-commerce headless, aplicações web, IA e consultoria estratégica para pequenas e médias empresas.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "M3UzLsJpL1zYFyj5Wt6wbWHLzefipBgkEYLZ-yHSGoQ",
    other: {
      "facebook-domain-verification": ["91apbj0uomg4mowfhjz822nmduc48g"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Awer Consultoria",
    url: "https://www.awer.co",
    logo: "https://www.awer.co/main/logo.svg",
    description:
      "Tecnologia sob medida e consultoria estratégica para pequenas e médias empresas.",
    telephone: "+55-11-93943-7893",
    email: "danilo@awer.co",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Prof. Othon Gama D'Eça, 677",
      addressLocality: "Florianópolis",
      addressRegion: "SC",
      postalCode: "88015-240",
      addressCountry: "BR",
    },
    sameAs: [
      "https://www.instagram.com/awer.consultoria/",
      "https://br.linkedin.com/company/awer-assessoria-de-gest%C3%A3o-e-solu%C3%A7%C3%B5es-tecnol%C3%B3gicas",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-93943-7893",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="M3UzLsJpL1zYFyj5Wt6wbWHLzefipBgkEYLZ-yHSGoQ" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Provider>
          <GoogleTagManager />
          <Auth0ProviderWithHistory>
            <ProfileProvider>
              <Container centerContent p={0} minH="100vh" maxW='100vw' display="flex" flexDirection="column" pos={'relative'} overflowX="hidden" color={'textPrimary'}>
                {/* <Image className={'rotating-bg'} src={'main/background.svg'} objectPosition={{base:'center',md:'top'}} objectFit={{ base: 'contain', md: 'cover' }} pos={'absolute'} h={{md: '120vh' }} w='100%' zIndex={-1} opacity={{base:0.8, md:0.5}}  mt={{base:32, md:''}}/> */}
                <Header />
                {children}
                <Analytics /> {/* <-- Adicione esta linha aqui */}
                <Footer />
                <BottomFooter />
                <CookieConsentBanner />
                <WhatsButton />
                <Toaster />
              </Container>
            </ProfileProvider>
          </Auth0ProviderWithHistory>
        </Provider>
      </body>
    </html>
  );
}

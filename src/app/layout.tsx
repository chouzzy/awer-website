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
  title: "Awer Consultoria",
  description: "", // Recomendo colocar uma descrição curta aqui depois para o SEO!
  verification: {
    google: 'M3UzLsJpL1zYFyj5Wt6wbWHLzefipBgkEYLZ-yHSGoQ',
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
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="M3UzLsJpL1zYFyj5Wt6wbWHLzefipBgkEYLZ-yHSGoQ" />
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

'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiTargetBold, PiLightningBold, PiChartLineBold,
  PiPaintBrushBold, PiGlobeBold, PiArrowsClockwiseBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiTargetBold, title: "Foco em Conversão", description: "Cada elemento da página é pensado para converter visitantes em leads ou clientes. Design e copywriting orientados a resultado." },
  { icon: PiLightningBold, title: "Performance Máxima", description: "Google PageSpeed Score 90+. Carregamento ultrarrápido que reduz a taxa de rejeição e melhora o ranking no Google." },
  { icon: PiPaintBrushBold, title: "Design Profissional", description: "Visual impactante que transmite credibilidade e confiança, alinhado à identidade da sua marca e ao público-alvo da campanha." },
  { icon: PiChartLineBold, title: "Analytics Completo", description: "GTM, GA4 e tracking de conversões configurados para medir o ROI real de cada campanha com precisão." },
  { icon: PiArrowsClockwiseBold, title: "Integrações de Marketing", description: "HubSpot, RD Station, Mailchimp, ActiveCampaign e outros. Leads capturados automaticamente na sua ferramenta favorita." },
  { icon: PiGlobeBold, title: "SEO e Ads Ready", description: "Estrutura técnica otimizada para Google Ads e Meta Ads. Quality Score alto e custo por clique reduzido." },
];

export default function LandingPagesPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Landing Pages"
        title="Páginas que"
        highlight="geram resultados"
        subtitle="Landing pages de alta conversão para campanhas, lançamentos e captação de leads. Design profissional, performance superior e tracking completo — tudo que uma boa campanha precisa."
        ctaLabel="Quero uma landing page"
        trackingId="tecnologia_landing_pages"
        icon={PiGlobeBold}
        bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="O que faz uma landing page converter"
        subheading="A combinação certa de design, copywriting, performance e analytics é o que separa uma página que converte de uma que só existe."
        features={features}
      />
      <ServiceCTA
        heading="Tem uma campanha planejada?"
        subheading="Conte para nós o objetivo da sua campanha. Criamos a landing page ideal para maximizar seus resultados."
        ctaLabel="Falar sobre minha campanha"
        trackingId="tecnologia_landing_pages"
        whatsappMessage="Olá! Tenho interesse em criar uma landing page de alta conversão com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

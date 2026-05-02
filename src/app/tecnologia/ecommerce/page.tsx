'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiPaintBrushBold, PiLightningBold, PiShoppingCartBold,
  PiCreditCardBold, PiMagnifyingGlassBold, PiChartLineBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiPaintBrushBold, title: "Design Exclusivo", description: "Visual único que reflete a identidade da sua marca. Nenhum template genérico — cada detalhe é pensado para converter." },
  { icon: PiLightningBold, title: "Performance Superior", description: "Next.js headless garante carregamento ultrarrápido, com Google PageSpeed Score acima de 90 e experiência fluida em qualquer dispositivo." },
  { icon: PiShoppingCartBold, title: "Integração Shopify", description: "Utilizamos o Shopify como backend de e-commerce para gestão de produtos, pedidos, estoque e logística, enquanto o frontend é 100% personalizado." },
  { icon: PiCreditCardBold, title: "Gateways de Pagamento", description: "Stripe, PagSeguro, Mercado Pago e PIX integrados. Checkout otimizado para maximizar a taxa de conversão." },
  { icon: PiMagnifyingGlassBold, title: "SEO Avançado", description: "Estrutura técnica otimizada para mecanismos de busca: meta tags dinâmicas, sitemap, dados estruturados e URLs amigáveis." },
  { icon: PiChartLineBold, title: "Analytics e Conversão", description: "GTM, GA4 e heatmaps configurados para entender o comportamento dos clientes e identificar oportunidades de melhoria." },
];

export default function EcommercePage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="E-commerce Headless"
        title="Lojas virtuais que"
        highlight="realmente convertem"
        subtitle="E-commerces sob medida com design exclusivo, carregamento ultrarrápido e integração completa com Shopify. Seu produto merece uma vitrine à altura."
        ctaLabel="Quero minha loja"
        trackingId="tecnologia_ecommerce"
        icon={PiShoppingCartBold}
        bgImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Por que headless é melhor"
        subheading="A arquitetura headless separa o frontend do backend, dando total liberdade de design sem abrir mão das melhores ferramentas do mercado."
        features={features}
      />
      <ServiceCTA
        heading="Quer uma loja que vende de verdade?"
        subheading="Mostre seu produto para nós. Avaliamos seu negócio e apresentamos uma proposta personalizada."
        ctaLabel="Apresentar meu negócio"
        trackingId="tecnologia_ecommerce"
        whatsappMessage="Olá! Tenho interesse em criar um e-commerce headless com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

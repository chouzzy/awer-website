'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiPresentationChartBold, PiGaugeBold, PiCalendarCheckBold,
  PiChartBarBold, PiChatCircleBold, PiArrowBendRightUpBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiGaugeBold, title: "KPIs e Indicadores", description: "Definimos os indicadores mais relevantes para o seu negócio — financeiros, comerciais e operacionais — e os tornamos visíveis para toda a equipe." },
  { icon: PiPresentationChartBold, title: "Dashboard de Performance", description: "Painel visual atualizado em tempo real com os principais números do negócio para decisões rápidas e embasadas em dados." },
  { icon: PiCalendarCheckBold, title: "Reuniões de Revisão Periódicas", description: "Encontros estruturados mensais ou quinzenais para analisar resultados, identificar desvios e ajustar o plano de ação." },
  { icon: PiChartBarBold, title: "Análise de Tendências", description: "Comparamos resultados ao longo do tempo para identificar padrões e antecipar problemas antes que se tornem crises." },
  { icon: PiChatCircleBold, title: "Feedback Estruturado", description: "Fornecemos relatórios claros e recomendações práticas baseadas nos dados analisados — sem jargão, direto ao ponto." },
  { icon: PiArrowBendRightUpBold, title: "Planos de Ação", description: "Cada reunião resulta em ações concretas com responsáveis e prazos definidos para garantir que os insights se transformem em resultados." },
];

export default function AcompanhamentoDesempenhoPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Acompanhamento de Desempenho"
        title="Decida com dados,"
        highlight="não com achismo"
        subtitle="Análises periódicas do desempenho comercial com métricas bem definidas para fornecer feedback contínuo e insights que orientam decisões estratégicas assertivas."
        ctaLabel="Quero medir melhor meu negócio"
        trackingId="acompanhamento_desempenho"
        icon={PiPresentationChartBold}
        bgImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Como monitoramos seu desempenho"
        subheading="Um ciclo contínuo de medição, análise e ação que mantém sua empresa sempre evoluindo."
        features={features}
      />
      <ServiceCTA
        heading="Você sabe exatamente como está seu negócio?"
        subheading="Muitos gestores tomam decisões com base na percepção, não em dados. Nós mudamos isso."
        ctaLabel="Começar a medir meu negócio"
        trackingId="acompanhamento_desempenho"
        whatsappMessage="Olá! Tenho interesse em Acompanhamento de Desempenho Comercial com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

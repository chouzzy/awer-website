'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiChartLineUpBold, PiTargetBold, PiTreeStructureBold,
  PiMedalBold, PiHandshakeBold, PiLightbulbBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiChartLineUpBold, title: "Diagnóstico Organizacional", description: "Mapeamos a situação atual da empresa — processos, people, mercado e finanças — para identificar os principais pontos de alavancagem." },
  { icon: PiTargetBold, title: "Definição de Objetivos OKR", description: "Estabelecemos metas claras, mensuráveis e alinhadas à visão de longo prazo com a metodologia OKR, criando foco e responsabilidade." },
  { icon: PiTreeStructureBold, title: "Reestruturação de Processos", description: "Redesenhamos fluxos de trabalho para eliminar gargalos, reduzir desperdícios e aumentar a produtividade da equipe." },
  { icon: PiLightbulbBold, title: "Planejamento Estratégico", description: "Desenvolvemos um plano de negócios robusto com análise de mercado, posicionamento competitivo e roadmap de crescimento." },
  { icon: PiHandshakeBold, title: "Gestão de Pessoas", description: "Alinhamos a equipe aos objetivos da empresa com cultura organizacional, liderança e estrutura de responsabilidades bem definidas." },
  { icon: PiMedalBold, title: "Acompanhamento de Resultados", description: "Monitoramos a execução do plano com reuniões periódicas de revisão e ajuste, garantindo que os objetivos sejam atingidos." },
];

export default function GestaoEstrategiaPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Gestão e Estratégia"
        title="Clareza de direção para"
        highlight="crescer com consistência"
        subtitle="Implementamos boas práticas de gestão e planejamento estratégico para otimizar processos e gerar melhores resultados. Uma visão externa que transforma sua empresa."
        ctaLabel="Quero um diagnóstico gratuito"
        trackingId="gestao_estrategia"
        icon={PiChartLineUpBold}
        bgImage="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Como estruturamos sua estratégia"
        subheading="Um processo metodológico que vai do diagnóstico à execução, garantindo resultados sustentáveis."
        features={features}
      />
      <ServiceCTA
        heading="Sua empresa tem potencial de crescer mais?"
        subheading="Muitas vezes, um olhar externo identifica oportunidades que passam despercebidas no dia a dia. Agende uma conversa."
        ctaLabel="Agendar diagnóstico gratuito"
        trackingId="gestao_estrategia"
        whatsappMessage="Olá! Tenho interesse em Consultoria de Gestão e Estratégia com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

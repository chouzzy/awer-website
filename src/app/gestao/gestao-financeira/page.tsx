'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiBankBold, PiReceiptBold, PiScalesBold,
  PiChartPieBold, PiArrowsLeftRightBold, PiWarningBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiArrowsLeftRightBold, title: "Gestão de Fluxo de Caixa", description: "Controle de entradas e saídas com projeções de curto e médio prazo para garantir que sua empresa nunca fique sem caixa." },
  { icon: PiReceiptBold, title: "DRE e Análise de Lucratividade", description: "Demonstrativo de Resultado estruturado para entender quais produtos, serviços ou clientes são realmente lucrativos." },
  { icon: PiChartPieBold, title: "Planejamento Orçamentário", description: "Orçamento anual detalhado com metas financeiras realistas e controle de desvios mês a mês." },
  { icon: PiScalesBold, title: "Precificação e Margens", description: "Definição de preços e margens que garantem lucratividade real, considerando todos os custos diretos e indiretos." },
  { icon: PiBankBold, title: "Relacionamento com Bancos", description: "Orientação para captação de crédito, negociação de taxas e estruturação de dívidas de forma sustentável." },
  { icon: PiWarningBold, title: "Gestão de Riscos Financeiros", description: "Identificamos e mitigamos riscos como inadimplência, concentração de receita e dependência de poucos clientes." },
];

export default function GestaoFinanceiraPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Gestão Financeira"
        title="Sua empresa lucrando"
        highlight="o que merece"
        subtitle="Avaliamos o cenário financeiro da sua empresa e desenvolvemos planejamento completo para organização e otimização dos seus recursos. Clareza para tomar decisões assertivas."
        ctaLabel="Quero diagnóstico financeiro"
        trackingId="gestao_financeira"
        icon={PiBankBold}
        bgImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Como organizamos suas finanças"
        subheading="Do fluxo de caixa à estratégia de crescimento — visão completa da saúde financeira do seu negócio."
        features={features}
      />
      <ServiceCTA
        heading="Sua empresa fatura mas não sobra dinheiro?"
        subheading="Este é um dos problemas mais comuns em pequenas e médias empresas. E tem solução. Fale com a gente."
        ctaLabel="Resolver meu problema financeiro"
        trackingId="gestao_financeira"
        whatsappMessage="Olá! Tenho interesse em Consultoria de Gestão Financeira com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

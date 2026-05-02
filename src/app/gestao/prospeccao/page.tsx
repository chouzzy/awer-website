'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiMagnifyingGlassBold, PiMapPinBold, PiEnvelopeBold,
  PiPhoneBold, PiShareNetworkBold, PiChartPieBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiMagnifyingGlassBold, title: "ICP e Persona", description: "Definimos com precisão quem é seu cliente ideal — segmento, porte, dores, comportamentos e critérios de compra." },
  { icon: PiMapPinBold, title: "Mapeamento de Mercado", description: "Identificamos e qualificamos potenciais clientes no seu mercado-alvo com base em dados reais e critérios objetivos." },
  { icon: PiShareNetworkBold, title: "Prospecção Digital", description: "Estratégias de outbound via LinkedIn, email e outros canais digitais para alcançar decisores de forma personalizada e escalável." },
  { icon: PiEnvelopeBold, title: "Cadências de Prospecção", description: "Criamos sequências de contato multicanal com scripts personalizados para cada etapa — do primeiro contato até a reunião marcada." },
  { icon: PiPhoneBold, title: "Scripts e Abordagens", description: "Desenvolvemos discursos de vendas eficazes para ligações, emails e mensagens, testados e otimizados para o seu mercado." },
  { icon: PiChartPieBold, title: "Métricas de Prospecção", description: "Acompanhamos taxas de conversão em cada etapa para identificar gargalos e otimizar continuamente o processo de aquisição." },
];

export default function ProspeccaoPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Prospecção de Clientes"
        title="Encontre e conquiste"
        highlight="novos clientes"
        subtitle="Ajudamos sua empresa a identificar e alcançar novos clientes através de estratégias de prospecção eficazes. Mais reuniões com as pessoas certas, menos esforço desperdiçado."
        ctaLabel="Quero mais clientes"
        trackingId="prospeccao"
        icon={PiMagnifyingGlassBold}
        bgImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Nossa metodologia de prospecção"
        subheading="Um processo estruturado que transforma desconhecidos em oportunidades reais de negócio."
        features={features}
      />
      <ServiceCTA
        heading="Sua empresa depende de indicações?"
        subheading="Construímos um motor de prospecção ativo que não depende de sorte ou indicações para trazer novos clientes."
        ctaLabel="Montar meu motor de prospecção"
        trackingId="prospeccao"
        whatsappMessage="Olá! Tenho interesse em Consultoria de Prospecção de Clientes com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

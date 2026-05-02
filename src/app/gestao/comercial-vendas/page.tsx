'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiHandshakeBold, PiChartBarBold, PiFunnelBold,
  PiUsersBold, PiClipboardBold, PiTrendUpBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiFunnelBold, title: "Estruturação do Funil de Vendas", description: "Mapeamos e otimizamos cada etapa do processo comercial, desde a prospecção até o fechamento e pós-venda." },
  { icon: PiChartBarBold, title: "Definição de Metas", description: "Estabelecemos metas de vendas realistas e desafiadoras, baseadas em dados históricos e potencial de mercado." },
  { icon: PiClipboardBold, title: "Playbook de Vendas", description: "Documentamos o processo de vendas ideal da sua empresa para garantir consistência e facilitar o onboarding de novos vendedores." },
  { icon: PiUsersBold, title: "Gestão do Time Comercial", description: "Estruturamos papéis, responsabilidades e indicadores de performance para o time de vendas trabalhar com mais foco." },
  { icon: PiTrendUpBold, title: "Estratégias de Crescimento", description: "Identificamos oportunidades de expansão — novos mercados, produtos, canais de venda e parcerias estratégicas." },
  { icon: PiHandshakeBold, title: "CRM e Ferramentas", description: "Implementamos e configuramos CRMs para automatizar tarefas, centralizar informações e aumentar a produtividade do time." },
];

export default function ComercialVendasPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Comercial e Vendas"
        title="Venda mais com"
        highlight="processo e previsibilidade"
        subtitle="Estruturamos seu planejamento de vendas, definimos metas realistas e implementamos estratégias que impulsionam o sucesso comercial de forma sustentável."
        ctaLabel="Alavancar minhas vendas"
        trackingId="comercial_vendas"
        icon={PiHandshakeBold}
      />
      <ServiceFeatures
        heading="Como aceleramos suas vendas"
        subheading="Abordagem sistemática que transforma o comercial numa máquina previsível de geração de receita."
        features={features}
      />
      <ServiceCTA
        heading="Suas vendas estão abaixo do potencial?"
        subheading="Um processo comercial bem estruturado pode dobrar seus resultados sem necessariamente aumentar sua equipe."
        ctaLabel="Descobrir meu potencial de vendas"
        trackingId="comercial_vendas"
        whatsappMessage="Olá! Tenho interesse em Consultoria Comercial e de Vendas com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiGearSixBold, PiArrowsClockwiseBold, PiListChecksBold,
  PiRobotBold, PiUsersThreeBold, PiClockBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiListChecksBold, title: "Mapeamento de Processos", description: "Documentamos todos os processos operacionais da empresa para identificar gargalos, redundâncias e oportunidades de melhoria." },
  { icon: PiArrowsClockwiseBold, title: "Otimização de Fluxos", description: "Redesenhamos os processos para eliminar etapas desnecessárias, reduzir erros e aumentar a velocidade de entrega." },
  { icon: PiRobotBold, title: "Identificação de Automações", description: "Mapeamos quais tarefas repetitivas podem ser automatizadas com tecnologia, liberando sua equipe para atividades de maior valor." },
  { icon: PiClockBold, title: "Gestão do Tempo", description: "Implementamos metodologias para melhorar a gestão do tempo da equipe, priorizando o que realmente impacta os resultados." },
  { icon: PiUsersThreeBold, title: "Treinamento da Equipe", description: "Capacitamos sua equipe nos novos processos e ferramentas implementados para garantir adoção e resultados duradouros." },
  { icon: PiGearSixBold, title: "Ferramentas de Gestão", description: "Implantamos e configuramos ferramentas como Notion, Trello, Monday ou similares para organizar e centralizar as operações." },
];

export default function ApoioOperacionalPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Apoio Operacional"
        title="Operação eficiente que"
        highlight="escala sem caos"
        subtitle="Identificamos oportunidades de automação e facilitamos processos dentro das suas atividades operacionais, aumentando a eficiência e reduzindo custos com mais qualidade."
        ctaLabel="Organizar minha operação"
        trackingId="apoio_operacional"
        icon={PiGearSixBold}
        bgImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Como organizamos sua operação"
        subheading="Um processo de diagnóstico, mapeamento e implementação que transforma o caos operacional em rotina eficiente."
        features={features}
      />
      <ServiceCTA
        heading="Sua empresa travou no crescimento?"
        subheading="Muitas vezes o gargalo não é falta de clientes, mas falta de estrutura operacional para atender a demanda."
        ctaLabel="Estruturar minha operação"
        trackingId="apoio_operacional"
        whatsappMessage="Olá! Tenho interesse em Consultoria para Apoio Operacional com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

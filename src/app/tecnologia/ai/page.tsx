'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiChatCircleBold, PiChartBarBold, PiRobotBold,
  PiFileTextBold, PiPlugsBold, PiLightningBold,
} from "react-icons/pi";
import { PiBrainBold } from "react-icons/pi";

const features: Feature[] = [
  { icon: PiChatCircleBold, title: "Chatbots Inteligentes", description: "Atendimento 24/7 com respostas personalizadas e aprendizado contínuo, reduzindo custos operacionais e melhorando a experiência do cliente." },
  { icon: PiChartBarBold, title: "Análise de Dados com IA", description: "Transforme grandes volumes de dados em insights acionáveis. Identificamos padrões, tendências e oportunidades que passariam despercebidos." },
  { icon: PiRobotBold, title: "Automação Inteligente", description: "Eliminamos tarefas repetitivas com agentes de IA que executam fluxos complexos de forma autônoma, liberando sua equipe para o que importa." },
  { icon: PiFileTextBold, title: "Geração de Conteúdo", description: "Criamos textos, relatórios, resumos e documentos automaticamente, mantendo a voz e o tom da sua marca com qualidade profissional." },
  { icon: PiPlugsBold, title: "Integração com APIs de IA", description: "Implementamos modelos de ponta como Gemini, OpenAI, Claude e outros dentro dos seus sistemas e fluxos de trabalho existentes." },
  { icon: PiLightningBold, title: "Prototipagem Rápida", description: "Da ideia ao MVP em dias. Testamos hipóteses rapidamente com IA generativa antes de investir em desenvolvimento completo." },
];

export default function AIPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Inteligência Artificial"
        title="Automatize o futuro com"
        highlight="Inteligência Artificial"
        subtitle="Integramos IA nos seus processos para criar chatbots, analisar dados e gerar eficiência real. Modelos como Gemini, OpenAI e Claude trabalhando para o seu negócio."
        ctaLabel="Explorar soluções de IA"
        trackingId="tecnologia_ai"
        icon={PiBrainBold}
      />
      <ServiceFeatures
        heading="O que a IA pode fazer pelo seu negócio"
        subheading="Soluções práticas e implementáveis que geram resultado desde o primeiro dia."
        features={features}
      />
      <ServiceCTA
        heading="Pronto para implementar IA?"
        subheading="Converse com nossa equipe e descubra quais processos da sua empresa podem ser automatizados com IA."
        ctaLabel="Quero implementar IA"
        trackingId="tecnologia_ai"
        whatsappMessage="Olá! Tenho interesse em implementar Inteligência Artificial nos processos da minha empresa."
      />
      <ContactUs />
    </Flex>
  );
}

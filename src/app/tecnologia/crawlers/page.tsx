'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiNetworkBold, PiCalendarBold, PiBellBold,
  PiFileCsvBold, PiScalesBold, PiGearSixBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiNetworkBold, title: "Extração de Dados Dinâmicos", description: "Puppeteer e Playwright para sites que carregam conteúdo via JavaScript — redes sociais, portais, sistemas jurídicos e muito mais." },
  { icon: PiCalendarBold, title: "Coleta Agendada", description: "Configure coletas periódicas automáticas — diária, semanal ou em tempo real. Os dados chegam para você sem esforço manual." },
  { icon: PiBellBold, title: "Alertas de Mudança", description: "Monitore preços, publicações, editais ou qualquer informação e receba alertas automáticos quando os dados mudarem." },
  { icon: PiFileCsvBold, title: "Múltiplos Formatos de Exportação", description: "Os dados coletados são entregues em CSV, JSON, Excel ou diretamente no seu banco de dados — no formato que seu time já usa." },
  { icon: PiScalesBold, title: "Escalabilidade", description: "De centenas a milhões de registros. Arquitetura distribuída com filas de processamento para grandes volumes sem perda de dados." },
  { icon: PiGearSixBold, title: "Personalização Total", description: "Cada crawler é desenvolvido para o seu caso específico. Lidamos com autenticação, paginação, CAPTCHAs e proteções anti-bot." },
];

export default function CrawlersPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Web Scraping e Crawlers"
        title="Dados da web na"
        highlight="palma da sua mão"
        subtitle="Automatizamos a coleta de dados públicos para inteligência de mercado, monitoramento de concorrência e tomada de decisões estratégicas baseadas em dados reais."
        ctaLabel="Quero coletar dados"
        trackingId="tecnologia_crawlers"
        icon={PiNetworkBold}
        bgImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="O que nossos crawlers fazem"
        subheading="Soluções robustas que coletam, processam e entregam dados de forma confiável e escalável."
        features={features}
      />
      <ServiceCTA
        heading="Que dados você precisa coletar?"
        subheading="Nos conte o seu desafio e nós desenvolvemos a solução de extração mais eficiente para o seu caso."
        ctaLabel="Descrever meu desafio"
        trackingId="tecnologia_crawlers"
        whatsappMessage="Olá! Tenho interesse em desenvolver um crawler/scraper com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

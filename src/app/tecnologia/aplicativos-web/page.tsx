'use client';

import { Flex } from "@chakra-ui/react";
import { ServiceHero } from "@/components/layout/servico/ServiceHero";
import { ServiceFeatures, Feature } from "@/components/layout/servico/ServiceFeatures";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { ContactUs } from "@/components/layout/botrt/Contact";
import {
  PiDevicesBold, PiDatabaseBold, PiLockKeyBold,
  PiCloudBold, PiCodeBold, PiArrowsClockwiseBold,
} from "react-icons/pi";

const features: Feature[] = [
  { icon: PiCodeBold, title: "Frontend Next.js", description: "Interfaces modernas, responsivas e acessíveis com React e Next.js. SSR, SSG e rotas dinâmicas para a melhor performance e SEO." },
  { icon: PiDatabaseBold, title: "Backend Node.js + MongoDB", description: "APIs robustas, seguras e escaláveis. MongoDB com Prisma para modelagem flexível de dados, com suporte a PostgreSQL e outros bancos." },
  { icon: PiLockKeyBold, title: "Autenticação Segura", description: "Integramos Auth0, NextAuth e JWT para fluxos de login seguros, incluindo OAuth com Google, GitHub e outros provedores." },
  { icon: PiCloudBold, title: "Deploy e Infraestrutura", description: "Publicação na Vercel, AWS ou qualquer nuvem. Configuramos CI/CD, domínios, SSL e monitoramento de performance." },
  { icon: PiArrowsClockwiseBold, title: "Integrações de APIs", description: "Conectamos seu sistema a qualquer serviço: Stripe, WhatsApp, ERPs, CRMs e muito mais via REST ou GraphQL." },
  { icon: PiDevicesBold, title: "PWA e Mobile", description: "Aplicações web que funcionam como apps nativos no celular, com suporte offline e notificações push." },
];

export default function AplicativosWebPage() {
  return (
    <Flex direction="column" w="100%">
      <ServiceHero
        tagline="Aplicações Web"
        title="Sistemas web de alta"
        highlight="performance e escala"
        subtitle="Do conceito ao deploy, construímos aplicações completas com as tecnologias mais modernas. Frontend, backend, banco de dados e infraestrutura sob medida para o seu negócio."
        ctaLabel="Contar meu projeto"
        trackingId="tecnologia_apps_web"
        icon={PiDevicesBold}
        bgImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80&auto=format&fit=crop"
      />
      <ServiceFeatures
        heading="Tecnologias que usamos"
        subheading="Stack moderna e battle-tested, escolhida para garantir velocidade de desenvolvimento e robustez em produção."
        features={features}
      />
      <ServiceCTA
        heading="Tem uma ideia de sistema?"
        subheading="Converse com nossa equipe técnica. Avaliamos seu projeto gratuitamente e sugerimos a melhor arquitetura."
        ctaLabel="Avaliar meu projeto"
        trackingId="tecnologia_apps_web"
        whatsappMessage="Olá! Tenho interesse em desenvolver uma aplicação web com a Awer."
      />
      <ContactUs />
    </Flex>
  );
}

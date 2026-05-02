'use client';

import { Flex, Heading, Text, Box, Icon, SimpleGrid, Badge, Button } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import NextLink from "next/link";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/utils";
import {
  PiChartLineUpBold, PiHandshakeBold, PiMagnifyingGlassBold,
  PiPresentationChartBold, PiBankBold, PiGearSixBold,
  PiArrowRightBold, PiWhatsappLogoBold,
} from "react-icons/pi";

const services = [
  {
    icon: PiChartLineUpBold,
    title: "Gestão e Estratégia",
    description: "Implementamos boas práticas de gestão e planejamento estratégico para otimizar processos e gerar melhores resultados.",
    href: "/gestao/gestao-estrategia",
    badge: "Estratégia",
    badgeColor: "brand.500",
  },
  {
    icon: PiHandshakeBold,
    title: "Comercial e Vendas",
    description: "Estruturamos seu planejamento de vendas, definimos metas realistas e implementamos estratégias que impulsionam o sucesso comercial.",
    href: "/gestao/comercial-vendas",
    badge: "Vendas",
    badgeColor: "blue.400",
  },
  {
    icon: PiMagnifyingGlassBold,
    title: "Prospecção de Clientes",
    description: "Identificamos e alcançamos novos clientes através de estratégias eficazes para expandir sua base de clientes.",
    href: "/gestao/prospeccao",
    badge: "Crescimento",
    badgeColor: "green.400",
  },
  {
    icon: PiPresentationChartBold,
    title: "Acompanhamento de Desempenho",
    description: "Análises periódicas com métricas bem definidas para fornecer feedback contínuo e insights estratégicos.",
    href: "/gestao/acompanhamento-desempenho",
    badge: "Analytics",
    badgeColor: "purple.400",
  },
  {
    icon: PiBankBold,
    title: "Gestão Financeira",
    description: "Avaliamos o cenário financeiro e desenvolvemos planejamento completo para otimização dos seus recursos.",
    href: "/gestao/gestao-financeira",
    badge: "Finanças",
    badgeColor: "yellow.500",
  },
  {
    icon: PiGearSixBold,
    title: "Apoio Operacional",
    description: "Identificamos oportunidades de automação e facilitamos processos dentro das suas atividades operacionais.",
    href: "/gestao/apoio-operacional",
    badge: "Operações",
    badgeColor: "orange.400",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function ConsultoriaPage() {
  const MotionFlex = motion(Flex);
  const MotionBox = motion(Box);
  const MotionHeading = motion(Heading);
  const MotionText = motion(Text);
  const MotionGrid = motion(SimpleGrid);

  return (
    <Flex direction="column" w="100%">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <MotionFlex
        as="section"
        w="100%"
        minH={{ base: "75vh", md: "85vh" }}
        align="center"
        justify="center"
        px={{ base: 6, md: 16 }}
        textAlign="center"
        direction="column"
        gap={6}
        position="relative"
        overflow="hidden"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          position="absolute"
          top="30%"
          left="50%"
          transform="translateX(-50%)"
          w={{ base: "300px", md: "700px" }}
          h={{ base: "300px", md: "500px" }}
          borderRadius="full"
          bg="brand.500"
          opacity={0.05}
          filter="blur(100px)"
          pointerEvents="none"
        />

        <MotionBox variants={heroItem}>
          <Flex align="center" justify="center" gap={2}
            px={4} py={2} borderRadius="full"
            bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200"
            display="inline-flex"
          >
            <Icon as={PiHandshakeBold} color="brand.500" boxSize={4} />
            <Text color="brand.400" fontSize="sm" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
              Consultoria Estratégica
            </Text>
          </Flex>
        </MotionBox>

        <MotionHeading
          as="h1"
          variants={heroItem}
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="extrabold"
          lineHeight="1.1"
          color="ghostWhite"
          maxW="4xl"
        >
          Uma visão 360° para{" "}
          <Box as="span" color="brand.500">o seu negócio</Box>
        </MotionHeading>

        <MotionText
          variants={heroItem}
          color="gray.400"
          fontSize={{ base: "lg", md: "xl" }}
          maxW="2xl"
          lineHeight="tall"
        >
          Conectamos planejamento comercial, prospecção, gestão financeira e otimização de processos para impulsionar seus resultados e garantir crescimento sustentável.
        </MotionText>

        <MotionBox variants={heroItem} pt={2}>
          <NextLink
            href={whatsappLink("Olá! Tenho interesse na Consultoria da Awer e gostaria de um diagnóstico gratuito.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ event: 'whatsapp_click', source: 'hero_consultoria', label: 'Diagnóstico gratuito' })}
          >
            <Button
              size="lg"
              bg="brand.500"
              color="white"
              px={10}
              py={7}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="xl"
              _hover={{ bg: "brand.600", transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(255, 95, 94, 0.35)" }}
              transition="all 0.3s ease"
            >
              <Icon as={PiWhatsappLogoBold} mr={2} boxSize={5} />
              Quero um Diagnóstico Gratuito
            </Button>
          </NextLink>
        </MotionBox>
      </MotionFlex>

      {/* ─── Serviços ─────────────────────────────────────────────────────── */}
      <Flex
        as="section"
        w="100%"
        py={{ base: 16, md: 24 }}
        px={{ base: 6, md: 16 }}
        direction="column"
        align="center"
        gap={12}
        bg="rgba(10, 10, 12, 0.5)"
      >
        <Flex direction="column" align="center" textAlign="center" gap={4} maxW="2xl">
          <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="ghostWhite">
            Nossas Especialidades
          </Heading>
          <Text color="gray.400" fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
            Cada frente de consultoria é conduzida por especialistas com experiência prática em gestão e negócios.
          </Text>
        </Flex>

        <MotionGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          gap={6}
          w="100%"
          maxW="6xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, i) => (
            <MotionBox key={i} variants={itemVariants}>
              <NextLink
                href={service.href}
                onClick={() => trackEvent({ event: 'service_click', service_title: service.title, source: 'consultoria_hub' })}
              >
                <Flex
                  direction="column"
                  h="100%"
                  p={6}
                  bg="rgba(15, 17, 21, 0.6)"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                  gap={4}
                  cursor="pointer"
                  _hover={{
                    borderColor: "brand.500",
                    boxShadow: "0 4px 24px rgba(255, 95, 94, 0.12)",
                    transform: "translateY(-4px)",
                  }}
                  transition="all 0.25s ease"
                >
                  <Flex justify="space-between" align="flex-start">
                    <Flex
                      align="center" justify="center"
                      w={12} h={12}
                      bg="rgba(255, 95, 94, 0.1)"
                      borderRadius="xl"
                    >
                      <Icon as={service.icon} color="brand.500" boxSize={6} />
                    </Flex>
                    <Badge bg={service.badgeColor} color="white" borderRadius="full" px={3} py={1} fontSize="xs">
                      {service.badge}
                    </Badge>
                  </Flex>

                  <Box flex={1}>
                    <Text color="ghostWhite" fontWeight="bold" fontSize="lg" mb={2}>{service.title}</Text>
                    <Text color="gray.400" fontSize="sm" lineHeight="tall">{service.description}</Text>
                  </Box>

                  <Flex align="center" gap={1} color="brand.500" fontSize="sm" fontWeight="medium">
                    <Text>Saiba mais</Text>
                    <Icon as={PiArrowRightBold} boxSize={4} />
                  </Flex>
                </Flex>
              </NextLink>
            </MotionBox>
          ))}
        </MotionGrid>
      </Flex>

      {/* ─── CTA Final ────────────────────────────────────────────────────── */}
      <ServiceCTA
        heading="Pronto para transformar seu negócio?"
        subheading="Agende uma conversa gratuita com nossa equipe e descubra quais frentes de consultoria fazem mais sentido para você."
        ctaLabel="Agendar Conversa Gratuita"
        trackingId="consultoria"
        whatsappMessage="Olá! Gostaria de agendar uma conversa sobre consultoria com a equipe da Awer."
      />

    </Flex>
  );
}

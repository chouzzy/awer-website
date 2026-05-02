'use client';

import { Flex, Heading, Text, Box, Icon, SimpleGrid, Badge, Button } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import NextLink from "next/link";
import { ServiceCTA } from "@/components/layout/servico/ServiceCTA";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/utils";
import {
  PiRobotBold, PiGlobeBold, PiShoppingCartBold,
  PiNetworkBold, PiDevicesBold, PiBrainBold,
  PiArrowRightBold, PiWhatsappLogoBold, PiCodeBold,
} from "react-icons/pi";

const services = [
  {
    icon: PiRobotBold,
    title: "Robôs de Automação",
    description: "Automatize tarefas repetitivas e colete dados com robôs desktop desenvolvidos em Electron/Nextron.",
    href: "/tecnologia/botrt",
    badge: "Destaque",
    badgeColor: "brand.500",
    isHighlight: true,
  },
  {
    icon: PiBrainBold,
    title: "Inteligência Artificial",
    description: "Chatbots, análise de dados e automação inteligente com modelos como Gemini, OpenAI e Claude.",
    href: "/tecnologia/ai",
    badge: "IA",
    badgeColor: "purple.400",
  },
  {
    icon: PiDevicesBold,
    title: "Aplicações Web",
    description: "Sistemas completos do frontend ao backend — Next.js, Node.js, MongoDB, Auth0 e deploy em nuvem.",
    href: "/tecnologia/aplicativos-web",
    badge: "Fullstack",
    badgeColor: "blue.400",
  },
  {
    icon: PiShoppingCartBold,
    title: "E-commerce Headless",
    description: "Lojas virtuais de alta performance com design exclusivo, integradas ao Shopify e gateways de pagamento.",
    href: "/tecnologia/ecommerce",
    badge: "E-commerce",
    badgeColor: "green.400",
  },
  {
    icon: PiNetworkBold,
    title: "Crawlers e Web Scraping",
    description: "Coleta automatizada de dados públicos da web com Puppeteer/Playwright para inteligência de mercado.",
    href: "/tecnologia/crawlers",
    badge: "Dados",
    badgeColor: "orange.400",
  },
  {
    icon: PiGlobeBold,
    title: "Landing Pages",
    description: "Páginas otimizadas para conversão, com performance superior e integração com ferramentas de marketing.",
    href: "/tecnologia/landing-pages",
    badge: "Conversão",
    badgeColor: "yellow.500",
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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function TecnologiaPage() {
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
        minH={{ base: "85vh", md: "92vh" }}
        align="center"
        justify="center"
        px={{ base: 6, md: 16 }}
        textAlign="center"
        direction="column"
        gap={6}
        position="relative"
        overflow="hidden"
        bgImage="url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80&auto=format&fit=crop)"
        bgSize="cover"
        bgPos="center"
        bgRepeat="no-repeat"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overlay escuro */}
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.72)" zIndex={0} />
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
          zIndex={1}
        />

        <MotionBox variants={heroItem} zIndex={2}>
          <Flex align="center" justify="center" gap={2}
            px={4} py={2} borderRadius="full"
            bg="whiteAlpha.150" border="1px solid" borderColor="whiteAlpha.300"
            backdropFilter="blur(8px)"
            display="inline-flex"
          >
            <Icon as={PiCodeBold} color="brand.500" boxSize={4} />
            <Text color="brand.400" fontSize="sm" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
              Soluções Tecnológicas
            </Text>
          </Flex>
        </MotionBox>

        <MotionHeading
          as="h1"
          variants={heroItem}
          zIndex={2}
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="extrabold"
          lineHeight="1.1"
          color="white"
          maxW="4xl"
          textShadow="0 2px 20px rgba(0,0,0,0.5)"
        >
          Tecnologia sob medida para{" "}
          <Box as="span" color="brand.400">o seu negócio</Box>
        </MotionHeading>

        <MotionText
          variants={heroItem}
          zIndex={2}
          color="whiteAlpha.800"
          fontSize={{ base: "lg", md: "xl" }}
          maxW="2xl"
          lineHeight="tall"
          textShadow="0 1px 10px rgba(0,0,0,0.4)"
        >
          Da automação inteligente ao e-commerce de alta performance. Construímos soluções digitais que transformam processos e impulsionam resultados.
        </MotionText>

        <MotionBox variants={heroItem} pt={2} zIndex={2}>
          <NextLink
            href={whatsappLink("Olá! Tenho interesse nas soluções de tecnologia da Awer.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ event: 'whatsapp_click', source: 'hero_tecnologia', label: 'Falar com especialista' })}
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
              Falar com um Especialista
            </Button>
          </NextLink>
        </MotionBox>
      </MotionFlex>

      {/* ─── Grid de Serviços ─────────────────────────────────────────────── */}
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
            O que desenvolvemos
          </Heading>
          <Text color="gray.400" fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
            Cada solução é construída com as tecnologias mais modernas e adaptada à realidade do seu negócio.
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
                onClick={() => trackEvent({ event: 'service_click', service_title: service.title, source: 'tecnologia_hub' })}
              >
                <Flex
                  direction="column"
                  h="100%"
                  p={6}
                  bg={service.isHighlight ? "rgba(255, 95, 94, 0.06)" : "rgba(15, 17, 21, 0.6)"}
                  border="1px solid"
                  borderColor={service.isHighlight ? "brand.500" : "whiteAlpha.100"}
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
        heading="Tem um projeto em mente?"
        subheading="Conte para nós o que você precisa. Nossa equipe técnica vai analisar e propor a melhor solução para o seu caso."
        ctaLabel="Contar meu projeto"
        trackingId="tecnologia"
        whatsappMessage="Olá! Tenho um projeto de tecnologia e gostaria de falar com a equipe da Awer."
      />
    </Flex>
  );
}

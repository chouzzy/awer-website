'use client';
import { Flex, Heading, Text, Button, Box, Icon } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import NextLink from "next/link";
import { whatsappLink } from "@/utils";
import { trackEvent } from "@/lib/analytics";
import { PiWhatsappLogoBold, PiArrowRightBold } from "react-icons/pi";

interface ServiceCTAProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  trackingId: string;
  whatsappMessage?: string;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ServiceCTA({
  heading = "Pronto para dar o próximo passo?",
  subheading = "Fale com um especialista da Awer e descubra como podemos transformar o seu negócio.",
  ctaLabel = "Falar com um especialista",
  trackingId,
  whatsappMessage,
}: ServiceCTAProps) {
  const MotionFlex = motion(Flex);

  return (
    <MotionFlex
      as="section"
      w="100%"
      py={{ base: 16, md: 24 }}
      px={{ base: 6, md: 16 }}
      direction="column"
      align="center"
      textAlign="center"
      gap={8}
      position="relative"
      overflow="hidden"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Fundo com gradiente sutil */}
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(135deg, rgba(255,95,94,0.04) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-40px"
        right="-40px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="brand.500"
        opacity={0.04}
        filter="blur(60px)"
        pointerEvents="none"
      />

      <Flex direction="column" gap={4} maxW="2xl" zIndex={1}>
        <Heading
          as="h2"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          color="ghostWhite"
          lineHeight="1.2"
        >
          {heading}
        </Heading>
        <Text color="gray.400" fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
          {subheading}
        </Text>
      </Flex>

      <Flex gap={4} wrap="wrap" justify="center" zIndex={1}>
        <NextLink
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent({ event: 'whatsapp_click', source: `cta_section_${trackingId}`, label: ctaLabel })}
        >
          <Button
            size="lg"
            bg="brand.500"
            color="white"
            px={10}
            py={7}
            fontSize="md"
            fontWeight="bold"
            borderRadius="xl"
            _hover={{ bg: "brand.600", transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(255, 95, 94, 0.35)" }}
            transition="all 0.3s ease"
          >
            <Icon as={PiWhatsappLogoBold} mr={2} boxSize={5} />
            {ctaLabel}
          </Button>
        </NextLink>
      </Flex>
    </MotionFlex>
  );
}

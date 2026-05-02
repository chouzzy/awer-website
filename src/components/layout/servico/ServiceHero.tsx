'use client';
import { Flex, VStack, Heading, Text, Button, Box, Icon } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import NextLink from "next/link";
import { whatsappLink } from "@/utils";
import { trackEvent } from "@/lib/analytics";
import { PiWhatsappLogoBold } from "react-icons/pi";
import type { IconType } from "react-icons";

interface ServiceHeroProps {
  tagline?: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaLabel?: string;
  trackingId: string;
  icon?: IconType;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.25, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function ServiceHero({
  tagline,
  title,
  highlight,
  subtitle,
  ctaLabel = "Falar com um especialista",
  trackingId,
  icon,
}: ServiceHeroProps) {
  const MotionVStack = motion(VStack);
  const MotionHeading = motion(Heading);
  const MotionText = motion(Text);
  const MotionBox = motion(Box);

  return (
    <Flex
      as="section"
      w="100%"
      minH={{ base: "80vh", md: "90vh" }}
      align="center"
      justify="center"
      px={{ base: 6, md: 16 }}
      textAlign="center"
      position="relative"
      overflow="hidden"
    >
      {/* Glow decorativo */}
      <Box
        position="absolute"
        top="20%"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: "300px", md: "600px" }}
        h={{ base: "300px", md: "600px" }}
        borderRadius="full"
        bg="brand.500"
        opacity={0.06}
        filter="blur(80px)"
        pointerEvents="none"
      />

      <MotionVStack
        zIndex={1}
        maxW="4xl"
        gap={6}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {(tagline || icon) && (
          <MotionBox variants={itemVariants}>
            <Flex align="center" justify="center" gap={2}
              px={4} py={2} borderRadius="full"
              bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.200"
              display="inline-flex"
            >
              {icon && <Icon as={icon} color="brand.500" boxSize={4} />}
              {tagline && <Text color="brand.400" fontSize="sm" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">{tagline}</Text>}
            </Flex>
          </MotionBox>
        )}

        <MotionHeading
          as="h1"
          variants={itemVariants}
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="extrabold"
          lineHeight="1.1"
          color="ghostWhite"
        >
          {title}{" "}
          <Box as="span" color="brand.500">{highlight}</Box>
        </MotionHeading>

        <MotionText
          variants={itemVariants}
          fontSize={{ base: "lg", md: "xl" }}
          color="gray.400"
          maxW="2xl"
          lineHeight="tall"
        >
          {subtitle}
        </MotionText>

        <MotionBox variants={itemVariants} pt={2}>
          <NextLink
            href={whatsappLink(`Olá! Tenho interesse em ${title} ${highlight}.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ event: 'whatsapp_click', source: `hero_${trackingId}`, label: ctaLabel })}
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
              {ctaLabel}
            </Button>
          </NextLink>
        </MotionBox>
      </MotionVStack>
    </Flex>
  );
}

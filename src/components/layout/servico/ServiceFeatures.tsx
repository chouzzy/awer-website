'use client';
import { Flex, Box, Text, Heading, Icon, SimpleGrid } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import type { IconType } from "react-icons";

export interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

interface ServiceFeaturesProps {
  heading: string;
  subheading?: string;
  features: Feature[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function ServiceFeatures({ heading, subheading, features }: ServiceFeaturesProps) {
  const MotionBox = motion(Box);
  const MotionGrid = motion(SimpleGrid);

  return (
    <Flex
      as="section"
      w="100%"
      py={{ base: 16, md: 24 }}
      px={{ base: 6, md: 16 }}
      direction="column"
      align="center"
      gap={12}
    >
      {/* Cabeçalho */}
      <Flex direction="column" align="center" textAlign="center" gap={4} maxW="2xl">
        <Heading
          as="h2"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          color="ghostWhite"
          lineHeight="1.2"
        >
          {heading}
        </Heading>
        {subheading && (
          <Text color="gray.400" fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
            {subheading}
          </Text>
        )}
      </Flex>

      {/* Grid de features */}
      <MotionGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        gap={6}
        w="100%"
        maxW="6xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feat, i) => (
          <MotionBox key={i} variants={itemVariants}>
            <Box
              p={6}
              bg="rgba(15, 17, 21, 0.6)"
              border="1px solid"
              borderColor="whiteAlpha.100"
              borderRadius="2xl"
              h="100%"
              _hover={{
                borderColor: "brand.500",
                boxShadow: "0 4px 24px rgba(255, 95, 94, 0.12)",
                transform: "translateY(-4px)",
              }}
              transition="all 0.25s ease"
            >
            <Flex
              align="center"
              justify="center"
              w={12}
              h={12}
              bg="rgba(255, 95, 94, 0.12)"
              borderRadius="xl"
              mb={4}
            >
              <Icon as={feat.icon} color="brand.500" boxSize={6} />
            </Flex>
            <Text color="ghostWhite" fontWeight="bold" fontSize="lg" mb={2}>
              {feat.title}
            </Text>
            <Text color="gray.400" fontSize="sm" lineHeight="tall">
              {feat.description}
            </Text>
            </Box>
          </MotionBox>
        ))}
      </MotionGrid>
    </Flex>
  );
}

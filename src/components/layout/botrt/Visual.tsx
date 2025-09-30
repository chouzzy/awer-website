// src/components/layout/BotrtGrid.tsx
'use client';

// --- Framework e UI Libs ---
import {
    Heading,
    Text,
    Icon,
    VStack,
    SimpleGrid,
    Flex,
    Image,
} from "@chakra-ui/react";
import { motion, Variants } from 'framer-motion';

// ============================================================================
//   DADOS DE TEXTO E SRC
// ============================================================================
export const visualData = {
    heading: "Acesse todos os TRTs de uma só vez",
    description: "Com a sua nova interface simples e intuitiva, com poucos cliques é possível visualizar dados detalhados e exportar relatórios completos dos Tribunais Regionais do Trabalho (TRTs).",
    image: {
        src: "/botrt/visual/visual.png",
        alt: "BoRTT Visual"
    }
};

// ============================================================================
//   VARIANTES DE ANIMAÇÃO (Framer Motion)
// ============================================================================
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// ============================================================================
//   COMPONENTE PRINCIPAL: BotrtGrid
// ============================================================================
export function BotrtVisual() {
    const MotionFlex = motion(Flex);

    return (
        <Flex
            as="section"
            flexDir={'column'}
            w="100%"
            py={{ base: 16, md: 24 }}
            px={{ base: 4, md: 8 }}
            bg="black"
            color="white"
            zIndex={10}
            gap={8}
        >
            <VStack gap={4} textAlign="center" mb={{ base: 12, md: 16 }}>
                <Heading
                    as="h2"
                    fontSize={{ base: '4xl', md: '6xl' }}
                    letterSpacing={'-0.02em'}
                    fontWeight="bold"
                    lineHeight={1.2}
                >
                    {visualData.heading}
                </Heading>
                <Text
                    fontSize={{ base: 'md', md: 'xl' }}
                    color="gray.400"
                    maxW="4xl"
                    mx="auto"
                >
                    {visualData.description}
                </Text>
            </VStack>

            <MotionFlex
                flexDir={{ base: 'column', md: 'row' }}
                gap={{ base: 6, md: 8 }}
                maxW="7xl"
                mx="auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <MotionFlex
                    variants={cardVariants}
                >
                    <BoTRTPicure />
                </MotionFlex>
            </MotionFlex>
        </Flex>
    );
}

// ============================================================================
//   SUB-COMPONENTE: BoTRTPicure
// ============================================================================
interface BoTRTPicureProps { }

function BoTRTPicure({ }: BoTRTPicureProps) {
    return (
        <VStack
            p={{ base: 2, md: 2 }}
            borderRadius={40}
            border="1px solid"
            borderColor="gray.800"
            gap={5}
            textAlign="center"
            h="100%"
            transition="transform 0.2s ease-in-out, border-color 0.2s ease-in-out"
        >
            <Flex
                p={{base:0, md:3}}
                borderRadius="lg"
                justify="center"
                align="center"
            >
                <Image
                    src={visualData.image.src}
                    alt={visualData.image.alt}
                    maxW={{ base: '100%', md: '6xl', xl: '8xl' }}
                    objectFit='cover'
                    objectPosition='center'
                    border='4px solid'
                    borderRadius={32}
                    boxSize={'101%'}
                    borderColor={'gray.800'}
                />
            </Flex>
        </VStack>
    );
}

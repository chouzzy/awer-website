'use client';

import { Flex, VStack, Heading, Text, Button, Link, Box } from "@chakra-ui/react";
import { motion, Variants } from 'framer-motion';
import NextLink from 'next/link';
import React from "react";

// Variantes de animação para uma entrada impactante
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export function BotrtHero() {
    const MotionVStack = motion(VStack);
    const MotionHeading = motion(Heading);
    const MotionText = motion(Text);
    const MotionBox = motion(Box);

    // Função para lidar com a rolagem suave
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const targetId = e.currentTarget.href.split('#')[1];
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Flex
            as="section"
            w="100%"
            minH={{ base: "90vh", md: "100vh" }} // Ocupa a tela inteira
            align="center"
            justify="center"
            px={{ base: 4, md: 8 }}
            textAlign="center"
            position="relative"
            overflow="hidden"
            // Efeito de textura sutil no fundo
            bgImage={'url(/botrt/main/money.png)'} 
            bgPos={'center'}
            bgSize={'cover'}
            bgRepeat={'no-repeat'}
        >

            <MotionVStack
                zIndex={1}
                maxW="8xl" // Limita a largura do texto para melhor legibilidade
                gap={6}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <MotionHeading
                    as="h1"
                    variants={itemVariants}
                    fontSize={{ base: '5xl', md: '4xl', lg: '7xl' }}
                    fontWeight="extrabold"
                    lineHeight="1.1"
                >
                    Você sabe quanto está gastando com <Box as="span" color="#FF5F5E"> consultas manuais </Box> aos TRTs?
                </MotionHeading>
                <MotionHeading
                    as="h2"
                    variants={itemVariants}
                    fontSize={{ base: '4xl', md: '3xl', lg: '5xl' }}
                    fontWeight="extrabold"
                    lineHeight="1.1"
                >
                    Este valor pode chegar a <Box as="span" color="#FF5F5E">R$60.000 por ano</Box>.
                </MotionHeading>

                <MotionText
                    variants={itemVariants}
                    fontSize={{ base: 'md', md: 'xl' }}
                    color="gray.400"
                    maxW="2xl"
                    as="h3"
                >
                    Reduza custos operacionais e libere sua equipe para focar em estratégia jurídica. O BoTRT automatiza a coleta de dados e a geração de relatórios de audiências, transformando horas em segundos.
                </MotionText>

                <MotionBox variants={itemVariants} pt={4}>
                    {/* Link atualizado para rolagem suave */}
                    <Link as={NextLink} href="#planos" onClick={handleScroll} _hover={{ textDecoration: 'none' }}>
                        <Button
                            size="lg"
                            bgColor="brand.500"
                            color="white"
                            px={10}
                            py={7}
                            fontSize="lg"
                            fontWeight="bold"
                            _hover={{ bgColor: "white", color: "#FF5F5E" }}
                            transition="all 0.3s ease-in-out"
                            as="h3"
                        >
                            Experimente grátis por 7 dias!
                        </Button>
                    </Link>
                </MotionBox>
                 
            </MotionVStack>
        </Flex>
    );
}

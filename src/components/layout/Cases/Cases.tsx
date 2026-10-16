// src/components/layout/Cases.tsx
'use client';

// ============================================================================
//   IMPORTS
// ============================================================================

// --- Framework e UI Libs ---
import { Button, Flex, Link, Tag, Text, IconButton } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { FaLongArrowAltRight } from "react-icons/fa";

// --- Componentes e Dados do Projeto ---
import { CustomText } from "@/components/ui/CustomText";
import { callToAction, cases, CasesProps } from "@/data/cases"; // Supondo que a interface venha daqui

// ============================================================================
//   VARIANTES DE ANIMAÇÃO (FRAMER MOTION)
// ============================================================================
// Definidas fora do componente para melhor performance, evitando recriação a cada render.

const caseFlexVariantsLeft: Variants = {
    hidden: { opacity: 0, x: '-10%' },
    inView: {
        opacity: 1, x: 0,
        transition: { duration: 1.4, ease: 'easeInOut' }
    }
};

const caseFlexVariantsRight: Variants = {
    hidden: { opacity: 0, x: '10%' },
    inView: {
        opacity: 1, x: 0,
        transition: { duration: 1.4, ease: 'easeInOut', delay: 0.7 }
    }
};

const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } }
};

const tagVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1 } }
};

const descriptionVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    inView: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.5 } }
};

const buttonVariants: Variants = {
    initial: {
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        width: 240
    },
    hover: {
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        border: 'none',
        width: 600,
        transition: { type: "spring", stiffness: 400, damping: 100 }
    },
    tap: {
        scale: 0.80,
    }
};


// ============================================================================
//   COMPONENTE PRINCIPAL: Cases
// ============================================================================
interface CasesDataProps {
    c: CasesProps;
}

export function Cases({ c }: CasesDataProps) {

    // --- Desestruturação das Props ---
    const { description, image, orientation, product, tagLabel, tagLabelColor } = c;

    // --- Componentes com Animação ---
    const MotionText = motion(CustomText);
    const MotionFlex = motion(Flex);
    const MotionTag = motion(Tag.Root);
    const MotionButton = motion(Button);

    // --- Lógica de Orientação ---
    const isImageLeft = orientation === 'image-left';

    // --- Renderização do Componente ---
    return (
        <Flex justifyContent="center">
            <Flex
                // Layout principal que alterna a direção da imagem
                w="100%"
                justifyContent={'center'}
                alignItems={'start'}
                gap={{ base: 8, md: 16, lg: 32 }}
                minH={{ base: '100%', md: 500, xl: 500 }}
                flexDir={{ base: 'column', md: isImageLeft ? 'row' : 'row-reverse' }}
            >

                {/* Bloco da Imagem (Esquerdo ou Direito) */}
                <MotionFlex
                    variants={caseFlexVariantsLeft}
                    initial='hidden'
                    whileInView='inView'
                    viewport={{ once: true }}
                    // Estilização da imagem
                    w='100%'
                    h={{ base: '40vh', md: '100%' }}
                    justifyContent={'right'}
                    pos={'relative'}
                    bgColor={'black'}
                    bgImage={`url(${image})`}
                    bgSize={'cover'}
                    bgPos={'start'}
                >
                    {/* Gradiente sobre a imagem para dar contraste ao texto */}
                    <Flex
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        bgGradient="to-r"
                        gradientFrom="#000000"
                        gradientTo="transparent 33%"
                    />
                </MotionFlex>

                {/* Bloco de Texto (Direito ou Esquerdo) */}
                <MotionFlex
                    variants={caseFlexVariantsRight}
                    initial='hidden'
                    whileInView='inView'
                    viewport={{ once: true }}
                    // Layout do container de texto
                    flexDir={'column'}
                    w='100%'
                    justifyContent={'space-between'}
                    h={{ base: 'auto', md: '100%' }}
                    gap={{ base: 4, md: 2 }}
                >
                    <Flex flexDir={'column'} gap={{ base: 8, md: 8 }} p={{ base: 4, md: 0 }}>
                        <Flex flexDir={'column'} gap={{ base: 8, md: 8 }}>

                            {/* Título do Produto */}
                            <Flex>
                                <MotionText
                                    variants={titleVariants}
                                    text={product}
                                    fontSize={{ base: '3xl', md: '4xl', lg: '6xl' }}
                                    lineHeight={1.2}
                                />
                            </Flex>

                            {/* Tag (Consultoria/Tecnologia) */}
                            <Flex>
                                <MotionTag
                                    bgColor={tagLabelColor? tagLabelColor : tagLabel === 'Consultoria' ? 'brand.500' : 'cadetBlue'}
                                    variants={tagVariants}
                                >
                                    <Tag.Label
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        color={'ghostWhite'}
                                        py={{ base: 2, md: 4 }}
                                        px={{ base: 4, md: 6 }}
                                    >
                                        {tagLabel}
                                    </Tag.Label>
                                </MotionTag>
                            </Flex>

                        </Flex>

                        {/* Descrição do Case */}
                        <Flex>
                            <MotionText
                                variants={descriptionVariants}
                                fontSize={{ base: 'md', md: 'xl' }}
                                color='textSecondary'
                                fontWeight={'regular'}
                                letterSpacing={1.3}
                                text={description}
                            />
                        </Flex>
                    </Flex>

                    {/* Botão "Saiba Mais" */}
                    <Link href={c.link} {...(c.link?.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                        <Flex p={{ base: 4, md: 0 }}>
                            <MotionButton
                                fontSize={'md'}
                                initial='initial'
                                whileHover="hover"
                                variants={buttonVariants}
                                borderRadius={'md'}
                                bgColor={'transparent'}
                                border={'1px solid'}
                                borderColor={tagLabelColor? tagLabelColor : tagLabel === 'Consultoria' ? '#FF5F5E' : 'cadetBlue'}
                                color={'textPrimary'}
                                justifyContent={'space-between'}
                                // Sobrescreve a cor do hover dinamicamente
                                _hover={{
                                    backgroundColor: tagLabelColor ? tagLabelColor : tagLabel === 'Consultoria' ? '#FF5F5E' : 'cadetBlue'
                                }}
                            >
                                {callToAction.title}
                                <FaLongArrowAltRight />
                            </MotionButton>
                        </Flex>
                    </Link>
                </MotionFlex>

            </Flex>
        </Flex>
    );
}

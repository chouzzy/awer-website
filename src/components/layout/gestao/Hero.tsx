'use client';

import { pageData } from "@/data/gestao";
import { GestaoPageData } from "@/types";
import { Flex, Heading, Button, VStack, HStack, Text } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { DiagnosticoModal } from "./DiagnosticoModal";
import { trackEvent } from "@/lib/analytics";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export function Hero({ pageData }: { pageData: GestaoPageData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const MotionFlex = motion(Flex);
    const MotionHeading = motion(Heading);
    const MotionText = motion(Text);
    const MotionButton = motion(Button);

    return (
        <>
            <MotionFlex
                as="section"
                w="100%"
                minH={{ base: '94vh', md: '94vh' }}
                justifyContent="center"
                alignItems="center"
                px={{ base: 4, md: 8 }}
                bg="black"
                bgImage={`url('/gestao/bg-c.png')`}
                bgSize="cover"
                bgPos="center"
                bgRepeat="no-repeat"
                color="white"
                textAlign="center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <VStack gap={6} maxW="5xl">
                    <MotionHeading
                        as="h1"
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="bold"
                        lineHeight={1.2}
                        variants={itemVariants}
                    >
                        {pageData.hero.title}
                    </MotionHeading>
                    <MotionText
                        fontSize={{ base: 'md', md: 'lg' }}
                        color="gray.300"
                        variants={itemVariants}
                    >
                        {pageData.hero.subtitle}
                    </MotionText>
                    <MotionButton
                        onClick={() => {
                            trackEvent({ event: 'cta_click', source: 'hero_consultoria', label: pageData.hero.ctaButton });
                            setIsModalOpen(true);
                        }}
                        size="lg"
                        py={7}
                        px={8}
                        bgColor="brand.600"
                        _hover={{ bgColor: 'ghostWhite', color: 'brand.600', transition: '0.3s' }}
                        color="white"
                        variants={itemVariants}
                    >
                        <HStack gap={2}>
                            <Text>{pageData.hero.ctaButton}</Text>
                        </HStack>
                    </MotionButton>
                </VStack>
            </MotionFlex>

            <DiagnosticoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

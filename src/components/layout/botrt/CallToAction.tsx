'use client';
import { Button, Flex, Text } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";



export function BoTRTCallToAction() {

    const MotionFlex = motion(Flex);
    const MotionButton = motion(Button);
    const MotionText = motion(Text);

    // Animação genérica para cada item de conteúdo (título, texto, botão).
    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <MotionFlex
            zIndex={10}
            px={8}
            py={2}
            bgColor={'gray.200'}
            border={'1px solid'}
            borderColor={'gray.600'}
            fontWeight={'bold'}
            borderRadius={'md'}
            color={'brand.600'}
            letterSpacing={'wider'}
            _hover={{ bgColor: "gunMetal", color: 'gray.100', transition: 'background-color 0.6s ease' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                const element = document.getElementById('planos');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }}
            cursor={'pointer'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <MotionText fontSize={{ base: 'xl', md: '2xl' }}  variants={itemVariants}>Teste por 7 dias grátis!</MotionText>
        </MotionFlex >
    )
}
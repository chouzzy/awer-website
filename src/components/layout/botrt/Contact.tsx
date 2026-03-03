// src/components/layout/ContactUs.tsx
'use client';

// --- React e Frameworks ---
import { useState } from 'react';
import {
    Flex,
    Heading,
    Text,
    VStack,
    Button,
    Icon,
    Field,
    Input,
    Textarea,
    Stack,
    Box, // Adicionado para a animação
} from "@chakra-ui/react";
import { motion, Variants, AnimatePresence } from 'framer-motion';
import animationData from '../../../../public/botrt/contact/mail.json';
import { useLottie } from "lottie-react";


import { useForm } from "react-hook-form";

// --- Ícones ---
import { PiHeadset, PiWhatsappLogo } from "react-icons/pi";

// ============================================================================
//   DADOS E FUNÇÕES UTILITÁRIAS
// ============================================================================

const whatsappNumber = 5511939437893;

// Interface para os valores do formulário
interface FormValues {
    name: string;
    message: string;
}

// Função que gera o link do WhatsApp
const generateWhatsappLink = (name: string, message: string): string => {
    const formattedMessage = `Olá, meu nome é ${name}. Gostaria de falar sobre o seguinte: ${message}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
};

// ============================================================================
//   VARIANTES DE ANIMAÇÃO (Framer Motion)
// ============================================================================
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
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

// ============================================================================
//   SUB-COMPONENTE: Animação de Contato
// ============================================================================
function ContactAnimation() {

    const defaultOptions = {
        animationData: animationData,
        loop: true,
        autoplay: true,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    const { View } = useLottie(defaultOptions);


    return (
        <Flex
            w={{ base: 'md', md: 'xl' }}
            h={{ base: 'md', md: 'xl' }}
            justify="center"
            align="center"
            position="relative"
        >
           {View}
        </Flex>
    );
}


// ============================================================================
//   COMPONENTE PRINCIPAL: ContactUs
// ============================================================================
export function ContactUs() {
    const MotionFlex = motion(Flex);
    const MotionHeading = motion(Heading);
    const MotionText = motion(Text);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = handleSubmit((data) => {
        const link = generateWhatsappLink(data.name, data.message);
        window.open(link, '_blank');
    });

    return (
        <MotionFlex
            as="section"
            w="100%"
            py={{ base: 16, md: 24 }}
            px={{ base: 4, md: 8 }}
            color="white"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <Flex
                w="100%"
                maxW="container.xl"
                mx="auto"
                direction={{ base: 'column-reverse', lg: 'row' }}
                gap={{ base: 12, lg: 16 }}
                alignItems="center"
            >
                {/* Coluna da Esquerda (Animação de Suporte) */}
                <MotionFlex
                    flex={1}
                    justify="center"
                    align="center"
                    variants={itemVariants}
                >
                    {/* AQUI ESTÁ A MUDANÇA: Substituímos o Flex com gradiente pela nova animação */}
                    <ContactAnimation />
                </MotionFlex>

                {/* Coluna da Direita (Formulário) */}
                <MotionFlex
                    flex={1}
                    direction="column"
                    gap={4}
                    w="100%"
                    variants={itemVariants}
                >
                    <MotionHeading as="h2" size="2xl" fontWeight="bold" variants={itemVariants}>
                        Fale Conosco
                    </MotionHeading>
                    <MotionText color="gray.400" fontSize="lg" maxW="lg" variants={itemVariants}>
                        Tem alguma dúvida ou quer discutir um projeto? Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
                    </MotionText>

                    <Flex as="form" onSubmit={onSubmit} w="100%" mt={8}>
                        <Stack gap="6" w="100%" maxW="lg">
                            <Field.Root invalid={!!errors.name} >
                                <Field.Label>Seu Nome</Field.Label>
                                <Input
                                    placeholder="Digite seu nome completo"
                                    size="lg"
                                    focusRingColor="brand.500"
                                    {...register("name", { required: "O nome é obrigatório" })}
                                />
                                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.message} >
                                <Field.Label>Mensagem</Field.Label>
                                <Textarea
                                    placeholder="Como podemos ajudar?"
                                    size="lg"
                                    rows={5}
                                    focusRingColor="brand.500"
                                    {...register("message", { required: "A mensagem é obrigatória" })}
                                />
                                <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                w={{ base: '100%', md: 'auto' }}
                                alignSelf={{ base: 'stretch', md: 'flex-start' }}
                            >
                                <PiWhatsappLogo color='whatsappColor' />
                                Enviar via WhatsApp
                            </Button>
                        </Stack>
                    </Flex>
                </MotionFlex>
            </Flex>
        </MotionFlex>
    );
}

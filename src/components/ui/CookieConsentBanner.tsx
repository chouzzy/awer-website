// src/components/ui/CookieConsentBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Text,
    Link as ChakraLink,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiCookie } from 'react-icons/pi';

// ============================================================================
//   COMPONENTE PRINCIPAL: CookieConsentBanner
// ============================================================================
export function CookieConsentBanner() {
    // Estado para controlar a visibilidade do banner
    const [isVisible, setIsVisible] = useState(false);

    // Efeito que corre uma vez quando o componente é montado no cliente
    useEffect(() => {
        // Verifica no localStorage se o utilizador já deu o seu consentimento
        const consent = localStorage.getItem('cookie_consent');
        // Se não houver nenhum registo de consentimento, mostra o banner
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    // Função para lidar com a decisão do utilizador
    const handleConsent = (consent: 'accepted' | 'rejected') => {
        // Guarda a escolha no localStorage para visitas futuras
        localStorage.setItem('cookie_consent', consent);
        // Esconde o banner
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                        position: 'fixed',
                        bottom: '1rem',
                        left: '1rem',
                        right: '1rem',
                        zIndex: 10000, // Garante que fica por cima da maioria dos conteúdos
                    }}
                >
                    <Flex
                        w="100%"
                        zIndex={4}
                        maxW={'5xl'}
                        mx="auto"
                        p={4}
                        bg="gunMetal"
                        color="white"
                        borderRadius="xl"
                        boxShadow="2xl"
                        align={{ base: 'flex-start', md: 'center' }}
                        justify="space-between"
                        gap={4}
                        direction={{ base: 'column', md: 'row' }}
                    >
                        <HStack gap={3} align="center">
                            <Icon as={PiCookie} boxSize={8} color="brand.400" mt={1} />
                            <Box>
                                <Text fontWeight="bold">Este site utiliza cookies</Text>
                                <Text fontSize="xs" color="gray.300">
                                    Utilizamos cookies para melhorar a sua experiência de navegação e analisar o nosso tráfego. Ao clicar em "Aceitar", você concorda com o nosso uso de cookies. Leia a nossa{' '}
                                    <ChakraLink href="/politica-de-privacidade" textDecoration="underline" _hover={{ color: 'brand.300' }}>
                                        Política de Privacidade
                                    </ChakraLink>.
                                </Text>
                            </Box>
                        </HStack>

                        <HStack gap={3} flexShrink={0}>
                            <Button bgColor={'brand.900'} variant="outline" size="sm" onClick={() => handleConsent('rejected')}>
                                Rejeitar
                            </Button>
                            <Button colorScheme="brand" size="sm" onClick={() => handleConsent('accepted')}>
                                Aceitar
                            </Button>
                        </HStack>
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

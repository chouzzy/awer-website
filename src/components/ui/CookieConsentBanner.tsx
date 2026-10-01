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
import { updateConsent, CONSENT_STORAGE_KEY, CookieConsent } from '@/lib/analytics';

// ============================================================================
//   COMPONENTE PRINCIPAL: CookieConsentBanner
// ============================================================================
export function CookieConsentBanner() {
    // Estado para controlar a visibilidade do banner
    const [isVisible, setIsVisible] = useState(false);

    // Efeito que corre uma vez quando o componente é montado no cliente
    useEffect(() => {
        // Verifica no localStorage se o utilizador já deu o seu consentimento
        let consent: string | null = null;
        try {
            consent = localStorage.getItem(CONSENT_STORAGE_KEY);
        } catch {
            consent = null;
        }
        // Se não houver nenhum registo de consentimento, mostra o banner
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    // Função para lidar com a decisão do utilizador
    const handleConsent = (consent: CookieConsent) => {
        // Aplica a escolha no Google Consent Mode (Rejeitar mantém o rastreamento sem cookies)
        updateConsent(consent);
        // Guarda a escolha no localStorage para visitas futuras
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY, consent);
        } catch {
            // navegação privada ou armazenamento bloqueado: a escolha vale só para esta visita
        }
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
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10000, // Garante que fica por cima da maioria dos conteúdos
                    }}
                >
                    {/* Barra compacta no rodapé da tela: não cobre o conteúdo principal */}
                    <Flex
                        w="100%"
                        px={{ base: 4, md: 8 }}
                        py={{ base: 3, md: 2.5 }}
                        bg="gunMetal"
                        color="white"
                        borderTop="1px solid rgba(255,255,255,0.08)"
                        boxShadow="0 -8px 24px rgba(0,0,0,0.35)"
                        align="center"
                        justify="center"
                        gap={{ base: 3, md: 6 }}
                        direction={{ base: 'column', sm: 'row' }}
                    >
                        <HStack gap={2.5} align="center" maxW="3xl">
                            <Icon as={PiCookie} boxSize={5} color="brand.400" flexShrink={0} display={{ base: 'none', sm: 'block' }} />
                            <Text fontSize="xs" color="gray.300" lineHeight="1.45">
                                Usamos cookies para melhorar sua navegação e analisar o tráfego.{' '}
                                <ChakraLink href="/politica-de-privacidade" textDecoration="underline" color="gray.100" _hover={{ color: 'brand.300' }}>
                                    Política de Privacidade
                                </ChakraLink>
                            </Text>
                        </HStack>

                        <HStack gap={2} flexShrink={0}>
                            <Button variant="outline" size="xs" px={3} borderColor="whiteAlpha.400" color="gray.200" _hover={{ bg: 'whiteAlpha.100' }} onClick={() => handleConsent('rejected')}>
                                Rejeitar
                            </Button>
                            <Button size="xs" px={4} bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} onClick={() => handleConsent('accepted')}>
                                Aceitar
                            </Button>
                        </HStack>
                    </Flex>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

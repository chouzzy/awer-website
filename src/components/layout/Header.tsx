// src/components/layout/Header.tsx
'use client';

// ============================================================================
//   IMPORTS
// ============================================================================

// --- React e Frameworks ---
import {
    Flex,
    Image,
    Link as ChakraLink,
    Button,
    Text,
    Icon,
    Spinner, // Adicionado para feedback de carregamento
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useAuth0 } from '@auth0/auth0-react';

// --- Componentes e Dados Locais ---
import { CustomText } from "../ui/CustomText";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { headerData } from "@/data/header";
import { UserAvatar } from "./UserAvatar";
import { useProfile } from "@/contexts/ProfileContext"; // 1. Importa o nosso hook de perfil
import { PiHeadsetBold, PiRobotBold } from "react-icons/pi";
import { trackEvent } from "@/lib/analytics";

// ============================================================================
//   VARIANTES DE ANIMAÇÃO (Framer Motion)
// ============================================================================
const headerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeInOut",
        }
    }
};

// ============================================================================
//   COMPONENTE PRINCIPAL: Header
// ============================================================================
export function Header() {

    // --- Hooks e Estado ---
    const MotionFlex = motion(Flex);
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
    // 2. Obtém os dados do perfil do nosso contexto
    const { profile, isLoading: isProfileLoading } = useProfile();

    // Lógica para definir se é administrador (Equipe Awer)
    const isAdmin = isAuthenticated && user?.email?.endsWith('@awer.co');

    // --- Renderização do Componente ---
    return (
        <MotionFlex
            as="header"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            justifyContent={'space-between'}
            alignItems="center"
            py={4}
            px={{ base: 4, md: 12 }}
            w='100%'
            color={'headerColor'}
        >
            {/* Seção Esquerda: Logo */}
            <Flex alignItems={'center'} gap={{ base: 2, md: 8 }}>
                <ChakraLink href="/" _focus={{ boxShadow: 'none' }}>
                    <Image
                        src={headerData.logoSrc}
                        alt="Logo da Awer"
                        objectFit={'contain'}
                        maxW={{ base: 32, md: 32 }}
                    />
                </ChakraLink>
            </Flex>

            {/* Seção Direita: Navegação */}
            <Flex alignItems={'center'} gap={{ base: 2, sm: 3, md: 4 }}>
                <Flex
                    gap={8}
                    fontSize={'sm'}
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="center"
                >
                    {/* Links Padrão (Home, Serviços, etc) */}
                    {headerData.menu.map((item, index) => (
                        <ChakraLink key={index} href={item.href} _hover={{ color: 'brand.500', textDecoration: 'none' }}>
                            <CustomText
                                color={typeof window !== 'undefined' && window.location.pathname === item.href ? 'brand.600' : 'headerColor'}
                                text={item.title}
                                letterSpacing={1.8}
                                textTransform={'uppercase'}
                            />
                        </ChakraLink>
                    ))}

                    {/* --- ÁREA HELP AWER (CLIENTE) --- */}
                    {isAuthenticated && (
                        <ChakraLink href="/help" _hover={{ color: 'brand.500', textDecoration: 'none' }}>
                            <CustomText text="Suporte" letterSpacing={1.8} textTransform={'uppercase'} />
                        </ChakraLink>
                    )}

                    {/* --- ÁREA QG AWER (ADMIN) --- */}
                    {isAdmin && (
                        <Flex gap={2}>
                            <ChakraLink href="/awer-admin/tickets" _hover={{ textDecoration: 'none' }}>
                                <Button size="sm" bg="brand.500" color="white" px={4} _hover={{ bg: 'brand.600' }}>
                                    <Icon as={PiHeadsetBold} />
                                    HELP AWER
                                </Button>
                            </ChakraLink>
                            <ChakraLink href="/awer-admin/botrt/usuarios" _hover={{ textDecoration: 'none' }}>
                                <Button size="sm" bg="gray.700" color="white" px={4} _hover={{ bg: 'gray.600' }}>
                                    <Icon as={PiRobotBold} />
                                    BOTRT
                                </Button>
                            </ChakraLink>
                        </Flex>
                    )}

                    {/* Lógica do Painel/Dashboard existente */}
                    {isAuthenticated && (
                        isProfileLoading ? <Spinner size="sm" /> :
                            profile?.isAwerClient && (
                                <ChakraLink href="/dashboard" _hover={{ textDecoration: 'none' }}>
                                    <CustomText
                                        borderRadius={'md'}
                                        bgColor={'ghostWhite'}
                                        py={1} px={2} mr={4}
                                        color={'brand.500'}
                                        text="Painel"
                                        letterSpacing={1.8}
                                        textTransform={'uppercase'}
                                    />
                                </ChakraLink>
                            )
                    )}

                    {/* Avatar ou Login */}
                    {isAuthenticated ? <UserAvatar /> : (
                        <Button
                            onClick={() => {
                                trackEvent({ event: 'login_click', source: 'header' });
                                loginWithRedirect();
                            }}
                        >
                            Entrar
                        </Button>
                    )}
                </Flex>

                {/* Menu Mobile - Passamos o isAdmin para ele também */}
                <HeaderMobileMenu
                    isAuthenticated={isAuthenticated}
                    isAwerClient={profile?.isAwerClient || false}
                    isAdmin={isAdmin}
                />
            </Flex>
        </MotionFlex>
    );
}

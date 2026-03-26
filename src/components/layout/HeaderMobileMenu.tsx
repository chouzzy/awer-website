// src/components/layout/HeaderMobileMenu.tsx
'use client';

// ============================================================================
//   IMPORTS
// ============================================================================

// --- Componentes Chakra UI ---
// Usando o Menu do Ark UI, que é a base para o Chakra v3
import { Box, Menu, Button, Portal, Link as ChakraLink, Avatar, Flex, Icon, Text, Spinner, Badge } from "@chakra-ui/react";

// --- Ícones ---
import { PiList, PiSignOut } from "react-icons/pi";

// --- Dados Locais ---
import { headerData } from "@/data/header";
import { whatsappLink } from "@/utils";
import { MotionButton } from "../ui/MotionButton";
import { useAuth0 } from "@auth0/auth0-react";
import { UserAvatar } from "./UserAvatar";
import { CustomText } from "../ui/CustomText";
import { useProfile } from "@/contexts/ProfileContext";

// ============================================================================
//   COMPONENTE PRINCIPAL: HeaderMobileMenu
// ============================================================================
// Este componente cria o menu "hamburger" que é exibido apenas em telas pequenas.

interface HeaderMobileMenuProps {
    isAuthenticated: boolean;
    isAwerClient: boolean;
    isAdmin?: boolean; // Adicionada prop
}

export function HeaderMobileMenu({ isAuthenticated, isAwerClient, isAdmin }: HeaderMobileMenuProps) {
    const { loginWithRedirect } = useAuth0();
    const { isLoading: isProfileLoading } = useProfile();

    return (
        <Box display={{ base: 'block', md: 'none' }}>
            <Flex align="center" gap={2}>
                {/* Botão Painel rápido se for cliente */}
                {isAuthenticated && !isProfileLoading && isAwerClient && (
                    <ChakraLink href="/dashboard">
                        <Badge colorPalette="red" variant="solid" borderRadius="full" px={2}>Painel</Badge>
                    </ChakraLink>
                )}

                {isAuthenticated ? <UserAvatar /> : (
                    <Button size="sm" onClick={() => loginWithRedirect()}>Entrar</Button>
                )}

                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="outline" size="sm"><PiList /></Button>
                    </Menu.Trigger>

                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                {/* Links Padrão */}
                                {headerData.menu.map((item) => (
                                    <Menu.Item key={item.title} value={item.title} asChild>
                                        <ChakraLink href={item.href} w="100%" px={3} py={2}>{item.title}</ChakraLink>
                                    </Menu.Item>
                                ))}

                                {/* --- LINKS DE SUPORTE NO MOBILE --- */}
                                {isAuthenticated && (
                                    <>
                                        <Menu.Separator />
                                        <Menu.Item value="suporte" asChild>
                                            <ChakraLink href="/help" w="100%" px={3} py={2} color="brand.500" fontWeight="bold">
                                                Minha Central de Suporte
                                            </ChakraLink>
                                        </Menu.Item>
                                    </>
                                )}

                                {isAdmin && (
                                    <Menu.Item value="admin" asChild>
                                        <ChakraLink href="/awer-admin/tickets" w="100%" px={3} py={2} bg="brand.500" color="white">
                                            QG Awer (Gestão)
                                        </ChakraLink>
                                    </Menu.Item>
                                )}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>
        </Box>
    );
}

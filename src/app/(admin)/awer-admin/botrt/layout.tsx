'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
    Flex, Spinner, Box, Container, HStack, Text, Button, Link,
} from '@chakra-ui/react';

export default function BotrtAdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
    const router = useRouter();

    const isAdmin = user?.email?.endsWith('@awer.co');

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !isAdmin)) {
            router.replace('/');
        }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    if (isLoading) {
        return (
            <Flex w="100vw" h="50vh" align="center" justify="center">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return (
            <Flex w="100vw" h="50vh" align="center" justify="center" flexDir="column" gap={4}>
                <Text color="gray.400">Acesso restrito.</Text>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loginWithRedirect({ authorizationParams: { prompt: 'login' } })}
                >
                    Entrar com outra conta
                </Button>
            </Flex>
        );
    }

    return (
        <Box w="100%" minH="100vh">
            {/* Barra de navegação do painel */}
            <Box
                borderBottom="1px solid"
                borderColor="whiteAlpha.100"
                bg="rgba(10, 12, 16, 0.8)"
                backdropFilter="blur(12px)"
                position="sticky"
                top={0}
                zIndex={10}
            >
                <Container maxW="container.xl">
                    <HStack py={3} justify="space-between">
                        <HStack gap={6}>
                            <Text fontWeight="bold" color="brand.500" fontSize="sm">
                                BoTRT Admin
                            </Text>
                            <HStack gap={4} fontSize="sm">
                                <Link href="/awer-admin/botrt/usuarios" color="gray.300" _hover={{ color: 'white' }}>
                                    Usuários
                                </Link>
                                <Link href="/awer-admin/botrt/analytics" color="gray.300" _hover={{ color: 'white' }}>
                                    Analytics
                                </Link>
                            </HStack>
                        </HStack>
                        <HStack gap={3}>
                            <Text fontSize="xs" color="gray.500">{user?.email}</Text>
                            <Button
                                size="xs"
                                variant="ghost"
                                color="gray.400"
                                onClick={() => loginWithRedirect({ authorizationParams: { prompt: 'login' } })}
                            >
                                Trocar conta
                            </Button>
                            <Button
                                size="xs"
                                variant="ghost"
                                color="red.400"
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            >
                                Sair
                            </Button>
                        </HStack>
                    </HStack>
                </Container>
            </Box>

            {children}
        </Box>
    );
}

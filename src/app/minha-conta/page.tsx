// src/app/minha-conta/page.tsx
'use client';

// --- React e Frameworks ---
import { useState, useEffect } from 'react';
import {
    Flex,
    Heading,
    Text,
    VStack,
    Button,
    Icon,
    Spinner,
    Alert,
    Badge,
    HStack,
    Image,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { PiCreditCard, PiCalendar, PiSealCheckFill } from "react-icons/pi";

// --- Tipagem para os dados da assinatura ---
interface SubscriptionData {
    status: string;
    currentPeriodEnd: string;
    planName: string;
}

// ============================================================================
//   COMPONENTE PRINCIPAL: MinhaContaPage
// ============================================================================
export default function MinhaContaPage() {
    const MotionFlex = motion(Flex);
    const { user, isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently } = useAuth0();

    // Estados para controlar o carregamento e os dados
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    //URL base da nossa API do backend, vinda das variáveis de ambiente
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    console.log('Auth0 User:', user);

    // Efeito para buscar os dados da assinatura quando o componente montar
    useEffect(() => {
        const getSubscriptionData = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    // TODO: Criar este endpoint no backend
                    const response = await fetch(`${apiBaseUrl}/api/subscription/details`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Não foi possível carregar os dados da sua assinatura.');
                    }

                    const data = await response.json();
                    setSubscription(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (!isAuthLoading) {
            getSubscriptionData();
        }
    }, [isAuthenticated, isAuthLoading, getAccessTokenSilently]);

    // Função para redirecionar o usuário para o Stripe Customer Portal
    const redirectToCustomerPortal = async () => {
        setIsPortalLoading(true);
        try {
            const token = await getAccessTokenSilently();
            // TODO: Criar este endpoint no backend
            const response = await fetch(`${apiBaseUrl}/api/stripe/create-portal-session`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { url } = await response.json();
            window.location.href = url;
        } catch (err) {
            console.error("Erro ao redirecionar para o portal:", err);
            // Adicionar um toast de erro aqui
        } finally {
            setIsPortalLoading(false);
        }
    };

    // Renderiza um spinner enquanto a autenticação ou os dados estão carregando
    if (isAuthLoading || isLoading) {
        return (
            <Flex w="100%" minH="80vh" justify="center" align="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    // Renderiza uma mensagem de erro se a busca falhar
    if (error) {
        return (
            <Flex w="100%" minH="80vh" justify="center" align="center" px={4}>
                <Alert.Root status="error" maxW="lg" borderRadius="md">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title >Ocorreu um erro!</Alert.Title>
                        <Alert.Description >{error}</Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            </Flex>
        );
    }

    // Renderiza o painel principal se tudo ocorrer bem
    return (
        <MotionFlex
            w="100%"
            minH="80vh"
            justifyContent="center"
            alignItems="center"
            color="white"
            px={4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <VStack
                gap={8}
                bg="#1C1C1C"
                p={{ base: 6, md: 10 }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="gray.700"
                boxShadow="lg"
                w="100%"
                maxW="2xl"
            >
                <VStack gap={2}>
                    <Image
                        src={
                            user?.picture
                                ? user.picture
                                : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.email || user?.name || 'user')}`
                        }
                        alt="Avatar"
                        boxSize="80px"
                        borderRadius="full"
                        bg="gray.700"
                    />
                    <Heading as="h1" size="3xl">Minha Assinatura</Heading>
                    <Text color="gray.400">Gerencie suas informações e detalhes de pagamento.</Text>
                </VStack>

                <Flex h={2} w='100%' borderColor="gray.700" />

                {subscription ? (
                    <VStack gap={4} align="stretch" w="100%">
                        <Flex justify="space-between" align="center">
                            <HStack>
                                <Icon as={PiSealCheckFill} color="brand.400" />
                                <Text fontSize={{base:'lg', md:'xl'}} fontWeight="medium">Plano Atual</Text>
                            </HStack>
                            <Text fontSize={{base:'lg', md:'xl'}} fontWeight="bold">{subscription.planName}</Text>
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <HStack>
                                <Icon as={PiCalendar} color="brand.400" />
                                <Text fontSize={{base:'lg', md:'xl'}} fontWeight="medium">Próxima Cobrança</Text>
                            </HStack>
                            <Text fontSize={{base:'lg', md:'xl'}} fontWeight="bold">{new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}</Text>
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <HStack>
                                <Icon as={PiCreditCard} color="brand.400" />
                                <Text fontSize={{base:'lg', md:'xl'}} fontWeight="medium">Status</Text>
                            </HStack>
                            <Badge fontSize={{base:'md', md:'lg'}} py={1} px={4} fontWeight="medium" variant="solid" colorScheme={subscription.status === 'active' ? 'green' : subscription.status === 'trialing' ? 'blue' : 'red'}>
                                {subscription.status === 'active' ? 'Ativa' : subscription.status === 'trialing' ? 'Em Teste' : 'Inativa'}
                            </Badge>
                        </Flex>
                    </VStack>
                ) : (
                    <Text color="gray.500">Nenhuma assinatura ativa encontrada.</Text>
                )}

                <Button
                    colorScheme="brand"
                    size="lg"
                    w="100%"
                    onClick={() => redirectToCustomerPortal()}
                    loading={isPortalLoading}
                >
                    Gerenciar Assinatura e Pagamentos
                </Button>
            </VStack>
        </MotionFlex>
    );
}

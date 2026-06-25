'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Flex, VStack, Text, Heading, Button, Spinner } from '@chakra-ui/react';

type Status = 'redirecting' | 'success' | 'error';

export default function BotrtCallbackPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<Status>('redirecting');
    const [errorMsg, setErrorMsg] = useState('');

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Monta a URL de deeplink de volta para o Electron
    const deeplink = code
        ? `botrt://callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}`
        : null;

    useEffect(() => {
        if (error) {
            setErrorMsg(errorDescription || error);
            setStatus('error');
            return;
        }
        if (!deeplink) {
            setErrorMsg('Parâmetros de autenticação ausentes.');
            setStatus('error');
            return;
        }

        // Tenta abrir o app automaticamente
        window.location.href = deeplink;

        // Após 1s considera sucesso (app recebeu o deeplink)
        const t = setTimeout(() => setStatus('success'), 1000);
        return () => clearTimeout(t);
    }, [deeplink, error, errorDescription]);

    const handleManualOpen = () => {
        if (deeplink) window.location.href = deeplink;
    };

    return (
        <Flex
            w="100vw"
            minH="100vh"
            align="center"
            justify="center"
            bg="blue.950"
            color="white"
            p={6}
        >
            {status === 'redirecting' && (
                <VStack gap={6} textAlign="center">
                    <Spinner size="xl" color="brand.500" borderWidth="3px" />
                    <Heading size="md">Abrindo o BoTRT...</Heading>
                    <Text fontSize="sm" color="gray.400">
                        Redirecionando de volta para o aplicativo.
                    </Text>
                </VStack>
            )}

            {status === 'success' && (
                <VStack gap={6} textAlign="center" maxW="400px">
                    {/* Checkmark animado */}
                    <Flex
                        w="80px"
                        h="80px"
                        borderRadius="full"
                        bg="green.900"
                        border="2px solid"
                        borderColor="green.500"
                        align="center"
                        justify="center"
                        fontSize="2xl"
                    >
                        ✓
                    </Flex>

                    <VStack gap={2}>
                        <Heading size="lg">
                            Autenticação concluída!
                        </Heading>
                        <Text fontSize="sm" color="gray.400">
                            Você pode fechar esta aba e voltar para o BoTRT.
                        </Text>
                    </VStack>

                    <Button
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        _hover={{ color: 'white' }}
                        onClick={handleManualOpen}
                    >
                        O app não abriu? Clique aqui
                    </Button>
                </VStack>
            )}

            {status === 'error' && (
                <VStack gap={6} textAlign="center" maxW="400px">
                    <Flex
                        w="80px"
                        h="80px"
                        borderRadius="full"
                        bg="red.900"
                        border="2px solid"
                        borderColor="red.500"
                        align="center"
                        justify="center"
                        fontSize="2xl"
                    >
                        ✕
                    </Flex>

                    <VStack gap={2}>
                        <Heading size="md" color="red.400">Falha na autenticação</Heading>
                        <Text fontSize="sm" color="gray.400">
                            {errorMsg || 'Ocorreu um erro inesperado. Tente fazer login novamente pelo app.'}
                        </Text>
                    </VStack>

                    <Button
                        size="sm"
                        variant="ghost"
                        color="gray.500"
                        onClick={() => window.close()}
                    >
                        Fechar esta aba
                    </Button>
                </VStack>
            )}
        </Flex>
    );
}

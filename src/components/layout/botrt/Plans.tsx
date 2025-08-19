// src/components/layout/botrtPlans.tsx
'use client';

// --- React e Frameworks ---
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    List,
    ListItem,
    Button,
    Icon,
    Flex,
    Badge,
    Spinner,
    Checkbox, // 1. Importa o Checkbox
} from "@chakra-ui/react";
import { motion, Variants } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';

// --- Ícones ---
import { PiCheckCircleFill } from "react-icons/pi";

// --- Componentes Locais ---
import { TermsModal } from '@/components/ui/TermsModal';


// ============================================================================
//   DADOS DOS PLANOS
// ============================================================================
const baseMonthlyPrice = 499.90;
const annualPrice = baseMonthlyPrice * 12 * 0.85;

const plansData = [
    {
        name: "Plano Mensal",
        priceId: process.env.NEXT_PUBLIC_STRIPE_BOTRT_MENSAL || null,
        price: baseMonthlyPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        billingCycle: "/mês",
        description: "Ideal para experimentar todo o poder do BoTRT sem compromisso a longo prazo.",
        features: [
            "Extração ilimitada de dados",
            "Pesquisas de audiências Minha Pauta",
            "Extração de Processos Arquivados",
            "Pesquisa e filtragem automática de processos do Acervo Geral",
            "Suporte técnico integral via e-mail e chat",
            "Manutenção e atualizações contínuas",
            "Infraestrutura de servidores inclusa",
            "Suporte e treinamento personalizado",
        ],
        buttonText: "Assinar Agora",
    },
    {
        name: "Plano Anual",
        priceId: process.env.NEXT_PUBLIC_STRIPE_BOTRT_ANUAL || null,
        price: (annualPrice / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        billingCycle: "/mês",
        description: `Cobrado anualmente por ${annualPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
        features: [
            "15% de desconto sobre o valor total",
            "Extração ilimitada de dados",
            "Pesquisas de audiências Minha Pauta",
            "Extração de Processos Arquivados",
            "Pesquisa e filtragem automática de processos do Acervo Geral",
            "Suporte técnico integral via e-mail e chat",
            "Manutenção e atualizações contínuas",
            "Infraestrutura de servidores inclusa",
            "Prioridade no atendimento de suporte",
            "Suporte e treinamento personalizado",
        ],
        buttonText: "Quero Economizar",
        isRecommended: true,
    },
    {
        name: "Plano Premium",
        priceId: null,
        price: 'Em breve',
        billingCycle: "",
        description: "A solução definitiva para escritórios que buscam a vanguarda da inovação tecnológica.",
        features: [
            "Todos os benefícios do plano anual",
            "Busca agendada de audiências",
            "Rastreio de audiências (em breve)",
            "Extração de processos do CEAT (em breve)",
            "Pesquisa de audiências de sustentação oral (em breve)",
            "Emissão de guias via Caixa (em breve)",
            "Emissão de guias via Banco do Brasil (em breve)",
            "Emissão de guias via PJE (em breve)",
        ],
        buttonText: "Seja Premium",
    }
];

// ============================================================================
//   VARIANTES DE ANIMAÇÃO
// ============================================================================
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// ============================================================================
//   COMPONENTE PRINCIPAL: BotrtPlans
// ============================================================================
export function BotrtPlans() {
    const MotionFlex = motion(Flex);
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubscription = async (priceId: string) => {
        setSelectedPlan(priceId);
        setIsLoading(true);

        if (!isAuthenticated) {
            await loginWithRedirect({
                appState: {
                    returnTo: '/tecnologia/botrt',
                    action: 'subscribe',
                    priceId: priceId,
                }
            });
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: priceId,
                    auth0UserId: user?.sub,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Falha ao criar a sessão de checkout.');
            }
        } catch (error) {
            console.error("Erro no checkout:", error);
        } finally {
            setIsLoading(false);
            setSelectedPlan(null);
        }
    };

    useEffect(() => {
        const action = searchParams.get('action');
        const priceId = searchParams.get('priceId');

        if (isAuthenticated && action === 'subscribe' && priceId) {
            router.replace('/tecnologia/botrt');
            handleSubscription(priceId);
        }
    }, [isAuthenticated, searchParams, router]);

    return (
        <Flex
            as="section"
            w="100%"
            py={{ base: 16, md: 24 }}
            px={{ base: 4, md: 8 }}
            bg="gray.900"
            color="white"
            flexDir={'column'}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <VStack gap={4} textAlign="center" mb={{ base: 12, md: 16 }}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">
                    Planos flexíveis para o seu escritório
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.400" maxW="2xl" mx="auto">
                    Escolha o plano que melhor se adapta ao seu momento e comece a transformar sua operação jurídica hoje mesmo.
                </Text>
            </VStack>

            <MotionFlex
                flexDir={{ base: 'column', md: "row" }}
                gap={{ base: 8, md: 10 }}
                maxW="container.lg"
                mx="auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                alignItems={"stretch"}
                justifyContent={"center"}
                h='100%'
            >
                {plansData.map((plan, index) => (
                    <MotionFlex h='100%' key={index} variants={itemVariants}>
                        <PricingCard
                            {...plan}
                            isLoading={isLoading && selectedPlan === plan.priceId}
                            onSubscribe={() => plan.priceId && handleSubscription(plan.priceId)}
                        />
                    </MotionFlex>
                ))}
            </MotionFlex>
        </Flex>
    );
}

// ============================================================================
//   SUB-COMPONENTE: PricingCard (ATUALIZADO)
// ============================================================================
interface PricingCardProps {
    name: string;
    price: string;
    priceId: string | null;
    billingCycle: string;
    description: string;
    features: string[];
    buttonText: string;
    isRecommended?: boolean;
    isLoading: boolean;
    onSubscribe: () => void;
}

function PricingCard({ name, price, priceId, billingCycle, description, features, buttonText, isRecommended = false, isLoading, onSubscribe }: PricingCardProps) {
    // 3. Estado para controlar se os termos foram aceites
    const [termsAccepted, setTermsAccepted] = useState(false);

    return (
        <Flex
            p={8}
            flexDir={'column'}
            justifyContent={'space-between'}
            alignItems={'stretch'}
            maxW={'sm'}
            bg={isRecommended ? "brand.600" : "#1C1C1C"}
            color={isRecommended ? "white" : "inherit"}
            borderRadius="xl"
            border="1px solid"
            borderColor={isRecommended ? "brand.500" : "gray.700"}
            gap={6}
            textAlign="left"
            h="100%"
            minH={720}
            position="relative"
            transform={isRecommended ? { base: 'none', lg: 'scale(1.05)' } : 'none'}
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{
                transform: "translateY(-8px)",
                boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.2), 0px 10px 10px -5px rgba(0, 0, 0, 0.1);"
            }}
        >
            {isRecommended && (
                <Badge
                    position="absolute"
                    top="-14px"
                    left="50%"
                    transform="translateX(-50%)"
                    colorScheme="blue"
                    px={4}
                    py={1}
                    borderRadius="full"
                    border={'1px solid'}
                    borderColor={'white'}
                    textTransform="uppercase"
                    fontWeight="bold"
                >
                    Mais Popular
                </Badge>
            )}

            <VStack align="start" w="100%">
                <Heading as="h3" size="lg">{name}</Heading>
                <HStack align="baseline">
                    <Text fontSize={{ base: '4xl', lg: "5xl" }} fontWeight="bold">{price}</Text>
                    <Text fontSize={{ base: 'md', lg: "lg" }} color={isRecommended ? "gray.200" : "gray.400"}>{billingCycle}</Text>
                </HStack>
                <Text fontSize={{ base: "sm", md: "md" }} color={isRecommended ? "gray.200" : "gray.500"}>{description}</Text>
            </VStack>

            <Flex flexDir={'column'} as='ul' gap={3} w="100%" flex={1}>
                {features.map((feature, index) => (
                    <Flex as="li" key={index} alignItems={'center'} gap={2}>
                        <Icon as={PiCheckCircleFill} color={isRecommended ? "white" : "brand.500"} />
                        <Text fontSize={{ base: 'sm', md: 'md' }}>{feature}</Text>
                    </Flex>
                ))}
            </Flex>

            {/* A MUDANÇA: VStack para agrupar o Checkbox e o Botão */}
            <VStack w="100%" gap={4}>
                <Flex flexDir={'row'} alignItems={'center'} gap={2}>
                    <Checkbox.Root
                        size="sm"
                        colorScheme="blue"
                        checked={termsAccepted}
                        onCheckedChange={(e) => setTermsAccepted(!!e.checked)}
                        cursor={'pointer'}
                    >
                        <Checkbox.Control cursor={'pointer'} />
                        <Checkbox.HiddenInput />

                    </Checkbox.Root>
                    <TermsModal />
                </Flex>

                <Button
                    w="100%"
                    size="lg"
                    borderRadius={'lg'}
                    color={isRecommended ? "black" : "white"}
                    bgColor={isRecommended ? "white" : "brand.500"}
                    _hover={{
                        bgColor: 'brand.800',
                        color: "white"
                    }}
                    onClick={onSubscribe}
                    loading={isLoading}
                    // 4. O botão agora também depende dos termos aceites
                    disabled={!priceId || !termsAccepted || isLoading}
                >
                    {isLoading ? 'Aguarde...' : buttonText}
                </Button>
            </VStack>
        </Flex>
    );
}

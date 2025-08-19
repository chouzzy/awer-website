// src/app/politica-de-privacidade/page.tsx
'use client';

import {
    Flex,
    Heading,
    Text,
    VStack,
    Box,
    List,
    // A MUDANÇA: Adicionando Icon e HStack para a nova estrutura de lista
    Icon,
    HStack,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { PiShieldCheck } from "react-icons/pi";

// ============================================================================
//   COMPONENTE PRINCIPAL: PrivacyPolicyPage
// ============================================================================
export default function PrivacyPolicyPage() {
    const MotionVStack = motion(VStack);

    return (
        <MotionVStack
            w="100%"
            bg="white"
            color="gray.800"
            px={{ base: 4, md: 8 }}
            py={{ base: 16, md: 24 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <VStack w="100%" maxW="container.md" mx="auto" gap={8} align="stretch">
                <VStack align="start" gap={2}>
                    <Heading as="h1" size="2xl">Política de Privacidade</Heading>
                    <Text color="gray.500">Última atualização: 15 de Agosto de 2025</Text>
                </VStack>

                <Text>
                    A Awer Consultoria ("nós", "nosso") opera o site awer.co e o serviço BoTRT. Esta página informa sobre as nossas políticas relativas à recolha, uso e divulgação de dados pessoais quando utiliza o nosso Serviço. A sua privacidade é importante para nós.
                </Text>

                <VStack align="stretch" gap={4}>
                    <Heading as="h2" size="lg" pt={6}>1. Informações que Recolhemos</Heading>
                    <Text>Recolhemos vários tipos de informações para diversas finalidades, a fim de fornecer e melhorar o nosso Serviço para si.</Text>
                    
                    {/* A MUDANÇA: Usando a nova sintaxe do List do Chakra UI v3 */}
                    <List.Root as="ul" gap={3} pt={2}>
                        <List.Item>
                            <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>
                                    <strong>Dados de Conta:</strong> Ao registar-se, recolhemos informações através do nosso parceiro de autenticação, Auth0, incluindo o seu nome, endereço de e-mail e identificador de utilizador único.
                                </Text>
                            </HStack>
                        </List.Item>
                        <List.Item>
                           <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>
                                    <strong>Dados de Pagamento:</strong> Ao assinar um plano, o nosso parceiro de pagamentos, Stripe, recolhe as informações necessárias para processar a transação, como detalhes do cartão de crédito e informações de faturação. Nós não armazenamos os dados do seu cartão de crédito nos nossos servidores.
                                </Text>
                            </HStack>
                        </List.Item>
                         <List.Item>
                           <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>
                                    <strong>Dados de Utilização (Cookies):</strong> Utilizamos cookies para operar e manter a sua sessão de login e para entender como o nosso site é utilizado, a fim de melhorar a sua experiência.
                                </Text>
                            </HStack>
                        </List.Item>
                    </List.Root>

                    <Heading as="h2" size="lg" pt={6}>2. Como Utilizamos as Suas Informações</Heading>
                    <Text>Utilizamos os dados recolhidos para:</Text>
                    
                    {/* A MUDANÇA: Usando a nova sintaxe do List do Chakra UI v3 */}
                     <List.Root as="ul" gap={3} pt={2}>
                        <List.Item>
                            <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>Fornecer e manter o nosso Serviço.</Text>
                            </HStack>
                        </List.Item>
                        <List.Item>
                           <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>Gerir a sua conta e a sua assinatura.</Text>
                            </HStack>
                        </List.Item>
                         <List.Item>
                           <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>Comunicar consigo sobre atualizações, suporte e informações administrativas.</Text>
                            </HStack>
                        </List.Item>
                         <List.Item>
                           <HStack align="start" gap={3}>
                                <Icon as={PiShieldCheck} color="brand.500" mt={1} />
                                <Text>Monitorizar a utilização do nosso Serviço para fins de melhoria.</Text>
                            </HStack>
                        </List.Item>
                    </List.Root>

                    <Heading as="h2" size="lg" pt={6}>3. Partilha de Dados</Heading>
                    <Text>
                        Não vendemos nem alugamos os seus dados pessoais a terceiros. A partilha de informações ocorre apenas com os nossos parceiros de serviços essenciais (Auth0 para autenticação e Stripe for pagamentos) para a operação do Serviço, e apenas quando necessário para cumprir as nossas obrigações legais.
                    </Text>

                    <Heading as="h2" size="lg" pt={6}>4. Segurança dos Dados</Heading>
                    <Text>
                        A segurança dos seus dados é uma prioridade. Utilizamos medidas de segurança administrativas, técnicas e físicas para proteger as suas informações pessoais. No entanto, nenhum método de transmissão pela Internet ou de armazenamento eletrónico é 100% seguro.
                    </Text>

                    <Heading as="h2" size="lg" pt={6}>5. Os Seus Direitos</Heading>
                    <Text>
                        Você tem o direito de aceder, atualizar ou solicitar a exclusão das suas informações pessoais. Pode gerir os dados da sua assinatura através da sua página de perfil ou contactando-nos diretamente.
                    </Text>

                    <Heading as="h2" size="lg" pt={6}>6. Alterações a Esta Política de Privacidade</Heading>
                    <Text>
                        Podemos atualizar a nossa Política de Privacidade periodicamente. Notificá-lo-emos de quaisquer alterações, publicando a nova Política de Privacidade nesta página.
                    </Text>

                    <Heading as="h2" size="lg" pt={6}>7. Contacte-nos</Heading>
                    <Text>
                        Se tiver alguma questão sobre esta Política de Privacidade, por favor, entre em contato connosco através do e-mail: <a href="mailto:contato@awer.co">contato@awer.co</a>.
                    </Text>
                </VStack>

            </VStack>
        </MotionVStack>
    );
}

// src/components/ui/TermsModal.tsx
'use client';

import {
    Button,
    Flex,
    Heading,
    Icon,
    // A MUDANÇA: Importando os componentes do Dialog
    Dialog,
    Portal,
    Text,
    VStack,
    Link as ChakraLink,
    CloseButton,
    Highlight,
} from "@chakra-ui/react";
import { PiFileText } from "react-icons/pi";

// ============================================================================
//   SUB-COMPONENTE: Conteúdo do Modal
// ============================================================================
function TermsContent() {
    return (
        <VStack gap={4} align="stretch" color="whiteGhost" fontSize="sm">
            <Heading as="h3" size="sm" color="white">1. Aceitação dos Termos</Heading>
            <Text>
                Ao aceder e utilizar os serviços da Awer Consultoria ("Serviço"), você concorda em cumprir estes Termos e Condições. Se não concordar com qualquer parte dos termos, não poderá aceder ao Serviço.
            </Text>

            <Heading as="h3" size="sm" color="white" pt={4}>2. Descrição do Serviço</Heading>
            <Text>
                O BoTRT é uma ferramenta de software como serviço (SaaS) que automatiza a extração de dados públicos de portais dos Tribunais Regionais do Trabalho. O serviço destina-se a otimizar a rotina de escritórios de advocacia, não substituindo a análise jurídica profissional.
            </Text>

            <Heading as="h3" size="sm" color="white" pt={4}>3. Contas e Assinaturas</Heading>
            <Text>
                Para aceder ao BoTRT, é necessário criar uma conta e manter uma assinatura ativa. Você é responsável por manter a confidencialidade da sua conta e senha. Os pagamentos são processados através do nosso parceiro Stripe e estão sujeitos aos seus termos de serviço.
            </Text>

            <Heading as="h3" size="sm" color="white" pt={4}>4. Uso Aceitável</Heading>
            <Text>
                Você concorda em não usar o Serviço para qualquer finalidade ilegal ou não autorizada. Você não deve, no uso do Serviço, violar quaisquer leis na sua jurisdição. A Awer reserva-se o direito de suspender ou encerrar o seu acesso ao Serviço por qualquer violação destes termos.
            </Text>

            <Heading as="h3" size="sm" color="white" pt={4}>5. Limitação de Responsabilidade</Heading>
            <Text>
                O Serviço é fornecido "como está". A Awer não garante que os dados extraídos estarão sempre corretos ou disponíveis, dada a dependência de sistemas de terceiros. Em nenhuma circunstância a Awer será responsável por quaisquer danos diretos ou indiretos resultantes do uso ou da incapacidade de usar o serviço.
            </Text>
        </VStack>
    );
}


// ============================================================================
//   COMPONENTE PRINCIPAL: TermsModal (ATUALIZADO PARA USAR DIALOG)
// ============================================================================
export function TermsModal() {
    return (
        <Dialog.Root>
            {/* O Link que aciona a abertura do modal */}
            <Dialog.Trigger asChild>
                <ChakraLink fontSize="sm" _hover={{ textDecoration: 'none', color: 'cadetBlue', transition: 'color 0.2s' }} cursor="pointer">
                    <Flex>
                       Eu li e concordo com os Termos e Condições de Uso
                    </Flex>
                </ChakraLink>
            </Dialog.Trigger>

            {/* O Conteúdo do Dialog */}
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="2xl">
                        <Dialog.Header>
                            <Flex align="center" gap={3}>
                                <Icon as={PiFileText} boxSize={6} />
                                <Dialog.Title>
                                    Termos e Condições
                                </Dialog.Title>
                            </Flex>
                        </Dialog.Header>
                        <Dialog.Body>
                            <TermsContent />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton position="absolute" top={2} right={2} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

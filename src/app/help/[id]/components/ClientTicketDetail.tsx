"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Flex, Text, Badge, Grid, Link, Icon, Image,
  Textarea, Button, Spinner, Center, Heading
} from "@chakra-ui/react";
import {
  PiPaperclipBold, PiFilePdfBold, PiClockBold, PiHeadsetBold,
  PiPaperPlaneRightBold, PiLockKeyBold, PiArrowCounterClockwiseBold,
  PiTicketBold
} from "react-icons/pi";
import { addTicketMessage } from "@/actions/tickets";
import { getOrCreateMongoUser } from "@/actions/users";
import { podeVerTicket } from "@/actions/projects";
import { useAuth0 } from "@auth0/auth0-react";
import { toaster } from "@/components/ui/toaster";
import { trackEvent } from "@/lib/analytics";

interface Attachment {
  url: string;
  fileName: string;
  mimeType: string;
}

interface Message {
  id: string;
  content: string;
  senderName: string;
  senderRole: "ADMIN" | "CLIENT";
  createdAt: string;
}

interface TicketDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  attachments: Attachment[];
  messages?: Message[];
  createdAt: string;
  clientId: string;
  client: { name: string; email: string };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN:        { label: "Aberto",       color: "brand.500" },
  IN_PROGRESS: { label: "Em Progresso", color: "blue.400" },
  AWAITING_FEEDBACK: { label: "Aguardando feedback", color: "purple.400" },
  RESOLVED:    { label: "Resolvido",    color: "green.400" },
  CLOSED:      { label: "Fechado",      color: "gray.500" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW:    { label: "Baixa",   color: "green.400" },
  MEDIUM: { label: "Média",   color: "yellow.400" },
  HIGH:   { label: "Alta",    color: "orange.400" },
  URGENT: { label: "Urgente", color: "red.500" },
};

export function ClientTicketDetail({ ticket }: { ticket: TicketDetail }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);
  const [podeVer, setPodeVer] = useState<boolean | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sincroniza usuário Auth0 → MongoDB
  useEffect(() => {
    async function sync() {
      if (isAuthenticated && user?.sub) {
        const mongoUser = await getOrCreateMongoUser(user.sub, user.email || "");
        setDbUser(mongoUser);
        // a permissão é decidida no servidor: projeto liberado, chamado próprio
        // ou time Awer. Antes era só "sou o dono?", o que barrava o cliente nos
        // chamados que a Awer registrou por ele.
        setPodeVer(await podeVerTicket(mongoUser._id, ticket.id));
      }
    }
    sync();
  }, [isAuthenticated, user]);

  // Polling: atualiza mensagens a cada 20s enquanto ticket está aberto
  useEffect(() => {
    if (ticket.status === "CLOSED" || ticket.status === "RESOLVED") return;
    const interval = setInterval(() => {
      router.refresh();
    }, 20000);
    return () => clearInterval(interval);
  }, [ticket.status, router]);

  // Scroll automático para o final das mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages]);

  if (isLoading || (isAuthenticated && (!dbUser || podeVer === null))) {
    return <Center h="400px"><Spinner color="brand.500" size="xl" /></Center>;
  }

  // Permissão por projeto (calculada no servidor)
  if (dbUser && podeVer === false) {
    return (
      <Center h="400px" bg="rgba(255, 95, 94, 0.05)" borderRadius="2xl" border="1px dashed" borderColor="brand.500">
        <Flex direction="column" align="center" gap={4}>
          <Icon as={PiLockKeyBold} boxSize={12} color="brand.500" />
          <Box textAlign="center">
            <Heading size="md" color="ghostWhite" mb={2}>Acesso Restrito</Heading>
            <Text color="gray.400">
              Este chamado é de um projeto ao qual você não tem acesso. <br />
              Se acha que deveria ver, fale com a Awer.
            </Text>
          </Box>
        </Flex>
      </Center>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dbUser) return;
    setIsSending(true);

    try {
      const result = await addTicketMessage(ticket.id, newMessage, {
        name: dbUser.name || user?.name || user?.email || "Cliente",
        role: "CLIENT"
      });

      if (result.success) {
        setNewMessage("");
        trackEvent({ event: 'ticket_message_send', ticket_id: ticket.id });
        router.refresh();
      } else {
        toaster.create({ title: "Erro ao enviar mensagem", description: result.error, type: "error" });
      }
    } catch {
      toaster.create({ title: "Erro inesperado", description: "Tente novamente.", type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSendMessage();
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const statusInfo = statusConfig[ticket.status] ?? { label: ticket.status, color: "gray.400" };
  const priorityInfo = priorityConfig[ticket.priority] ?? { label: ticket.priority, color: "gray.400" };

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={8} align="flex-start">

      {/* Coluna Principal */}
      <Box flex="2" w="100%">

        {/* Cabeçalho do ticket */}
        <Box bg="rgba(15, 17, 21, 0.6)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100" mb={6}>
          <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={6}>
            <Box flex={1}>
              <Text color="ghostWhite" fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={2}>
                {ticket.title}
              </Text>
              <Flex align="center" gap={2} color="gray.500" fontSize="sm">
                <Icon as={PiClockBold} />
                <Text>Aberto em {new Date(ticket.createdAt).toLocaleString('pt-BR')}</Text>
              </Flex>
            </Box>
            <Flex gap={2} align="center" flexWrap="wrap">
              <Badge bg={priorityInfo.color} color="white" borderRadius="full" px={3} py={1} fontSize="xs">
                {priorityInfo.label}
              </Badge>
              <Badge bg={statusInfo.color} color="white" borderRadius="full" px={3} py={1}>
                {statusInfo.label}
              </Badge>
            </Flex>
          </Flex>

          <Box w="100%" h="1px" bg="whiteAlpha.100" mb={6} />

          <Box mb={ticket.attachments?.length > 0 ? 8 : 0}>
            <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={3} textTransform="uppercase" letterSpacing="wider">
              Descrição do Problema
            </Text>
            <Text color="ghostWhite" whiteSpace="pre-wrap" lineHeight="tall">{ticket.description}</Text>
          </Box>

          {/* Anexos */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Box>
              <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={4} textTransform="uppercase" letterSpacing="wider">
                Anexos ({ticket.attachments.length})
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                {ticket.attachments.map((file, idx) => (
                  <Link key={idx} href={file.url} target="_blank" rel="noopener noreferrer" _hover={{ textDecoration: 'none' }}>
                    <Flex align="center" p={3} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100"
                      borderRadius="lg" gap={3}
                      _hover={{ borderColor: "brand.500", bg: "whiteAlpha.100" }} transition="all 0.2s"
                    >
                      {file.mimeType.startsWith("image/") ? (
                        <Image src={file.url} alt={file.fileName} boxSize="40px" objectFit="cover" borderRadius="md" />
                      ) : (
                        <Center boxSize="40px" bg="whiteAlpha.100" borderRadius="md">
                          <Icon as={PiFilePdfBold} color="red.400" boxSize={5} />
                        </Center>
                      )}
                      <Box overflow="hidden" flex={1}>
                        <Text color="ghostWhite" fontSize="sm" fontWeight="medium" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                          {file.fileName}
                        </Text>
                        <Flex align="center" gap={1} color="gray.500" fontSize="xs">
                          <Icon as={PiPaperclipBold} />
                          <Text>Ver anexo</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Link>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        {/* Chat de Mensagens */}
        <Box bg="rgba(15, 17, 21, 0.6)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
          <Flex justify="space-between" align="center" mb={6}>
            <Flex align="center" gap={3}>
              <Text color="ghostWhite" fontSize="lg" fontWeight="bold">Conversação</Text>
              {ticket.messages && ticket.messages.length > 0 && (
                <Badge bg="whiteAlpha.200" color="gray.300" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  {ticket.messages.length}
                </Badge>
              )}
            </Flex>
            {ticket.status !== "CLOSED" && (
              <Button
                size="xs"
                variant="ghost"
                color="gray.500"
                _hover={{ color: "brand.400", bg: "whiteAlpha.100" }}
                onClick={handleManualRefresh}
                loading={isRefreshing}
              >
                <Icon as={PiArrowCounterClockwiseBold} />
                <Text ml={1}>Atualizar</Text>
              </Button>
            )}
          </Flex>

          {/* Mensagens */}
          <Flex direction="column" gap={4} mb={6} maxH="500px" overflowY="auto"
            css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '4px' } }}
          >
            {(!ticket.messages || ticket.messages.length === 0) ? (
              <Flex direction="column" align="center" py={10} gap={3}>
                <Icon as={PiHeadsetBold} boxSize={8} color="gray.600" />
                <Text color="gray.500" fontSize="sm" fontStyle="italic" textAlign="center">
                  Nenhuma mensagem ainda. <br />A equipa da Awer responderá em breve.
                </Text>
              </Flex>
            ) : (
              ticket.messages.map((msg, idx) => {
                const isClient = msg.senderRole === "CLIENT";
                return (
                  <Flex key={idx} justify={isClient ? "flex-end" : "flex-start"}>
                    <Box
                      bg={isClient ? "whiteAlpha.150" : "brand.500"}
                      color="white"
                      p={4}
                      borderRadius="xl"
                      borderBottomRightRadius={isClient ? "0" : "xl"}
                      borderBottomLeftRadius={isClient ? "xl" : "0"}
                      maxW={{ base: "90%", md: "75%" }}
                    >
                      <Flex justify="space-between" align="center" mb={1.5} gap={4}>
                        <Text fontSize="xs" fontWeight="bold" opacity={0.8}>{msg.senderName}</Text>
                        <Text fontSize="2xs" opacity={0.5} whiteSpace="nowrap">
                          {new Date(msg.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                        </Text>
                      </Flex>
                      <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="tall">{msg.content}</Text>
                    </Box>
                  </Flex>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Flex>

          {/* Input de mensagem */}
          {ticket.status !== "CLOSED" ? (
            <Box>
              <Flex gap={3} align="flex-end">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreva a sua mensagem... (Ctrl+Enter para enviar)"
                  bg="rgba(15, 17, 21, 0.6)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  _placeholder={{ color: "gray.600" }}
                  _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
                  rows={3}
                  resize="none"
                />
                <Button
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  h="auto"
                  py={6}
                  px={5}
                  onClick={handleSendMessage}
                  loading={isSending}
                  disabled={!newMessage.trim()}
                  flexShrink={0}
                >
                  <Icon as={PiPaperPlaneRightBold} boxSize={5} />
                </Button>
              </Flex>
              <Text color="gray.600" fontSize="xs" mt={2}>Ctrl+Enter para enviar</Text>
            </Box>
          ) : (
            <Flex justify="center" p={4} bg="whiteAlpha.50" borderRadius="lg" border="1px dashed" borderColor="whiteAlpha.200">
              <Text color="gray.400" fontSize="sm">Este chamado está encerrado. Abra um novo chamado se precisar de ajuda.</Text>
            </Flex>
          )}
        </Box>
      </Box>

      {/* Sidebar */}
      <Box flex="1" w="100%" position={{ lg: "sticky" }} top="24px">
        <Flex direction="column" gap={4}>

          {/* Info do ticket */}
          <Box bg="rgba(15, 17, 21, 0.6)" p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
            <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={4} textTransform="uppercase" letterSpacing="wider">
              Detalhes
            </Text>
            <Flex direction="column" gap={3}>
              <Flex justify="space-between" align="center">
                <Text color="gray.500" fontSize="sm">ID</Text>
                <Text color="gray.400" fontSize="xs" fontFamily="mono">#{ticket.id.slice(-8).toUpperCase()}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text color="gray.500" fontSize="sm">Status</Text>
                <Badge bg={statusInfo.color} color="white" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  {statusInfo.label}
                </Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text color="gray.500" fontSize="sm">Prioridade</Text>
                <Badge bg={priorityInfo.color} color="white" borderRadius="full" px={2} py={0.5} fontSize="xs">
                  {priorityInfo.label}
                </Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text color="gray.500" fontSize="sm">Mensagens</Text>
                <Text color="ghostWhite" fontSize="sm" fontWeight="bold">{ticket.messages?.length ?? 0}</Text>
              </Flex>
              {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" && (
                <Flex align="center" gap={2} mt={1} pt={3} borderTop="1px solid" borderColor="whiteAlpha.100">
                  <Box w={2} h={2} borderRadius="full" bg="green.400" flexShrink={0}
                    style={{ animation: "pulse 2s infinite" }}
                  />
                  <Text color="gray.500" fontSize="xs">Atualiza automaticamente a cada 20s</Text>
                </Flex>
              )}
            </Flex>
          </Box>

          {/* Suporte Awer */}
          <Box bg="rgba(15, 17, 21, 0.6)" p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
            <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={4} textTransform="uppercase" letterSpacing="wider">
              Suporte Awer
            </Text>
            <Flex align="center" gap={3}>
              <Center boxSize="44px" bg="brand.500" borderRadius="full" flexShrink={0}>
                <Icon as={PiHeadsetBold} color="white" boxSize={5} />
              </Center>
              <Box>
                <Text color="ghostWhite" fontWeight="bold" fontSize="sm">Atendimento Humano</Text>
                <Text color="gray.400" fontSize="xs">Segunda a Sexta, 9h–18h</Text>
              </Box>
            </Flex>
          </Box>

        </Flex>
      </Box>
    </Flex>
  );
}

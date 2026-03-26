"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, Badge, Grid, Link, Icon, Image, Textarea, Button, Spinner, Center, Heading } from "@chakra-ui/react";
import { PiPaperclipBold, PiFilePdfBold, PiClockBold, PiHeadsetBold, PiPaperPlaneRightBold, PiLockKeyBold } from "react-icons/pi";
import { addTicketMessage } from "@/actions/tickets";
import { getOrCreateMongoUser } from "@/actions/users";
import { useAuth0 } from "@auth0/auth0-react";

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
  clientId: string; // Adicionado para validação
  client: {
    name: string;
    email: string;
  };
}

export function ClientTicketDetail({ ticket }: { ticket: TicketDetail }) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 1. Sincroniza o usuário logado com o MongoDB
  useEffect(() => {
    async function sync() {
      if (isAuthenticated && user?.sub) {
        const mongoUser = await getOrCreateMongoUser(user.sub, user.email || "");
        setDbUser(mongoUser);
      }
    }
    sync();
  }, [isAuthenticated, user]);

  // Estados de Carregamento
  if (isLoading || (isAuthenticated && !dbUser)) {
    return <Center h="400px"><Spinner color="brand.500" size="xl" /></Center>;
  }

  // 2. O CADEADO: Validação de Segurança
  // Se o usuário logado tentar acessar um ticket que tem um clientId diferente do dele
  if (dbUser && dbUser._id !== ticket.clientId) {
    return (
      <Center h="400px" bg="rgba(255, 95, 94, 0.05)" borderRadius="2xl" border="1px dashed" borderColor="brand.500">
        <Flex direction="column" align="center" gap={4}>
          <Icon as={PiLockKeyBold} boxSize={12} color="brand.500" />
          <Box textAlign="center">
            <Heading size="md" color="ghostWhite" mb={2}>Acesso Restrito</Heading>
            <Text color="gray.400">Este chamado pertence a outra conta. <br/> Certifique-se de que está logado com o e-mail correto.</Text>
          </Box>
        </Flex>
      </Center>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "brand.500";
      case "IN_PROGRESS": return "blue.400";
      case "RESOLVED": return "green.400";
      case "CLOSED": return "gray.500";
      default: return "gray.400";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "OPEN": return "Aberto";
      case "IN_PROGRESS": return "Em Progresso";
      case "RESOLVED": return "Resolvido";
      case "CLOSED": return "Fechado";
      default: return status;
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dbUser) return;
    setIsSending(true);

    try {
      // Usamos o nome do dbUser (vinculado ao MongoDB) para a mensagem
      const result = await addTicketMessage(ticket.id, newMessage, { 
        name: dbUser.name, 
        role: "CLIENT" 
      });

      if (result.success) {
        setNewMessage("");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar mensagem.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={8} align="flex-start">
      
      {/* Coluna Principal: Conteúdo do Ticket & Mensagens */}
      <Box flex="2" w="100%">
        
        {/* Detalhes do Chamado */}
        <Box bg="rgba(15, 17, 21, 0.6)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100" mb={8}>
          <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={6}>
            <Box>
              <Text color="ghostWhite" fontSize="2xl" fontWeight="bold" mb={2}>{ticket.title}</Text>
              <Flex align="center" gap={2} color="gray.500" fontSize="sm">
                <Icon as={PiClockBold} />
                <Text>Aberto em {new Date(ticket.createdAt).toLocaleString('pt-PT')}</Text>
              </Flex>
            </Box>
            <Flex gap={2} align="center">
              <Badge bg={getStatusColor(ticket.status)} color="white" borderRadius="full" px={3} py={1}>
                {translateStatus(ticket.status)}
              </Badge>
            </Flex>
          </Flex>

          <Box w="100%" h="1px" bg="whiteAlpha.100" mb={6} />

          <Box mb={8}>
            <Text color="gray.400" fontSize="sm" fontWeight="bold" mb={2} textTransform="uppercase">Descrição do Problema</Text>
            <Text color="ghostWhite" whiteSpace="pre-wrap" lineHeight="tall">{ticket.description}</Text>
          </Box>

          {/* Anexos */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Box>
              <Text color="gray.400" fontSize="sm" fontWeight="bold" mb={4} textTransform="uppercase">
                Anexos ({ticket.attachments.length})
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                {ticket.attachments.map((file, idx) => (
                  <Link key={idx} href={file.url} target="_blank" rel="noopener noreferrer" _hover={{ textDecoration: 'none' }}>
                    <Flex align="center" p={3} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" borderRadius="lg" _hover={{ borderColor: "brand.500", bg: "whiteAlpha.100" }} transition="all 0.2s" gap={4}>
                      {isImage(file.mimeType) ? (
                        <Image src={file.url} alt={file.fileName} boxSize="40px" objectFit="cover" borderRadius="md" />
                      ) : (
                        <Flex align="center" justify="center" boxSize="40px" bg="whiteAlpha.100" borderRadius="md"><Icon as={PiFilePdfBold} color="red.400" boxSize={6} /></Flex>
                      )}
                      <Box overflow="hidden">
                        <Text color="ghostWhite" fontSize="sm" fontWeight="medium" maxLines={1}>{file.fileName}</Text>
                      </Box>
                    </Flex>
                  </Link>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        {/* Feed de Mensagens (Chat) */}
        <Box>
          <Text color="ghostWhite" fontSize="xl" fontWeight="bold" mb={4}>Chat</Text>
          <Flex direction="column" gap={4} mb={6}>
            {(!ticket.messages || ticket.messages.length === 0) ? (
              <Text color="gray.500" fontSize="sm" fontStyle="italic">A equipa da Awer responderá em breve.</Text>
            ) : (
              ticket.messages.map((msg, idx) => {
                const isMyMessage = msg.senderRole === "CLIENT";
                return (
                  <Box 
                    key={idx} 
                    bg={isMyMessage ? "whiteAlpha.200" : "brand.500"} 
                    color="white"
                    p={4} 
                    borderRadius="xl"
                    borderBottomLeftRadius={isMyMessage ? "xl" : "0"}
                    borderBottomRightRadius={isMyMessage ? "0" : "xl"}
                    alignSelf={isMyMessage ? "flex-end" : "flex-start"}
                    maxW="80%"
                  >
                    <Flex justify="space-between" align="center" mb={2} gap={4}>
                      <Text fontSize="xs" fontWeight="bold" opacity={0.8}>{msg.senderName}</Text>
                      <Text fontSize="2xs" opacity={0.6}>{new Date(msg.createdAt).toLocaleString('pt-PT')}</Text>
                    </Flex>
                    <Text fontSize="sm" whiteSpace="pre-wrap">{msg.content}</Text>
                  </Box>
                )
              })
            )}
          </Flex>

          {/* Input de Mensagem */}
          {ticket.status !== "CLOSED" ? (
            <Flex gap={3} align="flex-end">
              <Textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                bg="rgba(15, 17, 21, 0.6)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                color="white"
                _focus={{ borderColor: "brand.500" }}
                rows={3}
                resize="none"
              />
              <Button 
                bg="brand.500" 
                color="white" 
                _hover={{ bg: "#e55554" }} 
                h="100%" 
                py={8}
                onClick={handleSendMessage}
                loading={isSending}
                disabled={!newMessage.trim()}
              >
                <Icon as={PiPaperPlaneRightBold} boxSize={5} />
              </Button>
            </Flex>
          ) : (
            <Flex justify="center" p={4} bg="whiteAlpha.50" borderRadius="md" border="1px dashed" borderColor="whiteAlpha.200">
              <Text color="gray.400" fontSize="sm">Este chamado está encerrado.</Text>
            </Flex>
          )}
        </Box>
      </Box>

      {/* Sidebar: Suporte */}
      <Box flex="1" w="100%" position={{ lg: "sticky" }} top="24px">
        <Box bg="rgba(15, 17, 21, 0.6)" p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
          <Text color="gray.400" fontSize="sm" fontWeight="bold" mb={4} textTransform="uppercase">Suporte Awer</Text>
          <Flex align="center" gap={4}>
            <Center boxSize="50px" bg="whiteAlpha.100" borderRadius="full">
              <Icon as={PiHeadsetBold} color="brand.500" boxSize={6} />
            </Center>
            <Box>
              <Text color="ghostWhite" fontWeight="bold" fontSize="sm">Atendimento Humano</Text>
              <Text color="gray.400" fontSize="xs">Segunda a Sexta, 9h-18h</Text>
            </Box>
          </Flex>
        </Box>
      </Box>

    </Flex>
  );
}
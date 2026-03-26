"use client";

import { useState } from "react";
import { Box, Flex, Text, Badge, Grid, Link, Icon, Image, Textarea, Button, Spinner } from "@chakra-ui/react";
import { PiPaperclipBold, PiFilePdfBold, PiClockBold, PiUserBold, PiPaperPlaneRightBold } from "react-icons/pi";
import { addTicketMessage } from "@/actions/tickets";

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
  messages?: Message[]; // Agora incluímos as mensagens
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
}

export function TicketDetailClient({ ticket }: { ticket: TicketDetail }) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "brand.500";
      case "IN_PROGRESS": return "blue.400";
      case "RESOLVED": return "green.400";
      case "CLOSED": return "gray.500";
      default: return "gray.400";
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);

    try {
      // Como estamos no QG Admin, o senderRole é sempre ADMIN
      const result = await addTicketMessage(ticket.id, newMessage, { 
        name: "Awer Support", // Aqui entrará o nome do teu utilizador logado no futuro
        role: "ADMIN" 
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
        
        {/* Bloco 1: Detalhes do Chamado */}
        <Box bg="rgba(15, 17, 21, 0.6)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100" mb={8}>
          <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={6}>
            <Box>
              <Text color="ghostWhite" fontSize="2xl" fontWeight="bold" mb={2}>{ticket.title}</Text>
              <Flex align="center" gap={2} color="gray.500" fontSize="sm">
                <Icon as={PiClockBold} />
                <Text>Aberto em {new Date(ticket.createdAt).toLocaleString('pt-PT')}</Text>
              </Flex>
            </Box>
            <Flex gap={2}>
              <Badge colorScheme="gray" variant="outline" borderRadius="full" px={3} py={1}>{ticket.priority}</Badge>
              <Badge bg={getStatusColor(ticket.status)} color="white" borderRadius="full" px={3} py={1}>
                {ticket.status.replace("_", " ")}
              </Badge>
            </Flex>
          </Flex>

          <Box w="100%" h="1px" bg="whiteAlpha.100" mb={6} />

          <Box mb={8}>
            <Text color="gray.400" fontSize="sm" fontWeight="bold" mb={2} textTransform="uppercase">Descrição do Problema</Text>
            <Text color="ghostWhite" whiteSpace="pre-wrap" lineHeight="tall">{ticket.description}</Text>
          </Box>

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

        {/* Bloco 2: Feed de Mensagens (Chat) */}
        <Box>
          <Text color="ghostWhite" fontSize="xl" fontWeight="bold" mb={4}>Chat</Text>
          
          <Flex direction="column" gap={4} mb={6}>
            {(!ticket.messages || ticket.messages.length === 0) ? (
              <Text color="gray.500" fontSize="sm" fontStyle="italic">Nenhuma interação até ao momento.</Text>
            ) : (
              ticket.messages.map((msg, idx) => (
                <Box 
                  key={idx} 
                  bg={msg.senderRole === "ADMIN" ? "brand.500" : "whiteAlpha.100"} 
                  color="white"
                  p={4} 
                  borderRadius="xl"
                  borderBottomLeftRadius={msg.senderRole === "ADMIN" ? "xl" : "0"}
                  borderBottomRightRadius={msg.senderRole === "ADMIN" ? "0" : "xl"}
                  alignSelf={msg.senderRole === "ADMIN" ? "flex-end" : "flex-start"}
                  maxW="80%"
                >
                  <Flex justify="space-between" align="center" mb={2} gap={4}>
                    <Text fontSize="xs" fontWeight="bold" opacity={0.8}>{msg.senderName}</Text>
                    <Text fontSize="2xs" opacity={0.6}>{new Date(msg.createdAt).toLocaleString('pt-PT')}</Text>
                  </Flex>
                  <Text fontSize="sm" whiteSpace="pre-wrap">{msg.content}</Text>
                </Box>
              ))
            )}
          </Flex>

          {/* Input de Nova Mensagem */}
          <Flex gap={3} align="flex-end">
            <Textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escreve uma resposta para o cliente..."
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
              h="auto" 
              py={3}
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
            >
              {isSending ? <Spinner size="sm" /> : <Icon as={PiPaperPlaneRightBold} boxSize={5} />}
            </Button>
          </Flex>
        </Box>

      </Box>

      {/* Coluna Lateral: Info do Cliente (Mantém igual) */}
      <Box flex="1" w="100%" position="sticky" top="24px">
        <Box bg="rgba(15, 17, 21, 0.6)" p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
          <Text color="gray.400" fontSize="sm" fontWeight="bold" mb={4} textTransform="uppercase">Informações do Cliente</Text>
          <Flex align="center" gap={4}>
            <Flex align="center" justify="center" boxSize="50px" bg="whiteAlpha.100" borderRadius="full">
              <Icon as={PiUserBold} color="brand.500" boxSize={6} />
            </Flex>
            <Box>
              <Text color="ghostWhite" fontWeight="bold">{ticket.client.name}</Text>
              <Text color="gray.400" fontSize="sm">{ticket.client.email}</Text>
            </Box>
          </Flex>
        </Box>
      </Box>

    </Flex>
  );
}
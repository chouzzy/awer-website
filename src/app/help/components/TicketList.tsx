"use client";

import { getPriorityColor, priorityTranslator } from "@/utils/tags";
import { Box, Flex, Text, Badge, Stack, Icon, Link, Center, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PiTicketBold, PiClockBold, PiPaperclipBold } from "react-icons/pi";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

interface Attachment {
  url: string;
  fileName: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  attachments: Attachment[];
  createdAt: string;
  clientId: string; // Adicionado para consistência
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ALTERAÇÃO: Agora o componente recebe o clientId para garantir que a lista seja filtrada
export function TicketList({ 
  initialTickets, 
  clientId 
}: { 
  initialTickets: Ticket[], 
  clientId: string 
}) {
  
  // Filtramos os tickets no client-side por segurança extra, 
  // embora o ideal seja já virem filtrados do servidor.
  const myTickets = initialTickets.filter(t => t.clientId === clientId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "brand.500";
      case "IN_PROGRESS": return "blue.400";
      case "AWAITING_FEEDBACK": return "purple.400";
      case "RESOLVED": return "green.400";
      case "CLOSED": return "gray.500";
      default: return "gray.400";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "OPEN": return "Aberto";
      case "IN_PROGRESS": return "Em Progresso";
      case "AWAITING_FEEDBACK": return "Aguardando feedback";
      case "RESOLVED": return "Resolvido";
      case "CLOSED": return "Fechado";
      default: return status;
    }
  };

  if (myTickets.length === 0) {
    return (
      <Flex 
        justify="center" 
        align="center" 
        py={20} 
        bg="rgba(15, 17, 21, 0.4)" 
        borderRadius="xl" 
        border="1px dashed" 
        borderColor="whiteAlpha.200"
        direction="column"
        gap={4}
      >
        <Icon as={PiTicketBold} boxSize={10} color="whiteAlpha.300" />
        <Text color="gray.400" fontWeight="medium">Ainda não tens chamados abertos.</Text>
      </Flex>
    );
  }

  return (
    <MotionStack variants={containerVariants} initial="hidden" animate="visible" gap={4} w="100%">
      {myTickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/help/${ticket.id}`}
          _hover={{ textDecoration: 'none' }}
          w="100%"
        >
          <MotionBox
            variants={itemVariants}
            bg="rgba(15, 17, 21, 0.6)"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            p={6}
            _hover={{
              borderColor: "brand.500",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 20px rgba(255, 95, 94, 0.15)",
              transition: "all 0.2s ease-in-out"
            }}
          >
            <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>

              <Flex align="flex-start" gap={4} flex="1">
                <Flex align="center" justify="center" bg="whiteAlpha.100" p={3} borderRadius="md" mt={1}>
                  <Icon as={PiTicketBold} boxSize={6} color="brand.600" />
                </Flex>
                <Box>
                  <Text color="ghostWhite" fontWeight="bold" fontSize="lg" mb={1}>
                    {ticket.title}
                  </Text>
                    <Text
                    color="gray.400"
                    fontSize="sm"
                    maxLines={2}
                    mb={3}
                    whiteSpace="pre-wrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    >
                    {ticket.description.slice(0, 100)}
                    </Text>

                  <Flex align="center" gap={4} flexWrap="wrap">
                    <Flex align="center" gap={1} color="gray.500" fontSize="xs">
                      <Icon as={PiClockBold} />
                      <Text>{new Date(ticket.createdAt).toLocaleDateString('pt-PT')}</Text>
                    </Flex>

                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <Flex align="center" gap={1} color="brand.500" fontSize="xs">
                        <Icon as={PiPaperclipBold} />
                        <Text>{ticket.attachments.length} anexo(s)</Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              </Flex>

              <Flex gap={2} direction="column" align="flex-start">
                <Badge bg={getStatusColor(ticket.status)} color="white" borderRadius="xs" px={3} py={1} fontSize="xs">
                  {translateStatus(ticket.status)}
                </Badge>
                <Badge bg={getPriorityColor(ticket.priority)} color="white" borderRadius="xs" px={3} py={1} fontSize="xs">
                  {priorityTranslator(ticket.priority)}
                </Badge>
              </Flex>

            </Flex>
          </MotionBox>
        </Link>
      ))}
    </MotionStack>
  );
}
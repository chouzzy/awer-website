"use client";

import { useState } from "react";
import {
  Box, Flex, Text, Badge, Spinner,
  Portal, Select, createListCollection,
  Link
} from "@chakra-ui/react";
import { updateTicketStatus } from "@/actions/tickets";

interface TicketAdmin {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
}

// 1. Criar a coleção de status usando a API v3 fora do componente
const statusCollection = createListCollection({
  items: [
    { label: "Aberto", value: "OPEN" },
    { label: "Em Progresso", value: "IN_PROGRESS" },
    { label: "Resolvido", value: "RESOLVED" },
    { label: "Fechado", value: "CLOSED" },
  ],
});

export function AdminTicketList({ initialTickets }: { initialTickets: TicketAdmin[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "brand.500";
      case "IN_PROGRESS": return "blue.400";
      case "RESOLVED": return "green.400";
      case "CLOSED": return "gray.500";
      default: return "gray.400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW": return "green.500";
      case "MEDIUM": return "yellow.500";
      case "HIGH": return "orange.500";
      case "URGENT": return "red.500";
      default: return "gray.400";
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setLoadingId(ticketId);
    try {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (!result.success) {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar estado.");
    } finally {
      setLoadingId(null);
    }
  };

  if (initialTickets.length === 0) {
    return (
      <Flex justify="center" p={10}>
        <Text color="gray.400">Nenhum chamado no sistema. Paz e sossego!</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" w="100%">
      {/* Cabeçalho da Tabela */}
      <Flex
        bg="whiteAlpha.50"
        p={4}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
        display={{ base: "none", md: "flex" }}
      >
        <Text flex="2" color="gray.400" fontSize="sm" fontWeight="bold">Chamado</Text>
        <Text flex="1.5" color="gray.400" fontSize="sm" fontWeight="bold">Cliente</Text>
        <Text flex="1" color="gray.400" fontSize="sm" fontWeight="bold">Prioridade</Text>
        <Text flex="1" color="gray.400" fontSize="sm" fontWeight="bold">Ação Rápida</Text>
      </Flex>

      {/* Linhas da Tabela */}
      {initialTickets.map((ticket) => (
        <Flex
          key={ticket.id}
          p={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.50"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
          _hover={{ bg: "whiteAlpha.50" }}
          transition="background 0.2s"
        >
          {/* Info do Chamado */}
          {/* Info do Chamado */}
          <Box flex="2" w="100%">
            <Link
              href={`/awer-admin/tickets/${ticket.id}`}
              _hover={{ textDecoration: 'none' }}
            >
              <Text
                color="ghostWhite"
                fontWeight="bold"
                maxLines={1}
                mb={1}
                _hover={{ color: "brand.500", transition: "color 0.2s" }}
              >
                {ticket.title}
              </Text>
            </Link>
            <Text color="gray.500" fontSize="xs">
              Aberto em: {new Date(ticket.createdAt).toLocaleDateString('pt-PT')}
            </Text>
          </Box>

          {/* Info do Cliente */}
          <Box flex="1.5" w="100%">
            <Text color="gray.300" fontSize="sm" maxLines={1}>{ticket.clientName}</Text>
            <Text color="gray.500" fontSize="xs" maxLines={1}>{ticket.clientEmail}</Text>
          </Box>

          {/* Prioridade */}
          <Box flex="1" w="100%">
            <Badge
              colorPalette={getPriorityColor(ticket.priority).split('.')[0]}
              variant="solid"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
            >
              {ticket.priority === "LOW" ? "Baixa" : ticket.priority === "MEDIUM" ? "Média" : ticket.priority === "HIGH" ? "Alta" : "Urgente"}
            </Badge>
          </Box>

          {/* Alterar Status (Novo Chakra UI v3 Select) */}
          <Flex flex="1" w="100%" align="center" gap={3}>
            <Select.Root
              collection={statusCollection}
              value={[ticket.status]} // A API v3 usa arrays para os values
              onValueChange={(e) => handleStatusChange(ticket.id, e.value[0])}
              disabled={loadingId === ticket.id}
              size="sm"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bg={getStatusColor(ticket.status)}
                  color="white"
                  borderColor="transparent"
                  borderRadius="md"
                  _hover={{ opacity: 0.9 }}
                >
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator color="white" />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                    {statusCollection.items.map((item) => (
                      <Select.Item
                        item={item}
                        key={item.value}
                        _hover={{ bg: "whiteAlpha.100" }}
                        color="white"
                        cursor="pointer"
                      >
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {loadingId === ticket.id && <Spinner size="sm" color="brand.500" />}
          </Flex>

        </Flex>
      ))}
    </Flex>
  );
}
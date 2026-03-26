"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box, Flex, Text, Badge, Spinner,
  Portal, Select, createListCollection,
  Link, Grid, Button, Icon
} from "@chakra-ui/react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
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

// ==========================================
// COLEÇÕES ESTÁTICAS PARA OS FILTROS
// ==========================================
const statusCollection = createListCollection({
  items: [
    { label: "Aberto", value: "OPEN" },
    { label: "Em Progresso", value: "IN_PROGRESS" },
    { label: "Resolvido", value: "RESOLVED" },
    { label: "Fechado", value: "CLOSED" },
  ],
});

const filterStatusCollection = createListCollection({
  items: [{ label: "Todos os Status", value: "ALL" }, ...statusCollection.items],
});

const filterPriorityCollection = createListCollection({
  items: [
    { label: "Todas as Prioridades", value: "ALL" },
    { label: "Baixa", value: "LOW" },
    { label: "Média", value: "MEDIUM" },
    { label: "Alta", value: "HIGH" },
    { label: "Urgente", value: "URGENT" },
  ],
});

const sortCollection = createListCollection({
  items: [
    { label: "Mais Novos Primeiro", value: "desc" },
    { label: "Mais Antigos Primeiro", value: "asc" },
  ],
});

export function AdminTicketList({ initialTickets }: { initialTickets: TicketAdmin[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ==========================================
  // ESTADOS DOS FILTROS E PAGINAÇÃO
  // ==========================================
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterClient, setFilterClient] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reseta para a página 1 sempre que um filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, filterClient, sortOrder]);

  // ==========================================
  // LÓGICA DE DADOS (Memoizada para performance)
  // ==========================================
  // 1. Extrai os clientes únicos para o Select de Filtro
  const clientCollection = useMemo(() => {
    const uniqueClients = Array.from(new Set(initialTickets.map(t => t.clientName).filter(Boolean)));
    return createListCollection({
      items: [
        { label: "Todos os Clientes", value: "ALL" },
        ...uniqueClients.map(c => ({ label: c, value: c }))
      ]
    });
  }, [initialTickets]);

  // 2. Aplica Filtros e Ordenação
  const processedTickets = useMemo(() => {
    let temp = [...initialTickets];

    if (filterStatus !== "ALL") temp = temp.filter(t => t.status === filterStatus);
    if (filterPriority !== "ALL") temp = temp.filter(t => t.priority === filterPriority);
    if (filterClient !== "ALL") temp = temp.filter(t => t.clientName === filterClient);

    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return temp;
  }, [initialTickets, filterStatus, filterPriority, filterClient, sortOrder]);

  // 3. Aplica a Paginação
  const totalPages = Math.ceil(processedTickets.length / itemsPerPage) || 1;
  const currentData = processedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==========================================
  // HELPERS VISUAIS
  // ==========================================
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
      if (!result.success) alert(result.error);
      // Como a Action tem revalidatePath, o Next.js vai atualizar o initialTickets sozinho!
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
    <Flex direction="column" w="100%" gap={6}>
      
      {/* ================= BARRA DE FILTROS ================= */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} p={4} bg="whiteAlpha.50" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
        
        <Box>
          <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Status</Text>
          <Select.Root collection={filterStatusCollection} value={[filterStatus]} onValueChange={(e) => setFilterStatus(e.value[0])} size="sm">
            <Select.HiddenSelect />
            <Select.Control><Select.Trigger><Select.ValueText /></Select.Trigger></Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                  {filterStatusCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} cursor="pointer">
                      {item.label} <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Prioridade</Text>
          <Select.Root collection={filterPriorityCollection} value={[filterPriority]} onValueChange={(e) => setFilterPriority(e.value[0])} size="sm">
            <Select.HiddenSelect />
            <Select.Control><Select.Trigger><Select.ValueText /></Select.Trigger></Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                  {filterPriorityCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} cursor="pointer">
                      {item.label} <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Cliente</Text>
          <Select.Root collection={clientCollection} value={[filterClient]} onValueChange={(e) => setFilterClient(e.value[0])} size="sm">
            <Select.HiddenSelect />
            <Select.Control><Select.Trigger><Select.ValueText /></Select.Trigger></Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                  {clientCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} cursor="pointer">
                      {item.label} <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        <Box>
          <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Ordenar por</Text>
          <Select.Root collection={sortCollection} value={[sortOrder]} onValueChange={(e) => setSortOrder(e.value[0])} size="sm">
            <Select.HiddenSelect />
            <Select.Control><Select.Trigger><Select.ValueText /></Select.Trigger></Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                  {sortCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} cursor="pointer">
                      {item.label} <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>
      </Grid>

      {/* ================= TABELA DE TICKETS ================= */}
      <Box border="1px solid" borderColor="whiteAlpha.100" borderRadius="xl" overflow="hidden">
        {/* Cabeçalho da Tabela */}
        <Flex bg="whiteAlpha.50" p={4} borderBottom="1px solid" borderColor="whiteAlpha.100" display={{ base: "none", md: "flex" }}>
          <Text flex="2" color="gray.400" fontSize="sm" fontWeight="bold">Chamado</Text>
          <Text flex="1.5" color="gray.400" fontSize="sm" fontWeight="bold">Cliente</Text>
          <Text flex="1" color="gray.400" fontSize="sm" fontWeight="bold">Prioridade</Text>
          <Text flex="1" color="gray.400" fontSize="sm" fontWeight="bold">Ação Rápida</Text>
        </Flex>

        {currentData.length === 0 ? (
          <Flex justify="center" p={8}>
            <Text color="gray.500">Nenhum chamado encontrado com estes filtros.</Text>
          </Flex>
        ) : (
          currentData.map((ticket) => (
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
              <Box flex="2" w="100%">
                <Link href={`/awer-admin/tickets/${ticket.id}`} _hover={{ textDecoration: 'none' }}>
                  <Text color="ghostWhite" fontWeight="bold" maxLines={1} mb={1} _hover={{ color: "brand.500", transition: "color 0.2s" }}>
                    {ticket.title}
                  </Text>
                </Link>
                <Text color="gray.500" fontSize="xs">
                  Aberto em: {new Date(ticket.createdAt).toLocaleDateString('pt-PT')}
                </Text>
              </Box>

              <Box flex="1.5" w="100%">
                <Text color="gray.300" fontSize="sm" maxLines={1}>{ticket.clientName}</Text>
                <Text color="gray.500" fontSize="xs" maxLines={1}>{ticket.clientEmail}</Text>
              </Box>

              <Box flex="1" w="100%">
                <Badge colorPalette={getPriorityColor(ticket.priority).split('.')[0]} variant="solid" borderRadius="full" px={3} py={1} fontSize="xs">
                  {ticket.priority === "LOW" ? "Baixa" : ticket.priority === "MEDIUM" ? "Média" : ticket.priority === "HIGH" ? "Alta" : "Urgente"}
                </Badge>
              </Box>

              <Flex flex="1" w="100%" align="center" gap={3}>
                <Select.Root
                  collection={statusCollection}
                  value={[ticket.status]}
                  onValueChange={(e) => handleStatusChange(ticket.id, e.value[0])}
                  disabled={loadingId === ticket.id}
                  size="sm"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger bg={getStatusColor(ticket.status)} color="white" borderColor="transparent" borderRadius="md" _hover={{ opacity: 0.9 }}>
                      <Select.ValueText />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                        {statusCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} color="white" cursor="pointer">
                            {item.label} <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
                {loadingId === ticket.id && <Spinner size="sm" color="brand.500" />}
              </Flex>
            </Flex>
          ))
        )}
      </Box>

      {/* ================= PAGINAÇÃO ================= */}
      {totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={2}>
          <Text color="gray.500" fontSize="sm">
            Mostrando {currentData.length} de {processedTickets.length} chamados
          </Text>
          
          <Flex gap={2}>
            <Button 
              size="sm" 
              variant="outline" 
              borderColor="whiteAlpha.200" 
              color="white"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              _hover={{ bg: "whiteAlpha.100" }}
            >
              <Icon as={PiCaretLeftBold} />
            </Button>
            
            <Flex align="center" px={4} bg="whiteAlpha.50" borderRadius="md" border="1px solid" borderColor="whiteAlpha.200">
              <Text color="white" fontSize="sm" fontWeight="bold">
                {currentPage} / {totalPages}
              </Text>
            </Flex>

            <Button 
              size="sm" 
              variant="outline" 
              borderColor="whiteAlpha.200"
              color="white"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              _hover={{ bg: "whiteAlpha.100" }}
            >
              <Icon as={PiCaretRightBold} />
            </Button>
          </Flex>
        </Flex>
      )}

    </Flex>
  );
}
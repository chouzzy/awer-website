"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box, Flex, Text, Badge, Spinner, Portal,
  Select, createListCollection,
  Link, Button, Icon, Input,
  Dialog,
} from "@chakra-ui/react";
import {
  PiCaretLeftBold, PiCaretRightBold, PiMagnifyingGlassBold,
  PiWarningBold, PiXBold
} from "react-icons/pi";
import { updateTicketStatus } from "@/actions/tickets";
import { toaster } from "@/components/ui/toaster";

interface TicketAdmin {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  projectName?: string;
}

const statusCollection = createListCollection({
  items: [
    { label: "Aberto",       value: "OPEN" },
    { label: "Em Progresso", value: "IN_PROGRESS" },
    { label: "Aguardando feedback", value: "AWAITING_FEEDBACK" },
    { label: "Resolvido",    value: "RESOLVED" },
    { label: "Fechado",      value: "CLOSED" },
  ],
});

const filterPriorityCollection = createListCollection({
  items: [
    { label: "Todas as Prioridades", value: "ALL" },
    { label: "Baixa",    value: "LOW" },
    { label: "Média",    value: "MEDIUM" },
    { label: "Alta",     value: "HIGH" },
    { label: "Urgente",  value: "URGENT" },
  ],
});

const sortCollection = createListCollection({
  items: [
    { label: "Mais Novos Primeiro", value: "desc" },
    { label: "Mais Antigos Primeiro", value: "asc" },
  ],
});

const statusColorMap: Record<string, string> = {
  OPEN:        "brand.500",
  IN_PROGRESS: "blue.400",
  AWAITING_FEEDBACK: "purple.400",
  RESOLVED:    "green.400",
  CLOSED:      "gray.500",
};

const priorityColorMap: Record<string, string> = {
  LOW:    "green.500",
  MEDIUM: "yellow.500",
  HIGH:   "orange.500",
  URGENT: "red.500",
};

const priorityLabel: Record<string, string> = {
  LOW: "Baixa", MEDIUM: "Média", HIGH: "Alta", URGENT: "Urgente",
};

const statusLabel: Record<string, string> = {
  OPEN: "Aberto", IN_PROGRESS: "Em Progresso", AWAITING_FEEDBACK: "Aguardando feedback",
  RESOLVED: "Resolvido", CLOSED: "Fechado",
};

// ─── Dialog de confirmação de mudança de status ─────────────────────────────
interface ConfirmStatusDialogProps {
  open: boolean;
  ticketTitle: string;
  newStatusLabel: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmStatusDialog({ open, ticketTitle, newStatusLabel, isLoading, onConfirm, onCancel }: ConfirmStatusDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onCancel(); }}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" />
        <Dialog.Positioner>
          <Dialog.Content bg="#111114" border="1px solid" borderColor="whiteAlpha.150" borderRadius="2xl" maxW="sm" p={6}>
            <Flex direction="column" gap={5}>
              <Flex align="center" gap={3}>
                <Flex align="center" justify="center" bg="orange.900" borderRadius="full" p={3}>
                  <Icon as={PiWarningBold} color="orange.400" boxSize={5} />
                </Flex>
                <Box>
                  <Dialog.Title color="ghostWhite" fontWeight="bold" fontSize="md">Alterar Status</Dialog.Title>
                  <Dialog.Description color="gray.400" fontSize="sm" mt={1}>
                    Alterar para <Text as="span" color="ghostWhite" fontWeight="semibold">"{newStatusLabel}"</Text>?
                  </Dialog.Description>
                </Box>
                <Button
                  size="xs" variant="ghost" color="gray.600" ml="auto"
                  _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  onClick={onCancel}
                >
                  <Icon as={PiXBold} />
                </Button>
              </Flex>

              <Text color="gray.400" fontSize="sm">
                Ticket: <Text as="span" color="ghostWhite">"{ticketTitle}"</Text>
              </Text>

              <Flex gap={3} justify="flex-end">
                <Button
                  size="sm" variant="ghost" color="gray.400"
                  _hover={{ bg: "whiteAlpha.100", color: "white" }}
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm" bg="brand.500" color="white"
                  _hover={{ bg: "brand.600" }}
                  onClick={onConfirm}
                  loading={isLoading}
                >
                  Confirmar
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────────
export function AdminTicketList({ initialTickets }: { initialTickets: TicketAdmin[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<{ ticketId: string; newStatus: string } | null>(null);

  const [filterStatus,   setFilterStatus]   = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterClient,   setFilterClient]   = useState("ALL");
  const [filterProject,  setFilterProject]  = useState("ALL");
  const [sortOrder,      setSortOrder]      = useState("desc");
  const [searchEmail,    setSearchEmail]    = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { setCurrentPage(1); }, [filterStatus, filterPriority, filterClient, filterProject, sortOrder, searchEmail]);

  const clientCollection = useMemo(() => {
    const unique = Array.from(new Set(initialTickets.map(t => t.clientName).filter(Boolean)));
    return createListCollection({
      items: [{ label: "Todos os Clientes", value: "ALL" }, ...unique.map(c => ({ label: c, value: c }))]
    });
  }, [initialTickets]);

  const processedTickets = useMemo(() => {
    let temp = [...initialTickets];
    if (filterStatus   !== "ALL") temp = temp.filter(t => t.status   === filterStatus);
    if (filterPriority !== "ALL") temp = temp.filter(t => t.priority === filterPriority);
    if (filterClient   !== "ALL") temp = temp.filter(t => t.clientName === filterClient);
    if (filterProject  !== "ALL") {
      temp = filterProject === "__SEM__"
        ? temp.filter(t => !t.projectName)
        : temp.filter(t => t.projectName === filterProject);
    }
    if (searchEmail.trim()) {
      const q = searchEmail.trim().toLowerCase();
      temp = temp.filter(t =>
        t.clientEmail?.toLowerCase().includes(q) || t.clientName?.toLowerCase().includes(q)
      );
    }
    temp.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? diff : -diff;
    });
    return temp;
  }, [initialTickets, filterStatus, filterPriority, filterClient, filterProject, sortOrder, searchEmail]);

  const totalPages  = Math.ceil(processedTickets.length / itemsPerPage) || 1;
  const currentData = processedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Abre dialog de confirmação antes de mudar status
  const requestStatusChange = (ticketId: string, newStatus: string) => {
    setPendingChange({ ticketId, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!pendingChange) return;
    const { ticketId, newStatus } = pendingChange;
    setLoadingId(ticketId);

    try {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (result.success) {
        toaster.create({ title: `Status alterado para "${statusLabel[newStatus] ?? newStatus}"`, type: "success" });
      } else {
        toaster.create({ title: "Erro ao alterar status", description: result.error, type: "error" });
      }
    } catch {
      toaster.create({ title: "Erro inesperado", type: "error" });
    } finally {
      setLoadingId(null);
      setPendingChange(null);
    }
  };

  const pendingTicket = pendingChange
    ? initialTickets.find(t => t.id === pendingChange.ticketId)
    : null;

  // ─── Contadores por status ───────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { OPEN: 0, IN_PROGRESS: 0, AWAITING_FEEDBACK: 0, RESOLVED: 0, CLOSED: 0 };
    initialTickets.forEach(t => { if (t.status in counts) counts[t.status]++; });
    return counts;
  }, [initialTickets]);

  if (initialTickets.length === 0) {
    return (
      <Flex justify="center" p={10}>
        <Text color="gray.400">Nenhum chamado no sistema. Paz e sossego!</Text>
      </Flex>
    );
  }

  return (
    <>
      <ConfirmStatusDialog
        open={!!pendingChange}
        ticketTitle={pendingTicket?.title ?? ""}
        newStatusLabel={pendingChange ? (statusLabel[pendingChange.newStatus] ?? pendingChange.newStatus) : ""}
        isLoading={loadingId !== null}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingChange(null)}
      />

      <Flex direction="column" w="100%" gap={6}>

        {/* Resumo por status */}
        <Flex gap={3} wrap="wrap">
          {Object.entries(statusCounts).map(([s, count]) => (
            <Flex
              key={s} align="center" gap={2} px={4} py={2}
              bg={filterStatus === s ? "whiteAlpha.100" : "whiteAlpha.50"}
              border="1px solid"
              borderColor={filterStatus === s ? statusColorMap[s] : "whiteAlpha.100"}
              borderRadius="xl" cursor="pointer"
              onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}
              transition="all 0.2s"
              _hover={{ borderColor: statusColorMap[s] }}
            >
              <Box w={2} h={2} borderRadius="full" bg={statusColorMap[s]} />
              <Text fontSize="sm" color="gray.300">{statusLabel[s]}</Text>
              <Text fontSize="sm" color="ghostWhite" fontWeight="bold">{count}</Text>
            </Flex>
          ))}
        </Flex>

        {/* Barra de Filtros */}
        <Box p={4} bg="whiteAlpha.50" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
          {/* Busca por email */}
          <Box mb={4}>
            <Flex align="center" gap={2} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200" borderRadius="md" px={3} py={2}>
              <Icon as={PiMagnifyingGlassBold} color="gray.500" boxSize={4} />
              <Input
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                placeholder="Buscar por nome ou email do cliente..."
                border="none"
                bg="transparent"
                color="white"
                _placeholder={{ color: "gray.600" }}
                _focus={{ outline: "none", boxShadow: "none" }}
                p={0}
                fontSize="sm"
              />
              {searchEmail && (
                <Icon as={PiXBold} color="gray.500" boxSize={4} cursor="pointer"
                  onClick={() => setSearchEmail("")} _hover={{ color: "white" }}
                />
              )}
            </Flex>
          </Box>

          {/* Filtros em grid */}
          <Flex gap={4} wrap="wrap">
            <Box flex={1} minW="140px">
              <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Prioridade</Text>
              <Select.Root collection={filterPriorityCollection} value={[filterPriority]} onValueChange={(e) => setFilterPriority(e.value[0])} size="sm">
                <Select.HiddenSelect />
                <Select.Control><Select.Trigger color="white" borderColor="whiteAlpha.200"><Select.ValueText /></Select.Trigger></Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                      {filterPriorityCollection.items.map(item => (
                        <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} color="white" cursor="pointer">
                          {item.label} <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>

            <Box flex={1} minW="140px">
              <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Cliente</Text>
              <Select.Root collection={clientCollection} value={[filterClient]} onValueChange={(e) => setFilterClient(e.value[0])} size="sm">
                <Select.HiddenSelect />
                <Select.Control><Select.Trigger color="white" borderColor="whiteAlpha.200"><Select.ValueText /></Select.Trigger></Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                      {clientCollection.items.map(item => (
                        <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} color="white" cursor="pointer">
                          {item.label} <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>

            <Box flex={1} minW="140px">
              <Text fontSize="xs" color="gray.400" mb={1} textTransform="uppercase">Ordenar</Text>
              <Select.Root collection={sortCollection} value={[sortOrder]} onValueChange={(e) => setSortOrder(e.value[0])} size="sm">
                <Select.HiddenSelect />
                <Select.Control><Select.Trigger color="white" borderColor="whiteAlpha.200"><Select.ValueText /></Select.Trigger></Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                      {sortCollection.items.map(item => (
                        <Select.Item item={item} key={item.value} _hover={{ bg: "whiteAlpha.100" }} color="white" cursor="pointer">
                          {item.label} <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Resultados */}
        <Flex justify="space-between" align="center">
          <Text color="gray.500" fontSize="sm">
            {processedTickets.length} chamado(s) encontrado(s)
            {searchEmail && <Text as="span" color="brand.400"> para "{searchEmail}"</Text>}
          </Text>
          {(filterStatus !== "ALL" || filterPriority !== "ALL" || filterClient !== "ALL" || searchEmail) && (
            <Button
              size="xs" variant="ghost" color="gray.500"
              _hover={{ color: "white", bg: "whiteAlpha.100" }}
              onClick={() => { setFilterStatus("ALL"); setFilterPriority("ALL"); setFilterClient("ALL"); setSearchEmail(""); }}
            >
              Limpar filtros
            </Button>
          )}
        </Flex>

        {/* Tabela */}
        <Box border="1px solid" borderColor="whiteAlpha.100" borderRadius="xl" overflow="hidden">
          <Flex bg="whiteAlpha.50" p={4} borderBottom="1px solid" borderColor="whiteAlpha.100" display={{ base: "none", md: "flex" }}>
            <Text flex="2" color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase">Chamado</Text>
            <Text flex="1.5" color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase">Cliente</Text>
            <Text flex="1" color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase">Prioridade</Text>
            <Text flex="1" color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase">Status</Text>
          </Flex>

          {currentData.length === 0 ? (
            <Flex justify="center" p={10} direction="column" align="center" gap={3}>
              <Icon as={PiMagnifyingGlassBold} boxSize={8} color="gray.600" />
              <Text color="gray.500">Nenhum chamado com estes filtros.</Text>
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
                    <Text color="ghostWhite" fontWeight="bold" mb={1}
                      _hover={{ color: "brand.400" }} transition="color 0.2s"
                      overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" maxW="280px"
                    >
                      {ticket.title}
                    </Text>
                  </Link>
                  <Text color="gray.500" fontSize="xs">
                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </Box>

                <Box flex="1.5" w="100%">
                  <Text color="gray.300" fontSize="sm" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{ticket.clientName}</Text>
                  <Text color="gray.500" fontSize="xs" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{ticket.clientEmail}</Text>
                  {ticket.projectName && (
                    <Badge mt={1} size="sm" colorPalette="purple" variant="subtle" width="fit-content">{ticket.projectName}</Badge>
                  )}
                </Box>

                <Box flex="1" w="100%">
                  <Badge
                    bg={priorityColorMap[ticket.priority]}
                    color="white" borderRadius="full" px={3} py={1} fontSize="xs"
                  >
                    {priorityLabel[ticket.priority] ?? ticket.priority}
                  </Badge>
                </Box>

                <Flex flex="1" w="100%" align="center" gap={3}>
                  <Select.Root
                    collection={statusCollection}
                    value={[ticket.status]}
                    onValueChange={(e) => requestStatusChange(ticket.id, e.value[0])}
                    disabled={loadingId === ticket.id}
                    size="sm"
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger
                        bg={statusColorMap[ticket.status]}
                        color="white" borderColor="transparent" borderRadius="md"
                        _hover={{ opacity: 0.9 }}
                      >
                        <Select.ValueText />
                      </Select.Trigger>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                          {statusCollection.items.map(item => (
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

        {/* Paginação */}
        {totalPages > 1 && (
          <Flex justify="space-between" align="center" mt={2}>
            <Text color="gray.500" fontSize="sm">
              Página {currentPage} de {totalPages} — {processedTickets.length} total
            </Text>
            <Flex gap={2}>
              <Button
                size="sm" variant="outline" borderColor="whiteAlpha.200" color="white"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                _hover={{ bg: "whiteAlpha.100" }}
              >
                <Icon as={PiCaretLeftBold} />
              </Button>
              <Flex align="center" px={4} bg="whiteAlpha.50" borderRadius="md" border="1px solid" borderColor="whiteAlpha.200">
                <Text color="white" fontSize="sm" fontWeight="bold">{currentPage} / {totalPages}</Text>
              </Flex>
              <Button
                size="sm" variant="outline" borderColor="whiteAlpha.200" color="white"
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
    </>
  );
}

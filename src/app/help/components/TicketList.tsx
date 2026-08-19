"use client";

import { useState, useMemo } from "react";
import { getPriorityColor, priorityTranslator } from "@/utils/tags";
import {
  Box, Flex, Text, Badge, Stack, Icon, Link, Input,
  Select, Portal, createListCollection, Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  PiTicketBold, PiClockBold, PiPaperclipBold, PiMagnifyingGlassBold,
  PiFolderBold, PiCheckCircleBold, PiChatCircleDotsBold,
} from "react-icons/pi";

const MotionBox = motion(Box);

interface Attachment { url: string; fileName: string }

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  attachments: Attachment[];
  createdAt: string;
  clientId: string;
  projectId?: string;
  projectName?: string;
  tipo?: string;
}

const STATUS_INFO: Record<string, { label: string; cor: string }> = {
  OPEN:              { label: "Aberto",              cor: "brand.500"  },
  IN_PROGRESS:       { label: "Em andamento",        cor: "blue.400"   },
  AWAITING_FEEDBACK: { label: "Aguardando você",     cor: "purple.400" },
  RESOLVED:          { label: "Resolvido",           cor: "green.400"  },
  CLOSED:            { label: "Fechado",             cor: "gray.500"   },
};

const infoDe = (s: string) => STATUS_INFO[s] || { label: s, cor: "gray.400" };

const TIPO_INFO: Record<string, { label: string; cor: string }> = {
  CORRECAO: { label: "Correção", cor: "blue.400" },
  EVOLUCAO: { label: "Evolução", cor: "orange.400" },
  CONTEUDO: { label: "Conteúdo", cor: "gray.500" },
  OPERACAO: { label: "Operação", cor: "teal.400" },
};

// Os que ainda estão em curso ficam em cima; o histórico vai para baixo.
const EM_CURSO = ["OPEN", "IN_PROGRESS", "AWAITING_FEEDBACK"];

export function TicketList({
  initialTickets,
}: {
  initialTickets: Ticket[];
  clientId?: string;
}) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("ATIVOS");
  const [filtroProjeto, setFiltroProjeto] = useState("ALL");

  const projetos = useMemo(
    () => Array.from(new Set(initialTickets.map(t => t.projectName).filter(Boolean))) as string[],
    [initialTickets]
  );

  const projetoCollection = useMemo(
    () => createListCollection({
      items: [
        { label: "Todos os projetos", value: "ALL" },
        ...projetos.sort().map(p => ({ label: p, value: p })),
      ],
    }),
    [projetos]
  );

  const contagem = useMemo(() => {
    const c: Record<string, number> = { ATIVOS: 0, OPEN: 0, IN_PROGRESS: 0, AWAITING_FEEDBACK: 0, RESOLVIDOS: 0 };
    for (const t of initialTickets) {
      if (EM_CURSO.includes(t.status)) c.ATIVOS++;
      else c.RESOLVIDOS++;
      if (c[t.status] !== undefined) c[t.status]++;
    }
    return c;
  }, [initialTickets]);

  const filtrados = useMemo(() => {
    let lista = [...initialTickets];

    if (filtroStatus === "ATIVOS") lista = lista.filter(t => EM_CURSO.includes(t.status));
    else if (filtroStatus === "RESOLVIDOS") lista = lista.filter(t => !EM_CURSO.includes(t.status));
    else if (filtroStatus !== "ALL") lista = lista.filter(t => t.status === filtroStatus);

    if (filtroProjeto !== "ALL") lista = lista.filter(t => t.projectName === filtroProjeto);

    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        t => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
      );
    }

    // "Aguardando você" primeiro: é onde o cliente precisa agir.
    const peso = (s: string) => (s === "AWAITING_FEEDBACK" ? 0 : EM_CURSO.includes(s) ? 1 : 2);
    return lista.sort(
      (a, b) =>
        peso(a.status) - peso(b.status) ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [initialTickets, filtroStatus, filtroProjeto, busca]);

  const chips = [
    { valor: "ATIVOS",            texto: "Em andamento",    n: contagem.ATIVOS,            cor: "brand.500"  },
    { valor: "AWAITING_FEEDBACK", texto: "Aguardando você", n: contagem.AWAITING_FEEDBACK, cor: "purple.400" },
    { valor: "RESOLVIDOS",        texto: "Resolvidos",      n: contagem.RESOLVIDOS,        cor: "green.400"  },
    { valor: "ALL",               texto: "Todos",           n: initialTickets.length,      cor: "gray.500"   },
  ];

  if (initialTickets.length === 0) {
    return (
      <Flex justify="center" align="center" py={20} bg="rgba(15, 17, 21, 0.4)"
        borderRadius="xl" border="1px dashed" borderColor="whiteAlpha.200" direction="column" gap={4}>
        <Icon as={PiTicketBold} boxSize={10} color="whiteAlpha.300" />
        <Text color="gray.400" fontWeight="medium">Você ainda não tem chamados.</Text>
        <Text color="gray.600" fontSize="sm">Use o formulário ao lado para abrir o primeiro.</Text>
      </Flex>
    );
  }

  return (
    <Stack gap={5} w="100%">

      {/* ── Resumo clicável ─────────────────────────────────── */}
      <Flex gap={2} wrap="wrap">
        {chips.map(c => {
          const ativo = filtroStatus === c.valor;
          return (
            <Button
              key={c.valor}
              size="sm"
              variant="outline"
              onClick={() => setFiltroStatus(c.valor)}
              bg={ativo ? "whiteAlpha.100" : "transparent"}
              borderColor={ativo ? c.cor : "whiteAlpha.200"}
              color={ativo ? "ghostWhite" : "gray.400"}
              _hover={{ borderColor: c.cor, color: "ghostWhite" }}
              px={4}
            >
              <Box as="span" w="8px" h="8px" borderRadius="full" bg={c.cor} mr={2} />
              {c.texto}
              <Box as="span" ml={2} color={ativo ? c.cor : "gray.500"} fontWeight="bold">
                {c.n}
              </Box>
            </Button>
          );
        })}
      </Flex>

      {/* ── Busca e projeto ─────────────────────────────────── */}
      <Flex gap={3} wrap="wrap" align="center">
        <Flex flex="1" minW="220px" position="relative" align="center">
          <Icon as={PiMagnifyingGlassBold} color="gray.500" position="absolute" left={3} zIndex={1} />
          <Input
            placeholder="Buscar nos seus chamados..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            pl={9}
            bg="whiteAlpha.50"
            borderColor="whiteAlpha.200"
            color="ghostWhite"
            _placeholder={{ color: "gray.600" }}
            size="sm"
          />
        </Flex>

        {projetos.length > 1 && (
          <Box minW="200px">
            <Select.Root
              collection={projetoCollection}
              value={[filtroProjeto]}
              onValueChange={e => setFiltroProjeto(e.value[0])}
              size="sm"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger color="ghostWhite" borderColor="whiteAlpha.200" bg="whiteAlpha.50">
                  <Icon as={PiFolderBold} color="gray.500" mr={2} />
                  <Select.ValueText />
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                    {projetoCollection.items.map(item => (
                      <Select.Item item={item} key={item.value} color="white" _hover={{ bg: "whiteAlpha.100" }} cursor="pointer">
                        {item.label} <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
        )}
      </Flex>

      {/* ── Aviso quando há algo esperando o cliente ────────── */}
      {contagem.AWAITING_FEEDBACK > 0 && filtroStatus !== "AWAITING_FEEDBACK" && (
        <Flex
          align="center" gap={3} px={4} py={3}
          bg="rgba(159, 122, 234, 0.08)" border="1px solid" borderColor="purple.400"
          borderRadius="lg"
        >
          <Icon as={PiChatCircleDotsBold} color="purple.300" boxSize={5} />
          <Text color="gray.300" fontSize="sm" flex="1">
            {contagem.AWAITING_FEEDBACK === 1
              ? "Há 1 chamado esperando o seu retorno."
              : `Há ${contagem.AWAITING_FEEDBACK} chamados esperando o seu retorno.`}
          </Text>
          <Button size="xs" variant="outline" borderColor="purple.400" color="purple.200"
            onClick={() => setFiltroStatus("AWAITING_FEEDBACK")}>
            Ver
          </Button>
        </Flex>
      )}

      {/* ── Lista ───────────────────────────────────────────── */}
      {filtrados.length === 0 ? (
        <Flex justify="center" align="center" py={14} bg="rgba(15, 17, 21, 0.4)"
          borderRadius="xl" border="1px dashed" borderColor="whiteAlpha.200" direction="column" gap={2}>
          <Icon as={PiCheckCircleBold} boxSize={8} color="whiteAlpha.300" />
          <Text color="gray.400" fontSize="sm">Nenhum chamado com esses filtros.</Text>
        </Flex>
      ) : (
        <Stack gap={3} w="100%">
          <Text color="gray.600" fontSize="xs">
            {filtrados.length} {filtrados.length === 1 ? "chamado" : "chamados"}
          </Text>

          {filtrados.map((ticket, i) => {
            const info = infoDe(ticket.status);
            const esperandoCliente = ticket.status === "AWAITING_FEEDBACK";
            return (
              <Link key={ticket.id} href={`/help/${ticket.id}`} _hover={{ textDecoration: "none" }} w="100%">
                <MotionBox
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
                  bg="rgba(15, 17, 21, 0.6)"
                  border="1px solid"
                  borderColor={esperandoCliente ? "purple.400" : "whiteAlpha.100"}
                  borderLeftWidth="3px"
                  borderLeftColor={info.cor}
                  borderRadius="lg"
                  px={5} py={4}
                  _hover={{
                    borderColor: "brand.500",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(255, 95, 94, 0.12)",
                  }}
                >
                  <Flex justify="space-between" align="flex-start" gap={4} wrap="wrap">
                    <Box flex="1" minW="200px">
                      <Text color="ghostWhite" fontWeight="semibold" fontSize="md" mb={1} lineHeight="1.35">
                        {ticket.title}
                      </Text>
                      <Text color="gray.500" fontSize="sm" mb={3} lineClamp={2}>
                        {ticket.description}
                      </Text>

                      <Flex align="center" gap={4} wrap="wrap" color="gray.600" fontSize="xs">
                        <Flex align="center" gap={1}>
                          <Icon as={PiClockBold} />
                          <Text>
                            {new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </Text>
                        </Flex>

                        {ticket.projectName && (
                          <Flex align="center" gap={1}>
                            <Icon as={PiFolderBold} />
                            <Text>{ticket.projectName}</Text>
                          </Flex>
                        )}

                        {ticket.tipo && TIPO_INFO[ticket.tipo] && (
                          <Badge size="sm" variant="outline"
                            borderColor={TIPO_INFO[ticket.tipo].cor}
                            color={TIPO_INFO[ticket.tipo].cor}>
                            {TIPO_INFO[ticket.tipo].label}
                          </Badge>
                        )}

                        {ticket.attachments?.length > 0 && (
                          <Flex align="center" gap={1} color="brand.500">
                            <Icon as={PiPaperclipBold} />
                            <Text>{ticket.attachments.length}</Text>
                          </Flex>
                        )}
                      </Flex>
                    </Box>

                    <Flex gap={2} direction="column" align="flex-end">
                      <Badge bg={info.cor} color="white" borderRadius="md" px={2.5} py={1} fontSize="0.7rem">
                        {info.label}
                      </Badge>
                      <Badge
                        bg="transparent"
                        border="1px solid"
                        borderColor={getPriorityColor(ticket.priority)}
                        color={getPriorityColor(ticket.priority)}
                        borderRadius="md" px={2.5} py={1} fontSize="0.7rem"
                      >
                        {priorityTranslator(ticket.priority)}
                      </Badge>
                    </Flex>
                  </Flex>
                </MotionBox>
              </Link>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

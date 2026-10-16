'use client';

// /awer-admin/leads: base de leads do formulário da página /escala-6x1.
// Os dados só saem do servidor depois que o access token do Auth0 é verificado lá (@awer.co verificado).

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box, Flex, Heading, Text, Button, Input, Icon, Spinner, Link as ChakraLink, chakra, Badge,
} from "@chakra-ui/react";
import {
  PiWhatsappLogoBold, PiDownloadSimpleBold, PiArrowClockwiseBold, PiMagnifyingGlassBold, PiEnvelopeSimpleBold,
} from "react-icons/pi";
import { getLeadsEscala6x1, updateLeadEscala6x1 } from "@/actions/leads";
import type { LeadAdmin } from "@/lib/leadsAdmin";
import { LEAD_STATUS, SEGMENTOS } from "@/data/escala6x1";
import { toaster } from "@/components/ui/toaster";

const statusInfo = Object.fromEntries(LEAD_STATUS.map((s) => [s.value, s])) as Record<string, (typeof LEAD_STATUS)[number]>;

function formatWhats(digits: string) {
  const d = digits.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}

function waLink(lead: LeadAdmin) {
  const d = lead.whatsapp.replace(/\D/g, "");
  const full = d.length <= 11 ? `55${d}` : d;
  const primeiroNome = lead.nome.split(" ")[0] || "";
  const msg = `Olá ${primeiroNome}! Aqui é da Awer. Recebemos seu pedido do Planejador de Escalas 6x1 para a ${lead.empresa}. Podemos conversar?`;
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function toCsv(rows: LeadAdmin[]) {
  const cols: [keyof LeadAdmin, string][] = [
    ["createdAt", "Data"], ["nome", "Nome"], ["empresa", "Empresa"], ["whatsapp", "WhatsApp"], ["email", "E-mail"],
    ["funcionarios", "Funcionários"], ["segmento", "Segmento"], ["status", "Status"], ["nota", "Nota"],
  ];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [cols.map(([, h]) => esc(h)).join(";")];
  for (const r of rows) {
    lines.push(cols.map(([k]) => {
      const v = k === "createdAt" ? formatDate(r.createdAt) : k === "status" ? statusInfo[r.status]?.label ?? r.status : String(r[k] ?? "");
      return esc(v);
    }).join(";"));
  }
  return "﻿" + lines.join("\r\n"); // BOM para o Excel abrir com acentos
}

const selectStyle = {
  bg: "whiteAlpha.50", border: "1px solid", borderColor: "whiteAlpha.300", borderRadius: "md",
  color: "white", fontSize: "sm", px: 2, h: "36px",
} as const;

export default function AdminLeadsPage() {
  const { isLoading: authLoading, isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [leads, setLeads] = useState<LeadAdmin[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "denied" | "error">("idle");
  const [denyReason, setDenyReason] = useState<string>("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("ativos");
  const [filtroSegmento, setFiltroSegmento] = useState("todos");
  const [notas, setNotas] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setState("loading");
    try {
      const token = await getAccessTokenSilently();
      if (!token) { setDenyReason("sem_token"); setState("denied"); return; }
      const res = await getLeadsEscala6x1(token);
      if (res.ok) {
        setLeads(res.data);
        setNotas(Object.fromEntries(res.data.map((l) => [l.id, l.nota])));
        setState("idle");
      } else {
        setDenyReason(res.error === "unauthorized" ? res.reason ?? "" : "");
        setState(res.error === "unauthorized" ? "denied" : "error");
      }
    } catch {
      setState("error");
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) load();
  }, [authLoading, isAuthenticated, load]);

  const save = async (id: string, changes: { status?: string; nota?: string }) => {
    const before = leads;
    setLeads((ls) => ls?.map((l) => (l.id === id ? { ...l, ...(changes as Partial<LeadAdmin>) } : l)) ?? ls);
    try {
      const token = await getAccessTokenSilently();
      if (!token) throw new Error("sem token");
      const res = await updateLeadEscala6x1(token, id, changes);
      if (!res.ok) throw new Error(res.error);
      toaster.create({ title: changes.status ? "Status atualizado" : "Nota salva", type: "success", duration: 1800 });
    } catch {
      setLeads(before);
      toaster.create({ title: "Não foi possível salvar", type: "error" });
    }
  };

  const contagem = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads ?? []) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return (leads ?? []).filter((l) => {
      if (filtroStatus === "ativos" && (l.status === "descartado" || l.status === "cliente")) return false;
      if (filtroStatus !== "ativos" && filtroStatus !== "todos" && l.status !== filtroStatus) return false;
      if (filtroSegmento !== "todos" && l.segmento !== filtroSegmento) return false;
      if (!q) return true;
      return [l.nome, l.empresa, l.email, l.whatsapp, l.nota].some((v) => v.toLowerCase().includes(q));
    });
  }, [leads, busca, filtroStatus, filtroSegmento]);

  const exportar = () => {
    const blob = new Blob([toCsv(visiveis)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-escala-6x1-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Estados de acesso ---
  if (authLoading || (isAuthenticated && state === "loading" && !leads)) {
    return <Flex w="100%" h="50vh" align="center" justify="center"><Spinner size="xl" color="brand.500" /></Flex>;
  }
  if (!isAuthenticated || state === "denied") {
    return (
      <Flex w="100%" h="50vh" align="center" justify="center" direction="column" gap={4} px={4} textAlign="center">
        <Text color="gray.300" fontSize="lg">Acesso restrito à equipe Awer.</Text>
        {isAuthenticated && <Text color="gray.500" fontSize="sm">Conectado como {user?.email}. É preciso um e-mail @awer.co verificado.</Text>}
        {isAuthenticated && denyReason && (
          <Text color="gray.500" fontSize="xs">
            Motivo: {{
              sem_token: "o login não gerou um token de acesso",
              token_recusado: "o Auth0 recusou o token de acesso",
              email_nao_verificado: "o e-mail não está marcado como verificado no Auth0",
              fora_do_dominio: "o Auth0 não devolveu um e-mail @awer.co",
              erro_auth0: "não foi possível consultar o Auth0",
            }[denyReason] ?? denyReason}
          </Text>
        )}
        <Button size="sm" variant="outline" onClick={() => loginWithRedirect({ authorizationParams: { prompt: "login" }, appState: { returnTo: "/awer-admin/leads" } })}>
          {isAuthenticated ? "Entrar com outra conta" : "Entrar"}
        </Button>
      </Flex>
    );
  }
  if (state === "error" && !leads) {
    return (
      <Flex w="100%" h="50vh" align="center" justify="center" direction="column" gap={4}>
        <Text color="gray.300">Não foi possível carregar os leads.</Text>
        <Button size="sm" onClick={load}>Tentar de novo</Button>
      </Flex>
    );
  }

  const filtros = [
    { value: "ativos", label: "Em aberto", n: (leads ?? []).filter((l) => l.status !== "descartado" && l.status !== "cliente").length },
    ...LEAD_STATUS.map((s) => ({ value: s.value as string, label: s.label, n: contagem[s.value] ?? 0 })),
    { value: "todos", label: "Todos", n: leads?.length ?? 0 },
  ];

  return (
    <Box w="100%" maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 8, md: 14 }} color="white">
      {/* Cabeçalho */}
      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={6}>
        <Box>
          <Heading as="h1" size="xl" mb={1}>Leads <Box as="span" color="brand.500">Escala 6x1</Box></Heading>
          <Text color="gray.400">Pedidos do Planejador de Escalas feitos em awer.co/escala-6x1.</Text>
        </Box>
        <Flex gap={2} wrap="wrap">
          <Button size="sm" variant="outline" borderColor="whiteAlpha.300" color="white" onClick={load} loading={state === "loading"}>
            <Icon as={PiArrowClockwiseBold} /> Atualizar
          </Button>
          <Button size="sm" variant="outline" borderColor="whiteAlpha.300" color="white" onClick={exportar} disabled={!visiveis.length}>
            <Icon as={PiDownloadSimpleBold} /> Exportar CSV
          </Button>
          <ChakraLink href="/awer-admin/tickets" _hover={{ textDecoration: "none" }}>
            <Button size="sm" variant="ghost" color="gray.300">Chamados</Button>
          </ChakraLink>
        </Flex>
      </Flex>

      {/* Filtros por status */}
      <Flex gap={2} wrap="wrap" mb={4} role="tablist" aria-label="Filtrar por status">
        {filtros.map((f) => {
          const ativo = filtroStatus === f.value;
          return (
            <Button
              key={f.value}
              role="tab"
              aria-selected={ativo}
              size="sm"
              variant="outline"
              borderColor={ativo ? "brand.500" : "whiteAlpha.200"}
              bg={ativo ? "rgba(255,95,94,0.14)" : "transparent"}
              color={ativo ? "white" : "gray.300"}
              onClick={() => setFiltroStatus(f.value)}
            >
              {f.label}
              <Badge ml={1} bg="whiteAlpha.200" color="white" borderRadius="full" px={2}>{f.n}</Badge>
            </Button>
          );
        })}
      </Flex>

      {/* Busca e segmento */}
      <Flex gap={3} wrap="wrap" mb={5}>
        <Flex align="center" gap={2} flex="1 1 280px" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200" borderRadius="md" px={3}>
          <Icon as={PiMagnifyingGlassBold} color="gray.400" />
          <Input
            aria-label="Buscar por nome, empresa, e-mail, telefone ou nota"
            placeholder="Buscar por nome, empresa, e-mail, telefone ou nota"
            border="none" px={0} _focus={{ boxShadow: "none" }} color="white"
            value={busca} onChange={(e) => setBusca(e.target.value)}
          />
        </Flex>
        <chakra.select aria-label="Filtrar por segmento" {...selectStyle} minW="200px" value={filtroSegmento} onChange={(e) => setFiltroSegmento(e.target.value)}>
          <option value="todos">Todos os segmentos</option>
          {SEGMENTOS.map((s) => <option key={s} value={s}>{s}</option>)}
        </chakra.select>
      </Flex>

      {/* Lista */}
      {visiveis.length === 0 ? (
        <Flex direction="column" align="center" gap={2} py={16} border="1px dashed" borderColor="whiteAlpha.200" borderRadius="xl">
          <Text color="gray.300">{leads?.length ? "Nenhum lead com esses filtros." : "Nenhum lead ainda."}</Text>
          {!leads?.length && <Text color="gray.500" fontSize="sm">Os pedidos feitos em awer.co/escala-6x1 aparecem aqui.</Text>}
        </Flex>
      ) : (
        <Flex direction="column" gap={3}>
          {visiveis.map((l) => {
            const st = statusInfo[l.status];
            return (
              <Flex
                key={l.id}
                direction={{ base: "column", lg: "row" }}
                gap={{ base: 3, lg: 6 }}
                p={{ base: 4, md: 5 }}
                bg="rgba(15, 17, 21, 0.6)"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderLeft="3px solid"
                borderLeftColor={st?.color ?? "gray.500"}
                borderRadius="xl"
                opacity={l.status === "descartado" ? 0.6 : 1}
              >
                {/* Quem */}
                <Flex direction="column" gap={1} flex="1.3 1 0" minW={0}>
                  <Text fontSize="xs" color="gray.500">{formatDate(l.createdAt)}</Text>
                  <Text fontWeight="bold" fontSize="lg" lineClamp={1}>{l.empresa}</Text>
                  <Text color="gray.300" fontSize="sm">{l.nome}</Text>
                  <Flex gap={2} wrap="wrap" mt={1}>
                    {l.segmento && <Badge bg="whiteAlpha.100" color="gray.200">{l.segmento}</Badge>}
                    {l.funcionarios && <Badge bg="whiteAlpha.100" color="gray.200">{l.funcionarios} func.</Badge>}
                  </Flex>
                </Flex>

                {/* Contato */}
                <Flex direction="column" gap={2} flex="1 1 0" minW={0} justify="center">
                  <ChakraLink href={waLink(l)} target="_blank" rel="noopener noreferrer" display="inline-flex" alignItems="center" gap={2} color="green.300" fontWeight="semibold" w="fit-content">
                    <Icon as={PiWhatsappLogoBold} boxSize={5} /> {formatWhats(l.whatsapp)}
                  </ChakraLink>
                  {l.email ? (
                    <ChakraLink href={`mailto:${l.email}`} display="inline-flex" alignItems="center" gap={2} color="gray.300" fontSize="sm" w="fit-content" wordBreak="break-all">
                      <Icon as={PiEnvelopeSimpleBold} boxSize={4} /> {l.email}
                    </ChakraLink>
                  ) : (
                    <Text color="gray.600" fontSize="sm">Sem e-mail</Text>
                  )}
                </Flex>

                {/* Status e nota */}
                <Flex direction="column" gap={2} flex="1.4 1 0" minW={0}>
                  <chakra.select
                    aria-label={`Status de ${l.empresa}`}
                    {...selectStyle}
                    color={st?.color ?? "white"}
                    fontWeight="semibold"
                    value={l.status}
                    onChange={(e) => save(l.id, { status: e.target.value })}
                  >
                    {LEAD_STATUS.map((s) => <option key={s.value} value={s.value} style={{ color: "#111" }}>{s.label}</option>)}
                  </chakra.select>
                  <chakra.textarea
                    aria-label={`Nota sobre ${l.empresa}`}
                    placeholder="Nota (salva ao sair do campo)"
                    rows={2}
                    resize="vertical"
                    bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200" borderRadius="md"
                    color="white" fontSize="sm" p={2}
                    _focus={{ borderColor: "brand.400", outline: "none" }}
                    value={notas[l.id] ?? ""}
                    onChange={(e) => setNotas((n) => ({ ...n, [l.id]: e.target.value }))}
                    onBlur={() => { if ((notas[l.id] ?? "") !== l.nota) save(l.id, { nota: notas[l.id] ?? "" }); }}
                  />
                  {l.updatedBy && <Text fontSize="xs" color="gray.600">Atualizado por {l.updatedBy}{l.updatedAt ? ` em ${formatDate(l.updatedAt)}` : ""}</Text>}
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      )}
      <Text fontSize="xs" color="gray.600" mt={6}>{visiveis.length} de {leads?.length ?? 0} leads exibidos.</Text>
    </Box>
  );
}

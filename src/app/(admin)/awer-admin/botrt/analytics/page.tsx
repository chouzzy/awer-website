'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState, useCallback } from 'react';
import {
    Box, Container, Flex, Heading, Text, Input,
    Badge, Table, Button, Spinner, HStack, VStack,
    SimpleGrid, NativeSelect,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface LogRow {
    id: string;
    userEmail: string;
    trt: string;
    operacao: string;
    status: string;
    mensagemErro: string | null;
    tempoExecucaoMs: number | null;
    processosExtraidos: number | null;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    totalOpsToday: number;
    errorsToday: number;
    recentLogs: LogRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: string) {
    if (status.includes('SUCESSO')) return 'green';
    if (status.includes('FALHA') || status.includes('ERRO')) return 'red';
    if (status.includes('AVISO')) return 'orange';
    return 'gray';
}

function fmtDuration(ms: number | null) {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString('pt-BR');
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <Box
            bg="rgba(15, 17, 21, 0.6)"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="xl"
            p={5}
        >
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>{label}</Text>
            <Text fontSize="2xl" fontWeight="bold" color="white">{value}</Text>
            {sub && <Text fontSize="xs" color="gray.600" mt={1}>{sub}</Text>}
        </Box>
    );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

const PAGE_SIZE = 50;

export default function AnalyticsPage() {
    const { getAccessTokenSilently } = useAuth0();
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [stats, setStats] = useState<Stats | null>(null);
    const [logs, setLogs] = useState<LogRow[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(false);

    // Filtros
    const [filterEmail, setFilterEmail] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const fetchStats = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`${apiBase}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar stats');
            setStats(await res.json());
        } catch (e: any) {
            toaster.create({ title: e.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [getAccessTokenSilently, apiBase]);

    const fetchLogs = useCallback(async (p: number) => {
        setLogsLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const params = new URLSearchParams({
                limit: String(PAGE_SIZE),
                skip: String(p * PAGE_SIZE),
            });
            if (filterEmail) params.set('email', filterEmail);
            if (filterStatus) params.set('status', filterStatus);
            if (filterDateFrom) params.set('dateFrom', new Date(filterDateFrom).toISOString());
            if (filterDateTo) {
                const d = new Date(filterDateTo);
                d.setHours(23, 59, 59);
                params.set('dateTo', d.toISOString());
            }
            const res = await fetch(`${apiBase}/api/admin/logs?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar logs');
            const data = await res.json();
            setLogs(data.logs);
            setTotal(data.total);
        } catch (e: any) {
            toaster.create({ title: e.message, type: 'error' });
        } finally {
            setLogsLoading(false);
        }
    }, [getAccessTokenSilently, apiBase, filterEmail, filterStatus, filterDateFrom, filterDateTo]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { setPage(0); fetchLogs(0); }, [filterEmail, filterStatus, filterDateFrom, filterDateTo]);

    function applyFilter() { setPage(0); fetchLogs(0); }

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <Container maxW="container.xl" py={10}>
            <VStack align="stretch" gap={8}>

                {/* Header */}
                <Box>
                    <Heading size="xl" color="ghostWhite" mb={1}>
                        Analytics <Box as="span" color="brand.500">BoTRT</Box>
                    </Heading>
                    <Text color="gray.400" fontSize="sm">
                        Logs de operação, erros e atividade dos clientes.
                    </Text>
                </Box>

                {/* Stats cards */}
                {loading ? (
                    <Flex align="center" justify="center" py={8}>
                        <Spinner color="brand.500" />
                    </Flex>
                ) : stats && (
                    <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
                        <StatCard label="Total usuários" value={stats.totalUsers} />
                        <StatCard label="Operações hoje" value={stats.totalOpsToday} />
                        <StatCard
                            label="Erros hoje"
                            value={stats.errorsToday}
                            sub={stats.totalOpsToday > 0
                                ? `${((stats.errorsToday / stats.totalOpsToday) * 100).toFixed(0)}% das ops`
                                : undefined}
                        />
                    </SimpleGrid>
                )}

                {/* Filtros de logs */}
                <Box
                    bg="rgba(15, 17, 21, 0.6)"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="xl"
                    p={4}
                >
                    <Text fontSize="xs" color="gray.400" fontWeight="semibold" textTransform="uppercase" mb={3}>
                        Filtrar logs
                    </Text>
                    <HStack gap={3} flexWrap="wrap">
                        <Input
                            placeholder="Email..."
                            size="sm"
                            value={filterEmail}
                            onChange={e => setFilterEmail(e.target.value)}
                            maxW="260px"
                            bg="whiteAlpha.50"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        />
                        <NativeSelect.Root size="sm" w="180px">
                            <NativeSelect.Field
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                bg="whiteAlpha.50"
                                border="1px solid"
                                borderColor="whiteAlpha.200"
                            >
                                <option value="">Todos os status</option>
                                <option value="SUCESSO">Sucesso</option>
                                <option value="FALHA_SISTEMA">Falha Sistema</option>
                                <option value="CREDENCIAIS_INVALIDAS">Credenciais Inválidas</option>
                                <option value="LOGIN">Login</option>
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                        <Input
                            type="date"
                            size="sm"
                            value={filterDateFrom}
                            onChange={e => setFilterDateFrom(e.target.value)}
                            maxW="160px"
                            bg="whiteAlpha.50"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        />
                        <Input
                            type="date"
                            size="sm"
                            value={filterDateTo}
                            onChange={e => setFilterDateTo(e.target.value)}
                            maxW="160px"
                            bg="whiteAlpha.50"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        />
                        <Button size="sm" colorPalette="brand" onClick={applyFilter}>
                            Filtrar
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            color="gray.400"
                            onClick={() => {
                                setFilterEmail('');
                                setFilterStatus('');
                                setFilterDateFrom('');
                                setFilterDateTo('');
                            }}
                        >
                            Limpar
                        </Button>
                        <Text fontSize="xs" color="gray.500" ml="auto">{total} registro(s)</Text>
                    </HStack>
                </Box>

                {/* Tabela de logs */}
                <Box
                    bg="rgba(15, 17, 21, 0.6)"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    overflow="hidden"
                >
                    {logsLoading ? (
                        <Flex align="center" justify="center" py={16}>
                            <Spinner size="lg" color="brand.500" />
                        </Flex>
                    ) : (
                        <Box overflowX="auto">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row bg="whiteAlpha.50">
                                        <Table.ColumnHeader color="gray.400">Email</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Operação</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">TRT</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Status</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Tempo</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Processos</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Data</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {logs.length === 0 ? (
                                        <Table.Row>
                                            <Table.Cell colSpan={7} textAlign="center" py={8} color="gray.500">
                                                Nenhum log encontrado.
                                            </Table.Cell>
                                        </Table.Row>
                                    ) : logs.map(log => (
                                        <Table.Row key={log.id} _hover={{ bg: 'whiteAlpha.50' }}>
                                            <Table.Cell>
                                                <Text fontSize="xs" fontFamily="mono">{log.userEmail}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="xs">{log.operacao}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="xs" color="gray.400">{log.trt}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <VStack align="start" gap={0}>
                                                    <Badge size="sm" colorPalette={statusColor(log.status)}>
                                                        {log.status}
                                                    </Badge>
                                                    {log.mensagemErro && (
                                                        <Text fontSize="xs" color="red.400" maxW="200px" truncate title={log.mensagemErro}>
                                                            {log.mensagemErro}
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="xs" color="gray.400">{fmtDuration(log.tempoExecucaoMs)}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="xs" color="gray.400">
                                                    {log.processosExtraidos ?? '—'}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="xs" color="gray.500">{fmtDateTime(log.createdAt)}</Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    )}

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <Flex align="center" justify="space-between" px={4} py={3} borderTop="1px solid" borderColor="whiteAlpha.100">
                            <Text fontSize="xs" color="gray.500">
                                Página {page + 1} de {totalPages}
                            </Text>
                            <HStack gap={2}>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    disabled={page === 0}
                                    onClick={() => { const p = page - 1; setPage(p); fetchLogs(p); }}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => { const p = page + 1; setPage(p); fetchLogs(p); }}
                                >
                                    Próxima
                                </Button>
                            </HStack>
                        </Flex>
                    )}
                </Box>

            </VStack>
        </Container>
    );
}

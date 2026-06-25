'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState, useCallback } from 'react';
import {
    Box, Container, Flex, Heading, Text, Input, Badge,
    Table, Button, Spinner, HStack, VStack, Select,
    Dialog, Portal, CloseButton, Field, NativeSelect,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface UserRow {
    id: string;
    email: string;
    createdAt: string;
    effectiveStatus: string;
    effectivePeriodEnd: string | null;
    planName: string;
    isOverridden: boolean;
    override: {
        status: string;
        expiresAt: string | null;
        motivo: string | null;
        criadoPor: string;
    } | null;
    stripeStatus: string | null;
    lastActivity: {
        createdAt: string;
        operacao: string;
        status: string;
        trt: string;
    } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
    active: 'Ativo',
    trialing: 'Trial',
    canceled: 'Cancelado',
    past_due: 'Inadimplente',
    no_subscription: 'Sem assinatura',
    lifetime: 'Vitalício',
};

const STATUS_COLOR: Record<string, string> = {
    active: 'green',
    trialing: 'blue',
    canceled: 'red',
    past_due: 'orange',
    no_subscription: 'gray',
    lifetime: 'purple',
};

function statusBadge(status: string, isOverridden: boolean) {
    return (
        <HStack gap={1}>
            <Badge colorPalette={STATUS_COLOR[status] ?? 'gray'}>
                {STATUS_LABEL[status] ?? status}
            </Badge>
            {isOverridden && (
                <Badge colorPalette="yellow" size="sm">override</Badge>
            )}
        </HStack>
    );
}

function fmtDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDateTime(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('pt-BR');
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function UsuariosPage() {
    const { getAccessTokenSilently } = useAuth0();
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Modal de ação
    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [actionStatus, setActionStatus] = useState('active');
    const [actionDays, setActionDays] = useState('');
    const [actionMotivo, setActionMotivo] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`${apiBase}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Erro ao buscar usuários');
            setUsers(await res.json());
        } catch (e: any) {
            toaster.create({ title: e.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [getAccessTokenSilently, apiBase]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const filtered = users.filter(u => {
        const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || u.effectiveStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    async function applyOverride(type: 'trial15' | 'extend' | 'cancel' | 'remove') {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const email = encodeURIComponent(selectedUser.email);

            if (type === 'remove') {
                const res = await fetch(`${apiBase}/api/admin/users/${email}/override`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Erro ao remover override');
                toaster.create({ title: 'Override removido', type: 'success' });
            } else {
                let body: { status: string; expiresAt?: string; motivo: string };

                if (type === 'trial15') {
                    const exp = new Date();
                    exp.setDate(exp.getDate() + 15);
                    body = { status: 'trialing', expiresAt: exp.toISOString(), motivo: '15 dias grátis' };
                } else if (type === 'extend') {
                    const days = parseInt(actionDays, 10);
                    if (!days || days < 1) throw new Error('Informe um número de dias válido.');
                    const base = selectedUser.effectivePeriodEnd
                        ? new Date(selectedUser.effectivePeriodEnd)
                        : new Date();
                    if (base < new Date()) base.setTime(new Date().getTime());
                    base.setDate(base.getDate() + days);
                    body = {
                        status: actionStatus,
                        expiresAt: base.toISOString(),
                        motivo: actionMotivo || `Prorrogação de ${days} dia(s)`,
                    };
                } else {
                    // cancel
                    body = { status: 'canceled', motivo: actionMotivo || 'Cancelamento manual pelo admin' };
                }

                const res = await fetch(`${apiBase}/api/admin/users/${email}/override`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error('Erro ao aplicar override');
                toaster.create({ title: 'Override aplicado', type: 'success' });
            }

            setSelectedUser(null);
            fetchUsers();
        } catch (e: any) {
            toaster.create({ title: e.message, type: 'error' });
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <Container maxW="container.xl" py={10}>
            <VStack align="stretch" gap={8}>

                {/* Header */}
                <Box>
                    <Heading size="xl" color="ghostWhite" mb={1}>
                        Usuários <Box as="span" color="brand.500">BoTRT</Box>
                    </Heading>
                    <Text color="gray.400" fontSize="sm">
                        Gerencie assinaturas, overrides e visualize o status de cada cliente.
                    </Text>
                </Box>

                {/* Filtros */}
                <HStack gap={3} flexWrap="wrap">
                    <Input
                        placeholder="Buscar por email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        maxW="320px"
                        size="sm"
                        bg="whiteAlpha.50"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                    />
                    <NativeSelect.Root size="sm" maxW="200px">
                        <NativeSelect.Field
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            bg="whiteAlpha.50"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                        >
                            <option value="">Todos os status</option>
                            {Object.entries(STATUS_LABEL).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </NativeSelect.Field>
                    </NativeSelect.Root>
                    <Text fontSize="sm" color="gray.500" ml="auto">
                        {filtered.length} usuário(s)
                    </Text>
                </HStack>

                {/* Tabela */}
                <Box
                    bg="rgba(15, 17, 21, 0.6)"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    overflow="hidden"
                >
                    {loading ? (
                        <Flex align="center" justify="center" py={16}>
                            <Spinner size="lg" color="brand.500" />
                        </Flex>
                    ) : (
                        <Box overflowX="auto">
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row bg="whiteAlpha.50">
                                        <Table.ColumnHeader color="gray.400">Email</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Status</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Expira em</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Último uso</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400">Cadastro</Table.ColumnHeader>
                                        <Table.ColumnHeader color="gray.400"></Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {filtered.length === 0 ? (
                                        <Table.Row>
                                            <Table.Cell colSpan={6} textAlign="center" py={8} color="gray.500">
                                                Nenhum usuário encontrado.
                                            </Table.Cell>
                                        </Table.Row>
                                    ) : filtered.map(u => (
                                        <Table.Row key={u.id} _hover={{ bg: 'whiteAlpha.50' }}>
                                            <Table.Cell>
                                                <Text fontSize="sm" fontFamily="mono">{u.email}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {statusBadge(u.effectiveStatus, u.isOverridden)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="sm" color={u.effectivePeriodEnd && new Date(u.effectivePeriodEnd) < new Date() ? 'red.400' : 'gray.300'}>
                                                    {u.effectiveStatus === 'lifetime' ? 'Vitalício' : fmtDate(u.effectivePeriodEnd)}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {u.lastActivity ? (
                                                    <VStack align="start" gap={0}>
                                                        <Text fontSize="xs" color="gray.300">{u.lastActivity.operacao}</Text>
                                                        <Text fontSize="xs" color="gray.500">{fmtDateTime(u.lastActivity.createdAt)}</Text>
                                                    </VStack>
                                                ) : (
                                                    <Text fontSize="xs" color="gray.600">—</Text>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text fontSize="xs" color="gray.500">{fmtDate(u.createdAt)}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {u.effectiveStatus !== 'lifetime' && (
                                                    <Button
                                                        size="xs"
                                                        variant="ghost"
                                                        color="brand.400"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setActionDays('');
                                                            setActionMotivo('');
                                                            setActionStatus('active');
                                                        }}
                                                    >
                                                        Gerenciar
                                                    </Button>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                    )}
                </Box>
            </VStack>

            {/* Modal de gerenciamento */}
            <Dialog.Root open={!!selectedUser} onOpenChange={d => !d.open && setSelectedUser(null)}>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="gray.900" border="1px solid" borderColor="whiteAlpha.200" maxW="480px" w="full">
                            <Dialog.Header>
                                <Dialog.Title color="white" fontSize="md">
                                    Gerenciar — {selectedUser?.email}
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" color="gray.400" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body pb={6}>
                                <VStack align="stretch" gap={5}>

                                    {/* Status atual */}
                                    {selectedUser && (
                                        <Box bg="whiteAlpha.50" borderRadius="md" p={3}>
                                            <Text fontSize="xs" color="gray.400" mb={1}>Status atual</Text>
                                            <HStack>
                                                {statusBadge(selectedUser.effectiveStatus, selectedUser.isOverridden)}
                                                <Text fontSize="xs" color="gray.500">
                                                    {selectedUser.effectivePeriodEnd
                                                        ? `até ${fmtDate(selectedUser.effectivePeriodEnd)}`
                                                        : ''}
                                                </Text>
                                            </HStack>
                                            {selectedUser.override && (
                                                <Text fontSize="xs" color="yellow.500" mt={1}>
                                                    Override por {selectedUser.override.criadoPor}
                                                    {selectedUser.override.motivo ? ` — ${selectedUser.override.motivo}` : ''}
                                                </Text>
                                            )}
                                        </Box>
                                    )}

                                    {/* Ações rápidas */}
                                    <VStack align="stretch" gap={2}>
                                        <Text fontSize="xs" color="gray.400" fontWeight="semibold" textTransform="uppercase">
                                            Ações rápidas
                                        </Text>
                                        <HStack gap={2} flexWrap="wrap">
                                            <Button
                                                size="sm"
                                                colorPalette="blue"
                                                loading={actionLoading}
                                                onClick={() => applyOverride('trial15')}
                                            >
                                                15 dias grátis
                                            </Button>
                                            <Button
                                                size="sm"
                                                colorPalette="red"
                                                variant="outline"
                                                loading={actionLoading}
                                                onClick={() => applyOverride('cancel')}
                                            >
                                                Cancelar acesso
                                            </Button>
                                            {selectedUser?.isOverridden && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    color="gray.400"
                                                    loading={actionLoading}
                                                    onClick={() => applyOverride('remove')}
                                                >
                                                    Remover override
                                                </Button>
                                            )}
                                        </HStack>
                                    </VStack>

                                    {/* Prorrogar */}
                                    <VStack align="stretch" gap={2}>
                                        <Text fontSize="xs" color="gray.400" fontWeight="semibold" textTransform="uppercase">
                                            Prorrogar / Conceder acesso
                                        </Text>
                                        <HStack>
                                            <Field.Root flex={1}>
                                                <Input
                                                    placeholder="N dias"
                                                    size="sm"
                                                    type="number"
                                                    min={1}
                                                    value={actionDays}
                                                    onChange={e => setActionDays(e.target.value)}
                                                    bg="whiteAlpha.50"
                                                    border="1px solid"
                                                    borderColor="whiteAlpha.200"
                                                />
                                            </Field.Root>
                                            <NativeSelect.Root size="sm" w="140px">
                                                <NativeSelect.Field
                                                    value={actionStatus}
                                                    onChange={e => setActionStatus(e.target.value)}
                                                    bg="whiteAlpha.50"
                                                    border="1px solid"
                                                    borderColor="whiteAlpha.200"
                                                >
                                                    <option value="active">Ativo</option>
                                                    <option value="trialing">Trial</option>
                                                </NativeSelect.Field>
                                            </NativeSelect.Root>
                                        </HStack>
                                        <Input
                                            placeholder="Motivo (opcional)"
                                            size="sm"
                                            value={actionMotivo}
                                            onChange={e => setActionMotivo(e.target.value)}
                                            bg="whiteAlpha.50"
                                            border="1px solid"
                                            borderColor="whiteAlpha.200"
                                        />
                                        <Button
                                            size="sm"
                                            colorPalette="green"
                                            loading={actionLoading}
                                            onClick={() => applyOverride('extend')}
                                            disabled={!actionDays}
                                        >
                                            Aplicar prorrogação
                                        </Button>
                                    </VStack>

                                </VStack>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Container>
    );
}

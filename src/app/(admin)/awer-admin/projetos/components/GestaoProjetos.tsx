"use client";

import { useState, useTransition } from "react";
import {
  Box, Flex, Text, Heading, Input, Button, Badge, Spinner, Icon,
} from "@chakra-ui/react";
import { PiPlusBold, PiCheckBold, PiUsersBold, PiFolderBold } from "react-icons/pi";
import { criarProjeto, alternarAcesso, alternarProjetoAtivo } from "@/actions/projects";
import { toaster } from "@/components/ui/toaster";

interface Projeto { id: string; nome: string; cliente: string }
interface Usuario { id: string; nome: string; email: string; projetoIds: string[]; ehAwer: boolean }

interface Props {
  projetos: Projeto[];
  usuarios: Usuario[];
  chamadosPorProjeto: Record<string, number>;
  semProjeto: number;
}

export function GestaoProjetos({ projetos, usuarios, chamadosPorProjeto, semProjeto }: Props) {
  const [nome, setNome] = useState("");
  const [cliente, setCliente] = useState("");
  const [salvando, iniciarTransicao] = useTransition();

  // estado local dos vínculos, para a tela responder na hora
  const [acessos, setAcessos] = useState<Record<string, Set<string>>>(() => {
    const m: Record<string, Set<string>> = {};
    for (const u of usuarios) m[u.id] = new Set(u.projetoIds);
    return m;
  });
  const [emAndamento, setEmAndamento] = useState<string | null>(null);

  function novoProjeto() {
    if (nome.trim().length < 2) {
      toaster.create({ title: "Dê um nome ao projeto", type: "warning" });
      return;
    }
    iniciarTransicao(async () => {
      const r = await criarProjeto(nome, cliente);
      if (r.success) {
        toaster.create({ title: `Projeto "${nome}" criado`, type: "success" });
        setNome("");
        setCliente("");
      } else {
        toaster.create({ title: r.error || "Não deu para criar", type: "error" });
      }
    });
  }

  async function alternar(usuario: Usuario, projeto: Projeto) {
    const chave = `${usuario.id}:${projeto.id}`;
    const tinha = acessos[usuario.id]?.has(projeto.id);
    setEmAndamento(chave);

    // atualiza a tela antes da resposta, e desfaz se falhar
    setAcessos((prev) => {
      const copia = { ...prev };
      const set = new Set(copia[usuario.id] || []);
      tinha ? set.delete(projeto.id) : set.add(projeto.id);
      copia[usuario.id] = set;
      return copia;
    });

    const r = await alternarAcesso(usuario.id, projeto.id, !tinha);
    setEmAndamento(null);

    if (!r.success) {
      setAcessos((prev) => {
        const copia = { ...prev };
        const set = new Set(copia[usuario.id] || []);
        tinha ? set.add(projeto.id) : set.delete(projeto.id);
        copia[usuario.id] = set;
        return copia;
      });
      toaster.create({ title: r.error || "Não deu para salvar", type: "error" });
    }
  }

  const caixa = {
    bg: "rgba(15, 17, 21, 0.6)",
    borderRadius: "2xl",
    border: "1px solid",
    borderColor: "whiteAlpha.100",
    p: 6,
  };

  return (
    <Flex direction="column" gap={8}>

      {/* ─── Criar projeto ─────────────────────────────────────── */}
      <Box {...caixa}>
        <Flex align="center" gap={2} mb={4}>
          <Icon as={PiFolderBold} color="brand.500" />
          <Heading size="sm" color="ghostWhite">Novo projeto</Heading>
        </Flex>
        <Flex gap={3} direction={{ base: "column", md: "row" }}>
          <Input
            placeholder="Nome do projeto (ex.: PDBot)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && novoProjeto()}
            bg="whiteAlpha.50" borderColor="whiteAlpha.200" color="ghostWhite"
          />
          <Input
            placeholder="Cliente (ex.: Paulista Distressed)"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && novoProjeto()}
            bg="whiteAlpha.50" borderColor="whiteAlpha.200" color="ghostWhite"
          />
          <Button colorPalette="red" onClick={novoProjeto} disabled={salvando} minW="130px">
            {salvando ? <Spinner size="sm" /> : <><Icon as={PiPlusBold} mr={2} />Criar</>}
          </Button>
        </Flex>
      </Box>

      {/* ─── Projetos existentes ───────────────────────────────── */}
      <Box {...caixa}>
        <Flex align="center" justify="space-between" mb={4} wrap="wrap" gap={2}>
          <Heading size="sm" color="ghostWhite">
            {projetos.length} projeto(s)
          </Heading>
          {semProjeto > 0 && (
            <Badge colorPalette="orange" variant="subtle">
              {semProjeto} chamado(s) ainda sem projeto
            </Badge>
          )}
        </Flex>

        {projetos.length === 0 ? (
          <Text color="gray.500" fontSize="sm">Nenhum projeto cadastrado ainda.</Text>
        ) : (
          <Flex wrap="wrap" gap={3}>
            {projetos.map((p) => (
              <Flex
                key={p.id}
                direction="column"
                bg="whiteAlpha.50"
                borderRadius="lg"
                px={4} py={3}
                minW="200px"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                <Text color="ghostWhite" fontWeight="semibold">{p.nome}</Text>
                {p.cliente && <Text color="gray.500" fontSize="xs">{p.cliente}</Text>}
                <Text color="gray.400" fontSize="xs" mt={1}>
                  {chamadosPorProjeto[p.id] || 0} chamado(s)
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>

      {/* ─── Quem vê o quê ─────────────────────────────────────── */}
      <Box {...caixa}>
        <Flex align="center" gap={2} mb={2}>
          <Icon as={PiUsersBold} color="brand.500" />
          <Heading size="sm" color="ghostWhite">Quem vê cada projeto</Heading>
        </Flex>
        <Text color="gray.500" fontSize="xs" mb={5}>
          Clique para liberar ou tirar o acesso. Quem tem e-mail @awer.co já vê todos os projetos.
        </Text>

        {projetos.length === 0 ? (
          <Text color="gray.500" fontSize="sm">Cadastre um projeto primeiro.</Text>
        ) : (
          <Flex direction="column" gap={5}>
            {usuarios.map((u) => (
              <Box key={u.id} pb={4} borderBottom="1px solid" borderColor="whiteAlpha.100">
                <Flex align="center" gap={2} mb={3} wrap="wrap">
                  <Text color="ghostWhite" fontWeight="semibold">{u.nome}</Text>
                  <Text color="gray.500" fontSize="xs">{u.email}</Text>
                  {u.ehAwer && (
                    <Badge colorPalette="red" variant="subtle" fontSize="0.65rem">
                      time Awer — vê tudo
                    </Badge>
                  )}
                </Flex>

                <Flex wrap="wrap" gap={2}>
                  {projetos.map((p) => {
                    const liberado = u.ehAwer || acessos[u.id]?.has(p.id);
                    const carregando = emAndamento === `${u.id}:${p.id}`;
                    return (
                      <Button
                        key={p.id}
                        size="xs"
                        variant={liberado ? "solid" : "outline"}
                        colorPalette={liberado ? "red" : "gray"}
                        opacity={u.ehAwer ? 0.5 : 1}
                        disabled={u.ehAwer || carregando}
                        onClick={() => alternar(u, p)}
                      >
                        {carregando ? <Spinner size="xs" /> : (
                          <>
                            {liberado && <Icon as={PiCheckBold} mr={1} />}
                            {p.nome}
                          </>
                        )}
                      </Button>
                    );
                  })}
                </Flex>
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

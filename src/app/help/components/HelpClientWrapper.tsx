"use client";

import { useEffect, useState } from "react";
import { getOrCreateMongoUser } from "@/actions/users";
import { getTicketsDoUsuario, getProjetosDoUsuario, type Projeto } from "@/actions/projects";
import { CreateTicketForm } from "./CreateTicketForm";
import { TicketList } from "./TicketList";
import { Flex, Box, Heading, Spinner, Center } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export function HelpClientWrapper() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function sync() {
      if (!isAuthenticated || !user?.sub) return;
      setCarregando(true);
      const mongoUser = await getOrCreateMongoUser(user.sub, user.email || "");
      setDbUser(mongoUser);

      // busca já filtrada no servidor — o navegador só recebe o que é deste usuário
      const [meusTickets, meusProjetos] = await Promise.all([
        getTicketsDoUsuario(mongoUser._id),
        getProjetosDoUsuario(mongoUser._id),
      ]);
      setTickets(meusTickets);
      setProjetos(meusProjetos);
      setCarregando(false);
    }
    sync();
  }, [isAuthenticated, user]);

  if (isLoading) return <Center h="200px"><Spinner color="brand.500" /></Center>;

  if (!isAuthenticated) {
    return (
      <Center h="200px" bg="whiteAlpha.50" borderRadius="xl" border="1px dashed" borderColor="whiteAlpha.200">
        <Heading size="md" color="gray.400">Por favor, faça login para ver os seus chamados.</Heading>
      </Center>
    );
  }

  if (!dbUser || carregando) return <Center h="200px"><Spinner color="brand.500" /></Center>;

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={10} align="flex-start">

      <Box flex="1" w="100%" bg="rgba(15, 17, 21, 0.6)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
        <Heading as="h3" size="md" color="ghostWhite" mb={6}>Abrir Novo Chamado</Heading>
        <CreateTicketForm clientId={dbUser._id} projetos={projetos} />
      </Box>

      <Box flex="2" w="100%">
        <Heading as="h3" size="md" color="ghostWhite" mb={6}>Os Meus Chamados</Heading>
        <TicketList initialTickets={tickets} clientId={dbUser._id} />
      </Box>

    </Flex>
  );
}

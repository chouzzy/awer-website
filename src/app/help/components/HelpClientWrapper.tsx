"use client";

import { useEffect, useState } from "react";
import { getOrCreateMongoUser } from "@/actions/users";
import { CreateTicketForm } from "./CreateTicketForm";
import { TicketList } from "./TicketList";
import { Flex, Box, Heading, Spinner, Center } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export function HelpClientWrapper({ allTickets }: { allTickets: any[] }) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    async function sync() {
      if (isAuthenticated && user?.sub) {
        const mongoUser = await getOrCreateMongoUser(user.sub, user.email || "");
        setDbUser(mongoUser);
      }
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

  // Só mostramos o conteúdo quando tivermos o dbUser (ID do Mongo)
  if (!dbUser) return <Center h="200px"><Spinner color="brand.500" /></Center>;

  return (
    <Flex direction={{ base: "column", lg: "row" }} gap={10} align="flex-start">
      
      {/* Coluna Esquerda: Formulário */}
      <Box flex="1" w="100%" bg="rgba(15, 17, 21, 0.6)" p={8} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
        <Heading as="h3" size="md" color="ghostWhite" mb={6}>Abrir Novo Chamado</Heading>
        <CreateTicketForm clientId={dbUser._id} />
      </Box>

      {/* Coluna Direita: Lista Filtrada */}
      <Box flex="2" w="100%">
        <Heading as="h3" size="md" color="ghostWhite" mb={6}>Os Meus Chamados</Heading>
        {/* Passamos o ID do dbUser para o TicketList que agora sabe filtrar */}
        <TicketList initialTickets={allTickets} clientId={dbUser._id} />
      </Box>

    </Flex>
  );
}
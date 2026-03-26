import { Flex, Container, Heading, Text, Box } from "@chakra-ui/react";
import clientPromise from "@/lib/mongodb";
import { HelpClientWrapper } from "./components/HelpClientWrapper";

export const dynamic = "force-dynamic";

export default async function HelpAwerPage() {
  const client = await clientPromise;
  const db = client.db("help_awer");
  
  // 1. Buscamos TODOS os tickets (o filtro final será feito pelo Wrapper no cliente)
  // Ou podes buscar todos os usuários para passar como referência
  const rawTickets = await db.collection("tickets")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const tickets = rawTickets.map(ticket => ({
    id: ticket._id.toString(),
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    attachments: ticket.attachments || [],
    createdAt: ticket.createdAt.toISOString(),
    clientId: ticket.clientId.toString(), // Precisamos do ID para filtrar no cliente
  }));

  return (
    <Container maxW="container.xl" py={{ base: 10, md: 20 }}>
      <Flex direction="column" gap={12}>
        
        <Box textAlign="center">
          <Heading as="h1" size="2xl" color="ghostWhite" mb={4}>
            Help <Box as="span" color="brand.500">Awer</Box>
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Acompanhe os seus projetos e submeta novos pedidos de suporte.
          </Text>
        </Box>

        {/* O Wrapper vai gerir o Auth0 e mostrar apenas o que pertence ao user logado */}
        <HelpClientWrapper allTickets={tickets} />

      </Flex>
    </Container>
  );
}
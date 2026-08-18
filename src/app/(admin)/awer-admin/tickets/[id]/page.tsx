import { Box, Container, Flex, Heading, Button } from "@chakra-ui/react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PiArrowLeftBold } from "react-icons/pi";
import { TicketDetailClient } from "./components/TicketDetailClient";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // No Next.js 15, fazemos o await do params
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;
  const db = client.db("help_awer");

  // 1. Busca o ticket
  const ticket = await db.collection("tickets").findOne({ _id: new ObjectId(id) });
  if (!ticket) notFound();

  // 2. Busca o cliente dono do ticket
  const ticketOwner = await db.collection("users").findOne({ _id: ticket.clientId });

  // 3. Serializa os dados para o Client Component
 const serializedTicket = {
    id: ticket._id.toString(),
    title: ticket.title || "(sem titulo)",
    description: ticket.description || "",
    status: ticket.status || "OPEN",
    priority: ticket.priority || "MEDIUM",
    attachments: ticket.attachments || [],
    // ADICIONE ESTA LINHA ABAIXO:
    messages: ticket.messages || [], 
    createdAt: (ticket.createdAt instanceof Date ? ticket.createdAt : ticket._id.getTimestamp()).toISOString(),
    client: {
      name: ticketOwner?.name || "Cliente Desconhecido",
      email: ticketOwner?.email || "Sem email",
    }
  };

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
      <Flex direction="column" gap={8}>
        
        {/* Navegação e Cabeçalho */}
        <Box>
          <Link href="/awer-admin/tickets">
            <Button variant="ghost" color="gray.400" _hover={{ color: "white" }} mb={4} px={0}>
              <PiArrowLeftBold style={{ marginRight: '8px' }} />
              Voltar aos Chamados
            </Button>
          </Link>
          <Heading as="h1" size="xl" color="ghostWhite">
            Detalhes do Chamado
          </Heading>
        </Box>

        {/* Interface do Ticket */}
        <TicketDetailClient ticket={serializedTicket} />

      </Flex>
    </Container>
  );
}
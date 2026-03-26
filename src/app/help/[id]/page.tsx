import { Box, Container, Flex, Heading, Button, Link } from "@chakra-ui/react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { PiArrowLeftBold } from "react-icons/pi";
import { ClientTicketDetail } from "./components/ClientTicketDetail";

export const dynamic = "force-dynamic";

export default async function HelpTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Validação básica do formato do ID
  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const client = await clientPromise;
  const db = client.db("help_awer");

  // 1. Busca o ticket no MongoDB
  const ticket = await db.collection("tickets").findOne({ _id: new ObjectId(id) });

  if (!ticket) {
    notFound();
  }

  // 2. Serializa os dados para o Client Component
  // IMPORTANTE: Passamos o clientId para o componente de cliente validar a posse
  const serializedTicket = {
    id: ticket._id.toString(),
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    attachments: ticket.attachments || [],
    messages: ticket.messages || [],
    createdAt: ticket.createdAt.toISOString(),
    clientId: ticket.clientId.toString(), // <--- O cadeado usa isto no cliente
    client: {
      name: "Cliente", // O nome real será injetado pelo ClientTicketDetail via dbUser
      email: "",
    }
  };

  return (
    <Container maxW="container.xl" py={{ base: 8, md: 16 }}>
      <Flex direction="column" gap={8}>
        
        {/* Navegação */}
        <Box>
          <Link href="/help" _hover={{ textDecoration: 'none' }}>
            <Button variant="ghost" color="gray.400" _hover={{ color: "white" }} mb={3} px={0}>
              <PiArrowLeftBold style={{ marginRight: '8px' }} />
              Voltar aos Meus Chamados
            </Button>
          </Link>
          <Heading as="h1" size="xl" color="ghostWhite">
            Acompanhamento do Chamado
          </Heading>
        </Box>

        {/* O ClientTicketDetail agora recebe o ticket e, 
          internamente, verifica se o user logado (Auth0) 
          tem o mesmo ID que o clientId do ticket.
        */}
        <ClientTicketDetail ticket={serializedTicket} />

      </Flex>
    </Container>
  );
}
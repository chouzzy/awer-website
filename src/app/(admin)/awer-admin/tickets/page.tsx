import { Flex, Container, Heading, Text, Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { AdminTicketList } from "./components/AdminTicketList";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const client = await clientPromise;
  const db = client.db("help_awer");

  // Agregação MongoDB mais robusta e tolerante a falhas
  const rawTickets = await db.collection("tickets").aggregate([
    {
      $lookup: {
        from: "users",
        localField: "clientId",
        foreignField: "_id",
        as: "clientInfo"
      }
    },
    { 
      $unwind: { 
        path: "$clientInfo", 
        preserveNullAndEmptyArrays: true // A MAGIA ESTÁ AQUI: Não apaga tickets sem cliente
      } 
    }, 
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "projectInfo"
      }
    },
    {
      $unwind: {
        path: "$projectInfo",
        preserveNullAndEmptyArrays: true // chamado sem projeto continua aparecendo
      }
    },
    { $sort: { createdAt: -1 } }
  ]).toArray();

  // Serializa os dados com proteção contra nulos (optional chaining ?.)
  const tickets = rawTickets.map(t => ({
    id: t._id.toString(),
    title: t.title || "(sem titulo)",
    status: t.status || "OPEN",
    priority: t.priority || "MEDIUM",
    createdAt: (t.createdAt instanceof Date ? t.createdAt : t._id.getTimestamp()).toISOString(),
    clientName: t.clientInfo?.name || "Cliente Desconhecido", // Fallback seguro
    clientEmail: t.clientInfo?.email || "N/A",
    projectName: t.projectInfo?.nome || "",
  }));

  return (
    <Container maxW="container.xl" py={{ base: 10, md: 20 }}>
      <Flex direction="column" gap={8}>
        
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
          <Box>
            <Heading as="h1" size="xl" color="ghostWhite" mb={2}>
              QG <Box as="span" color="brand.500">Awer</Box>
            </Heading>
            <Text color="gray.400">
              Painel de controle. Gere todos os chamados, altera estados e dá baixa nos pedidos.
            </Text>
          </Box>
          <Link href="/awer-admin/projetos">
            <Button variant="outline" borderColor="whiteAlpha.300" color="ghostWhite" _hover={{ bg: "whiteAlpha.100" }}>
              Gerir projetos e acessos
            </Button>
          </Link>
        </Flex>

        <Box 
          w="100%" 
          bg="rgba(15, 17, 21, 0.6)" 
          borderRadius="2xl" 
          border="1px solid" 
          borderColor="whiteAlpha.100"
          overflow="hidden"
        >
          <AdminTicketList initialTickets={tickets} />
        </Box>

      </Flex>
    </Container>
  );
}
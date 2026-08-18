import { Container, Flex, Heading, Text, Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import { getTodosProjetos, getUsuariosComProjetos } from "@/actions/projects";
import clientPromise from "@/lib/mongodb";
import { GestaoProjetos } from "./components/GestaoProjetos";

export const dynamic = "force-dynamic";

export default async function AdminProjetosPage() {
  const [projetos, usuarios] = await Promise.all([
    getTodosProjetos(),
    getUsuariosComProjetos(),
  ]);

  // quantos chamados cada projeto tem, para mostrar na lista
  const client = await clientPromise;
  const db = client.db("help_awer");
  const contagem = await db
    .collection("tickets")
    .aggregate([{ $group: { _id: "$projectId", total: { $sum: 1 } } }])
    .toArray();

  const chamadosPorProjeto: Record<string, number> = {};
  let semProjeto = 0;
  for (const c of contagem) {
    if (!c._id) semProjeto = c.total;
    else chamadosPorProjeto[c._id.toString()] = c.total;
  }

  return (
    <Container maxW="container.xl" py={{ base: 10, md: 20 }}>
      <Flex direction="column" gap={8}>
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
          <Box>
            <Heading as="h1" size="xl" color="ghostWhite" mb={2}>
              Projetos <Box as="span" color="brand.500">Awer</Box>
            </Heading>
            <Text color="gray.400">
              Cadastre os projetos e defina quem enxerga cada um. Quem tem e-mail @awer.co vê todos.
            </Text>
          </Box>
          <Link href="/awer-admin/tickets">
            <Button variant="outline" borderColor="whiteAlpha.300" color="ghostWhite" _hover={{ bg: "whiteAlpha.100" }}>
              Voltar aos chamados
            </Button>
          </Link>
        </Flex>

        <GestaoProjetos
          projetos={projetos}
          usuarios={usuarios}
          chamadosPorProjeto={chamadosPorProjeto}
          semProjeto={semProjeto}
        />
      </Flex>
    </Container>
  );
}

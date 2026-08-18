import { Flex, Container, Heading, Text, Box } from "@chakra-ui/react";
import { HelpClientWrapper } from "./components/HelpClientWrapper";

export const dynamic = "force-dynamic";

export default async function HelpAwerPage() {
  // Os chamados NÃO são buscados aqui de propósito.
  // Antes, esta página carregava os chamados de todos os clientes e mandava
  // tudo para o navegador, deixando o filtro para o componente de tela — o que
  // expunha os chamados de um cliente para os outros. Agora quem busca é o
  // wrapper, via server action, já filtrando pelo usuário logado.
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

        <HelpClientWrapper />
      </Flex>
    </Container>
  );
}

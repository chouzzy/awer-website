'use client';

import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    VStack,
    Image,
    Icon,
    Button,
    Link,
    SimpleGrid
} from "@chakra-ui/react";
import { FaFlagCheckered, FaLightbulb, FaRocket } from "react-icons/fa";
import NextLink from 'next/link';
import { FeedbacksCarousel } from "@/components/layout/Feedbacks/FeedbacksCarousel";
import { PiAirplaneTakeoff, PiPlayCircleFill, PiRobot, PiSteps } from "react-icons/pi";
import { CustomersCarousel } from "@/components/layout/Customers/CustomersCarousel";

// Componente para um item da linha do tempo
interface TimelineItemProps {
    icon: any; // You can replace 'any' with a more specific type if needed
    year: string;
    title: string;
    children: React.ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ icon, year, title, children }) => (
    <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        w="100%"
        mb={{ base: 8, md: 16 }}
    >
        {/* Ícone e Ano */}
        <VStack gap={2} mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 8 }} align="center">
            <Flex
                w={{ base: 16, md: 20 }}
                h={{ base: 16, md: 20 }}
                align="center"
                justify="center"
                bg="gray.800"
                border="2px solid"
                borderColor="brand.500"
                borderRadius="full"
            >
                <Icon as={icon} boxSize={{ base: 8, md: 10 }} color="brand.500" />
            </Flex>
            <Text fontWeight="bold" fontSize="lg" color="brand.400">{year}</Text>
        </VStack>

        {/* Conteúdo */}
        <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
            <Heading as="h3" size="lg" mb={3}>{title}</Heading>
            <Text color="gray.400">{children}</Text>
        </Box>
    </Flex>
);

export default function NossaHistoria() {

    return (
        <Flex direction="column" w="100%" bg="bodyBg" color="white">
            {/* Seção Hero */}
            <Flex
                w="100%"
                minH={{ base: "60vh", md: "70vh" }}
                align="center"
                justify="center"
                bg="radial-gradient(ellipse at bottom, rgba(255,95,94,0.15) 0%, rgba(0,0,0,0) 70%)"
                px={{ base: 4, md: 8 }}
            >
                <VStack gap={6} textAlign="center" maxW="4xl">
                    <Heading as="h1" fontSize={{ base: '4xl', md: '6xl' }} fontWeight="extrabold" lineHeight="1.1">
                        Inovação que nasce da <Box as="span" color="brand.500">ineficiência</Box>.
                    </Heading>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.300">
                        Nossa jornada começou com uma pergunta simples: "Por que um processo tão crucial ainda é tão manual?". Descubra como transformamos essa frustração na força motriz por trás da AWER.
                    </Text>
                </VStack>
            </Flex>

            <Flex p={{ base: 8, md: 24 }} bgColor={'gray.900'}>
                <VStack gap={8} align="start" fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
                    <Heading as="h2" size="2xl" mb={4} alignSelf="start" borderLeft="4px solid" borderColor="brand.500" pl={4}>
                        Nossa <b style={{ color: '#ff5f5e' }}> História</b>
                    </Heading>
                    <Text color="gray.300">
                        Em um mundo de dados, processos e sistemas, acreditamos que o mais importante ainda são e sempre vão ser as pessoas. A Awer Consultoria nasceu com essa filosofia: usar a tecnologia para dar mais controle e eficiência às empresas, liberando o potencial humano para a estratégia e bem-estar!
                    </Text>
                    <Text color="gray.300">
                        Nossa história não começou com um plano de consultoria estratégica, mas com relacionamento. Enquanto estávamos desenvolvendo um aplicativo para gestão financeira, fomos procurados por uma empresa familiar que confiou em nossa capacidade de transformar sua gestão. Esse foi o ponto de virada. O resultado foi tão positivo que nossa reputação cresceu da forma mais genuína possível: através de indicações para as pessoas mais próximas, de familiar para familiar, de parceiro para parceiro.
                    </Text>
                    <Text color="gray.300">
                        Essa origem, baseada na confiança pessoal, moldou quem somos. Para cada desafio de gestão, nossa área de tecnologia respondia com uma solução. Desenvolvemos automações que se tornaram a espinha dorsal da eficiência de nossos clientes, provando que a tecnologia funciona melhor quando atende a uma necessidade real.
                    </Text>
                    <Text color="gray.300">
                        Hoje, consolidamos nossa atuação em duas frentes poderosas: uma consultoria que oferece visibilidade de resultados e impulsiona a performance financeira, e um braço de tecnologia focado em inovação prática.
                        Nosso grande objetivo é expandir o alcance da nossa consultoria, mas, acima de tudo, sermos reconhecidos por criar soluções tecnológicas que simplificam operações, otimizam o tempo e permitem que as pessoas façam o que sabem fazer de melhor: pensar, criar e viver.
                    </Text>
                </VStack>
            </Flex>

            {/* Seção da Linha do Tempo */}
            <Flex flexDir={'column'} px={{ base: 8, md: 24 }} py={{ base: 16, md: 20 }}>
                <Heading as="h3" size="2xl" mb={16} alignSelf="start" borderLeft="4px solid" borderColor="brand.600" pl={4} py={4} >
                    Nossa <b style={{ color: '#ff5f5e' }}>linha do tempo</b>
                </Heading>
                <TimelineItem
                    icon={PiPlayCircleFill}
                    year="2020"
                    title="O Início da AWER"
                >
                    Nossa história começou com a visão de simplificar e automatizar processos, permitindo que os profissionais dedicassem menos tempo a tarefas manuais e democratizando o acesso à informação. A inspiração para o nome "AWER" veio da palavra "aware" (consciente), refletindo nosso compromisso em aconselhar e guiar nossos clientes rumo a soluções inovadoras e eficientes.
                </TimelineItem>
                <TimelineItem
                    icon={PiAirplaneTakeoff}
                    year="2021"
                    title="Consultoria com Tecnologia"
                >
                    O início da consultoria de gestão financeira da AWER foi marcado por um desafio: uma empresa familiar confiou em nós para transformar sua gestão. Esse foi o ponto de virada, impulsionado pelo sucesso no projeto, recebemos indicações genuínas pela confiança em nossa capacidade de gerar resultado em nossos clientes.
                </TimelineItem>

                <TimelineItem
                    icon={FaRocket}
                    year="2023"
                    title="Consolidação"
                >
                    Nas consultorias, <b>geramos mais de R$ 3 milhões no caixa de nossos clientes</b>, proporcionando mais conforto aos gestores e melhores oportunidades para os colaboradores.
                    Nosso ano também foi marcado pela evolução dos nossos produtos de tecnologia. No segundo semestre, implementamos automações desenvolvidas internamente, que já economizaram mais de 500 horas de trabalho para nossos clientes.
                </TimelineItem>
                <TimelineItem
                    icon={PiRobot}
                    year="2024"
                    title="Evolução Tecnológica"
                >
                    Em 2024, lançamos o nosso primeiro sistema web e nosso primeiro aplicativo desktop, o <b>Bot<b style={{ color: '#ff5f5e' }}>TRT</b></b>. Estes lançamentos representam um marco importante na nossa jornada, impulsionando a inovação e oferecendo soluções práticas para nossos clientes.
                </TimelineItem>


                <TimelineItem
                    icon={FaFlagCheckered}
                    year="Hoje"
                    title="Nossa Missão"
                >
                    Hoje, a AWER é movida por dois propósitos: criar tecnologia que elimina o trabalho manual e potencializar a capacidade de gestão de pequenas e médias empresas partindo da gestão financeira e automatização de processos. Continuamos a expandir nossas ferramentas, sempre com o compromisso de transformar processos complexos em soluções simples, eficientes e de alto impacto para o negócio dos nossos clientes.
                </TimelineItem>
            </Flex>

            <FeedbacksCarousel />
            <CustomersCarousel />


        </Flex>
    );
}


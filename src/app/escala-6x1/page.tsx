'use client';

import { useState } from "react";
import { Box, Flex, Heading, Text, Icon, SimpleGrid, Button, Input, Link as ChakraLink, chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  PiCalendarBold, PiUsersThreeBold, PiCurrencyCircleDollarBold, PiArrowsSplitBold,
  PiCalendarCheckBold, PiColumnsBold, PiListChecksBold, PiWhatsappLogoBold,
  PiCheckCircleBold, PiArrowDownBold, PiWarningCircleBold,
} from "react-icons/pi";
import type { IconType } from "react-icons";
import {
  FAIXAS_FUNCIONARIOS, SEGMENTOS, escala6x1Video, linhaDoTempo, comoAjudamos,
  recursosPlanejador, avisoLegal,
} from "@/data/escala6x1";
import { createLeadEscala6x1 } from "@/actions/leads";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/utils";

const recursoIcons: IconType[] = [
  PiUsersThreeBold, PiCurrencyCircleDollarBold, PiArrowsSplitBold,
  PiCalendarCheckBold, PiColumnsBold, PiListChecksBold,
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function Section({ children, id, label }: { children: React.ReactNode; id?: string; label?: string }) {
  return (
    <motion.section id={id} aria-label={label} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} style={{ width: "100%" }}>
      <Flex direction="column" gap={8} maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 12, md: 20 }}>
        {children}
      </Flex>
    </motion.section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <Text color="brand.400" fontSize="sm" fontWeight="bold" letterSpacing="0.14em" textTransform="uppercase">
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// Formulário de solicitação
// ---------------------------------------------------------------------------
function Choice({ label, options, value, onChange, error, name }: {
  label: string; options: readonly string[]; value: string; onChange: (v: string) => void; error?: string; name: string;
}) {
  return (
    <chakra.fieldset border="none" p={0} m={0}>
      <chakra.legend fontSize="sm" color="gray.300" fontWeight="semibold" mb={2}>{label}</chakra.legend>
      <Flex wrap="wrap" gap={2} role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <Button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              size="sm"
              minH="40px"
              variant="outline"
              borderColor={selected ? "brand.500" : "whiteAlpha.300"}
              bg={selected ? "rgba(255,95,94,0.14)" : "whiteAlpha.50"}
              color={selected ? "brand.300" : "gray.200"}
              fontWeight={selected ? "bold" : "medium"}
              _hover={{ borderColor: "brand.400" }}
              onClick={() => onChange(opt)}
            >
              {opt}
            </Button>
          );
        })}
      </Flex>
      {error && <Text color="red.300" fontSize="xs" mt={1.5}>{error}</Text>}
    </chakra.fieldset>
  );
}

function Field({ id, label, error, ...props }: { id: string; label: string; error?: string } & React.ComponentProps<typeof Input>) {
  return (
    <Flex direction="column" gap={1.5}>
      <chakra.label htmlFor={id} fontSize="sm" color="gray.300" fontWeight="semibold">{label}</chakra.label>
      <Input
        id={id}
        name={id}
        size="lg"
        bg="whiteAlpha.50"
        borderColor={error ? "red.400" : "whiteAlpha.300"}
        color="white"
        _placeholder={{ color: "gray.500" }}
        _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
        aria-invalid={!!error}
        {...props}
      />
      {error && <Text color="red.300" fontSize="xs">{error}</Text>}
    </Flex>
  );
}

function LeadForm() {
  const [values, setValues] = useState({ nome: "", empresa: "", whatsapp: "", email: "", website: "" });
  const [funcionarios, setFuncionarios] = useState("");
  const [segmento, setSegmento] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const waMessage =
    `Olá! Quero o Planejador de Escalas 6x1. Sou ${values.nome || "[nome]"}, da ${values.empresa || "[empresa]"}` +
    (segmento ? ` (${segmento}` + (funcionarios ? `, ${funcionarios} funcionários)` : ")") : "") + ".";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setFormError("");
    setErrors({});
    const res = await createLeadEscala6x1({ ...values, funcionarios, segmento } as Parameters<typeof createLeadEscala6x1>[0]);
    if (res.ok) {
      trackEvent({ event: "contact_form_submit", source: "escala_6x1", segmento, funcionarios });
      setStatus("done");
      return;
    }
    setErrors(res.fieldErrors ?? {});
    setFormError(res.error);
    setStatus("idle");
  };

  if (status === "done") {
    return (
      <Flex direction="column" gap={5} align="flex-start" role="status">
        <Icon as={PiCheckCircleBold} color="green.300" boxSize={12} />
        <Heading as="h3" fontSize={{ base: "2xl", md: "3xl" }} color="white">Recebemos seu pedido.</Heading>
        <Text color="gray.300" fontSize="lg" lineHeight="tall">
          Vamos entrar em contato pelo WhatsApp informado. Se quiser adiantar, mande a mensagem agora: já vai com os dados da sua empresa.
        </Text>
        <ChakraLink
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent({ event: "whatsapp_click", origin: "escala_6x1_sucesso" })}
          display="inline-flex" alignItems="center" gap={2.5}
          bg="#25D366" color="#06240F" fontWeight="bold" fontSize="lg"
          px={6} py={3.5} borderRadius="lg" textDecoration="none"
          _hover={{ textDecoration: "none", filter: "brightness(1.05)" }}
        >
          <Icon as={PiWhatsappLogoBold} boxSize={5} /> Continuar no WhatsApp
        </ChakraLink>
      </Flex>
    );
  }

  return (
    <chakra.form onSubmit={onSubmit} noValidate display="flex" flexDirection="column" gap={5}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Field id="nome" label="Seu nome" placeholder="Nome e sobrenome" autoComplete="name" value={values.nome} onChange={set("nome")} error={errors.nome} />
        <Field id="empresa" label="Empresa" placeholder="Nome da empresa" autoComplete="organization" value={values.empresa} onChange={set("empresa")} error={errors.empresa} />
        <Field id="whatsapp" label="WhatsApp" placeholder="(16) 99999-9999" type="tel" inputMode="tel" autoComplete="tel" value={values.whatsapp} onChange={set("whatsapp")} error={errors.whatsapp} />
        <Field id="email" label="E-mail (opcional)" placeholder="voce@empresa.com.br" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
      </SimpleGrid>

      {/* Campo isca contra robôs: escondido de pessoas e de leitores de tela */}
      <Box position="absolute" left="-10000px" aria-hidden="true">
        <label htmlFor="website">Não preencha</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </Box>

      <Choice name="funcionarios" label="Quantos funcionários?" options={FAIXAS_FUNCIONARIOS} value={funcionarios} onChange={setFuncionarios} error={errors.funcionarios} />
      <Choice name="segmento" label="Segmento" options={SEGMENTOS} value={segmento} onChange={setSegmento} error={errors.segmento} />

      {formError && (
        <Flex gap={2} align="flex-start" color="red.200" bg="rgba(229,62,62,0.12)" borderRadius="md" p={3} fontSize="sm" role="alert">
          <Icon as={PiWarningCircleBold} boxSize={5} mt="1px" flexShrink={0} />
          <Box>
            {formError}{" "}
            <ChakraLink href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" textDecoration="underline" color="white">
              Abrir WhatsApp
            </ChakraLink>
          </Box>
        </Flex>
      )}

      <Button
        type="submit"
        loading={status === "sending"}
        loadingText="Enviando..."
        size="lg"
        minH="56px"
        bg="brand.500"
        color="white"
        fontWeight="bold"
        fontSize="lg"
        _hover={{ bg: "brand.600" }}
      >
        Quero o Planejador de Escalas
      </Button>
      <Text fontSize="xs" color="gray.500">
        Usamos seus dados só para falar com você sobre o Planejador. Veja a{" "}
        <ChakraLink href="/politica-de-privacidade" textDecoration="underline" color="gray.400">Política de Privacidade</ChakraLink>.
      </Text>
    </chakra.form>
  );
}

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export default function Escala6x1Page() {
  const goToForm = (origin: string) => {
    trackEvent({ event: "cta_click", origin });
    document.getElementById("solicitar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box as="main" w="100%" color="white">
      {/* Hero */}
      <Box position="relative" overflow="hidden" borderBottom="1px solid" borderColor="whiteAlpha.100">
        <Box position="absolute" top={0} left="50%" transform="translateX(-50%)" w={{ base: "400px", md: "900px" }} h="2px" bg="brand.500" opacity={0.6} filter="blur(6px)" pointerEvents="none" />
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            align="center"
            gap={{ base: 10, lg: 14 }}
            maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 12, md: 20 }} pb={{ base: 14, md: 20 }}
          >
            <Flex direction="column" gap={6} flex="1 1 0" minW={0}>
              <Flex align="center" gap={2} alignSelf="flex-start" px={4} py={2} borderRadius="full" bg="whiteAlpha.100" border="1px solid" borderColor="whiteAlpha.300">
                <Icon as={PiCalendarBold} color="brand.400" boxSize={4} />
                <Text color="brand.300" fontSize="sm" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase">
                  Fim da escala 6x1
                </Text>
              </Flex>
              <Heading as="h1" fontSize={{ base: "4xl", md: "5xl", lg: "56px" }} fontWeight="extrabold" lineHeight="1.08">
                A nova jornada vai mexer na sua folha.{" "}
                <Box as="span" color="brand.400">Saiba quanto antes de decidir.</Box>
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color="whiteAlpha.800" lineHeight="tall">
                O Senado aprovou a PEC do fim da escala 6x1. Com duas folgas por semana e jornada menor, a mesma operação vai precisar de mais gente.
                O Planejador de Escalas da Awer mostra quantas pessoas a mais, quanto custa e qual caminho faz mais sentido para a sua empresa.
              </Text>
              <Flex gap={3} wrap="wrap">
                <Button size="lg" minH="52px" bg="brand.500" color="white" fontWeight="bold" px={7} _hover={{ bg: "brand.600" }} onClick={() => goToForm("escala_6x1_hero")}>
                  Quero o Planejador <Icon as={PiArrowDownBold} />
                </Button>
              </Flex>
            </Flex>

            <Box flex="1.15 1 0" w="100%" minW={0}>
              <Box borderRadius="xl" overflow="hidden" border="1px solid" borderColor="whiteAlpha.200" boxShadow="0 30px 80px rgba(0,0,0,0.55)" bg="black">
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={escala6x1Video.poster}
                  style={{ display: "block", width: "100%", aspectRatio: "16 / 9", background: "#000" }}
                  onPlay={() => trackEvent({ event: "video_play", video: "planejador_escalas_6x1" })}
                >
                  <source src={escala6x1Video.src} type="video/mp4" />
                  Seu navegador não reproduz vídeo. <a href={escala6x1Video.src}>Baixe o vídeo</a>.
                </video>
              </Box>
              <Text mt={3} fontSize="sm" color="gray.400">Demonstração do Planejador de Escalas · 5 min 30 s · com legendas</Text>
            </Box>
          </Flex>
        </motion.div>
      </Box>

      {/* Linha do tempo */}
      <Section label="Linha do tempo da mudança">
        <Flex direction="column" gap={3} maxW="760px">
          <Kicker>O que muda e quando</Kicker>
          <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.15">
            O prazo começa a contar na promulgação. Quem planeja antes, escolhe o caminho.
          </Heading>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {linhaDoTempo.map((e, i) => (
            <Flex key={e.titulo} direction="column" gap={2} p={6} borderRadius="xl" bg="whiteAlpha.50" border="1px solid" borderColor={i === 0 ? "brand.500" : "whiteAlpha.200"}>
              <Text color="brand.300" fontWeight="bold" fontSize="sm" letterSpacing="wide">{e.quando}</Text>
              <Text fontSize="xl" fontWeight="bold">{e.titulo}</Text>
              <Text color="gray.300" lineHeight="tall">{e.texto}</Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Section>

      {/* Como a Awer ajuda */}
      <Box bg="whiteAlpha.50" borderY="1px solid" borderColor="whiteAlpha.100">
        <Section label="Como a Awer ajuda">
          <Flex direction="column" gap={4} maxW="820px">
            <Kicker>Mais do que uma calculadora</Kicker>
            <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.15">
              Nosso trabalho é encontrar o resultado que paga a nova jornada.
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.300" lineHeight="tall">
              A Awer identifica oportunidades de melhoria de resultado no seu negócio e constrói com você o plano de ação, acompanhando a execução,
              para que o fim da escala 6x1 não vire só aumento de custo com pessoal.
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            {comoAjudamos.map((p) => (
              <Flex key={p.passo} direction="column" gap={3} p={7} borderRadius="xl" bg="blackAlpha.500" border="1px solid" borderColor="whiteAlpha.200">
                <Text fontSize="4xl" fontWeight="extrabold" color="brand.500" lineHeight="1">{p.passo}</Text>
                <Text fontSize="xl" fontWeight="bold">{p.titulo}</Text>
                <Text color="gray.300" lineHeight="tall">{p.texto}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Section>
      </Box>

      {/* Recursos do Planejador */}
      <Section label="O que o Planejador mostra">
        <Flex direction="column" gap={3} maxW="760px">
          <Kicker>O que o Planejador mostra</Kicker>
          <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.15">
            Uma mudança complexa, traduzida em números claros.
          </Heading>
        </Flex>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
          {recursosPlanejador.map((r, i) => (
            <Flex key={r.titulo} gap={4} p={6} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.200" align="flex-start">
              <Flex flexShrink={0} align="center" justify="center" w={11} h={11} borderRadius="lg" bg="rgba(255,95,94,0.14)">
                <Icon as={recursoIcons[i]} color="brand.400" boxSize={6} />
              </Flex>
              <Flex direction="column" gap={1}>
                <Text fontWeight="bold" fontSize="lg">{r.titulo}</Text>
                <Text color="gray.300" lineHeight="tall">{r.texto}</Text>
              </Flex>
            </Flex>
          ))}
        </SimpleGrid>
      </Section>

      {/* Formulário */}
      <Box id="solicitar" scrollMarginTop="24px" bg="whiteAlpha.50" borderTop="1px solid" borderColor="whiteAlpha.100">
        <Section label="Solicitar o Planejador">
          <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 8, lg: 16 }}>
            <Flex direction="column" gap={4} flex="1 1 0">
              <Kicker>Solicite o Planejador</Kicker>
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.15">
                Veja os números da sua empresa antes do prazo começar.
              </Heading>
              <Text fontSize="lg" color="gray.300" lineHeight="tall">
                Preencha os dados e um consultor da Awer fala com você para montar o diagnóstico com o quadro e os custos reais da sua operação.
              </Text>
              <Text fontSize="sm" color="gray.500" mt={2}>{avisoLegal}</Text>
            </Flex>
            <Box flex="1.2 1 0" p={{ base: 5, md: 8 }} borderRadius="2xl" bg="#0E0E12" border="1px solid" borderColor="whiteAlpha.200" position="relative">
              <LeadForm />
            </Box>
          </Flex>
        </Section>
      </Box>
    </Box>
  );
}

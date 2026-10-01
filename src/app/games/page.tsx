'use client';

import { Box, Flex, Heading, Text, Image, Link as ChakraLink, Icon, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  PiGameControllerBold, PiPlayFill, PiCheckBold, PiLightningBold, PiStarBold,
  PiCurrencyCircleDollarBold, PiBookOpenBold, PiWhatsappLogoBold,
} from "react-icons/pi";
import { games, Game } from "@/data/games";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink } from "@/utils";

const DISPLAY = "var(--font-games-display), sans-serif";
const BODY = "var(--font-games-body), system-ui, sans-serif";

const meterIcons: Record<string, IconType> = {
  Energia: PiLightningBold,
  Reputação: PiStarBold,
  Dinheiro: PiCurrencyCircleDollarBold,
  Conhecimento: PiBookOpenBold,
};

const chips = ["Grátis", "Sem cadastro", "Celular e PC", "Partidas de poucos minutos"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function PlayButton({ game }: { game: Game }) {
  return (
    <ChakraLink
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent({ event: "game_click", game: game.slug })}
      display="inline-flex"
      alignItems="center"
      gap={2.5}
      bg={game.theme.button}
      color={game.theme.buttonText}
      fontFamily={DISPLAY}
      fontWeight={800}
      fontSize="22px"
      letterSpacing="0.06em"
      px={7}
      py={4}
      borderRadius="12px"
      textDecoration="none"
      transition="transform .15s, filter .15s"
      _hover={{ textDecoration: "none", transform: "translateY(-2px)", filter: "brightness(1.08)" }}
      _focusVisible={{ outline: "3px solid", outlineColor: "white", outlineOffset: "3px" }}
    >
      <Icon as={PiPlayFill} boxSize="18px" />
      JOGAR AGORA
    </ChakraLink>
  );
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const t = game.theme;
  const reversed = index % 2 === 1;

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
      <Flex
        as="article"
        direction={{ base: "column", lg: reversed ? "row-reverse" : "row" }}
        borderRadius={{ base: "22px", md: "28px" }}
        overflow="hidden"
        bg={t.card}
        border="1px solid rgba(255,255,255,0.08)"
      >
        {/* Palco com o celular */}
        <Flex
          flex={{ base: "none", lg: "1 1 0" }}
          minH={{ base: "380px", md: "460px" }}
          bg={t.stage}
          style={{ backgroundImage: t.stagePattern, backgroundSize: game.featureStyle === "meters" ? "22px 22px" : undefined }}
          align="center"
          justify="center"
          px={6}
          py={{ base: 16, md: 12 }}
          pos="relative"
        >
          <Flex
            pos="absolute"
            top={{ base: 4, md: 6 }}
            {...(reversed ? { right: { base: 4, md: 6 } } : { left: { base: 4, md: 6 } })}
            align="center"
            gap={2}
            bg={t.badgeBg}
            color={t.badgeColor}
            fontFamily={DISPLAY}
            fontWeight={800}
            fontSize="18px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            px={3}
            py={1.5}
            borderRadius="6px"
          >
            {!reversed && <Box w="9px" h="9px" borderRadius="full" bg="#FF5F5E" />}
            {game.badge}
          </Flex>
          <Box
            w={{ base: "220px", md: "260px" }}
            borderRadius="36px"
            bg={t.frame}
            p="10px"
            transform={`rotate(${t.tilt})`}
            boxShadow="0 30px 60px rgba(0,0,0,0.35)"
          >
            <Image
              src={game.image}
              alt={game.imageAlt}
              display="block"
              w="100%"
              h={{ base: "400px", md: "500px" }}
              objectFit="cover"
              objectPosition="top"
              borderRadius="28px"
              loading="lazy"
            />
          </Box>
        </Flex>

        {/* Texto */}
        <Flex flex={{ base: "none", lg: "1 1 0" }} direction="column" justify="center" gap={5} p={{ base: 7, md: 12 }}>
          <Text
            alignSelf="flex-start"
            bg={t.tagBg}
            color={t.tagColor}
            fontWeight={800}
            fontSize="13px"
            letterSpacing="0.14em"
            textTransform="uppercase"
            px={2.5}
            py={1.5}
            borderRadius="4px"
          >
            {game.tag}
          </Text>
          <Heading
            as="h2"
            fontFamily={DISPLAY}
            fontWeight={900}
            fontSize={{ base: "46px", md: "64px" }}
            lineHeight="0.95"
            textTransform="uppercase"
            color={t.title}
          >
            {game.title}
          </Heading>
          <Text fontSize={{ base: "16px", md: "18px" }} lineHeight="1.6" color={t.muted}>
            {game.description}
          </Text>

          {game.featureStyle === "list" ? (
            <Flex as="ul" direction="column" gap={2.5} listStyleType="none" m={0} p={0}>
              {game.features.map((f) => (
                <Flex as="li" key={f.label} gap={2.5} align="flex-start" color="#E9ECF5" fontSize={{ base: "15px", md: "16px" }}>
                  <Icon as={PiCheckBold} color="#FFD166" boxSize="18px" mt="3px" flexShrink={0} />
                  {f.label}
                </Flex>
              ))}
            </Flex>
          ) : (
            <SimpleGrid columns={2} gap={2.5} maxW="420px">
              {game.features.map((f) => (
                <Flex key={f.label} align="center" gap={2.5} bg="#2B2A44" borderRadius="10px" px={3.5} py={3} fontWeight={600} color="white" fontSize="15px">
                  <Icon as={meterIcons[f.label] ?? PiStarBold} boxSize="18px" />
                  {f.label}
                </Flex>
              ))}
            </SimpleGrid>
          )}

          <Flex align="center" gap={3.5} wrap="wrap" mt={2}>
            <PlayButton game={game} />
            <Text fontSize="14px" color={t.muted} opacity={0.85}>Abre em nova aba</Text>
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
}

export default function GamesPage() {
  return (
    <Box
      as="main"
      w="100%"
      mb={{ base: -8, md: -16 }} // anula o mt do Footer para o fundo da página encostar no rodapé
      bg="#0A0D18"
      color="#E9ECF5"
      fontFamily={BODY}
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Hero */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Flex direction="column" gap={5} maxW="1240px" mx="auto" px={{ base: 4, md: 6 }} pt={{ base: 14, md: 24 }} pb={{ base: 10, md: 14 }}>
          <Flex align="center" gap={3} wrap="wrap">
            <Flex align="center" gap={2} bg="#FF5F5E" color="#1A0606" fontWeight={800} fontSize="13px" letterSpacing="0.14em" px={3} py={1.5} borderRadius="6px">
              <Icon as={PiGameControllerBold} boxSize="16px" />
              AWER GAMES
            </Flex>
            <Text fontSize="13px" letterSpacing="0.14em" fontWeight={700} color="#A9B0C7">
              LABORATÓRIO DE JOGOS DA AWER
            </Text>
          </Flex>
          <Heading
            as="h1"
            fontFamily={DISPLAY}
            fontWeight={900}
            fontSize={{ base: "60px", md: "96px", lg: "128px" }}
            lineHeight="0.9"
            letterSpacing="-0.01em"
            textTransform="uppercase"
            color="white"
            maxW="980px"
          >
            Aperte <Box as="span" color="#FFD166">play</Box> e decida rápido.
          </Heading>
          <Text fontSize={{ base: "17px", md: "20px" }} lineHeight="1.55" color="#C3C9DB" maxW="620px">
            Jogos curtos de decisão, feitos pela Awer. Grátis, sem cadastro e direto no navegador do celular ou do computador.
          </Text>
          <Flex gap={2.5} wrap="wrap" mt={1.5}>
            {chips.map((c) => (
              <Text key={c} border="1px solid rgba(255,255,255,0.16)" borderRadius="full" px={3.5} py={2} fontSize="14px" fontWeight={600}>
                {c}
              </Text>
            ))}
          </Flex>
        </Flex>
      </motion.div>

      {/* Jogos */}
      <Flex as="section" aria-label="Jogos" direction="column" gap={8} maxW="1240px" mx="auto" px={{ base: 4, md: 6 }} pb={{ base: 16, md: 24 }}>
        {games.map((game, i) => (
          <GameCard key={game.slug} game={game} index={i} />
        ))}

        {/* CTA comercial */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap={6}
          border="2px dashed rgba(255,255,255,0.18)"
          borderRadius={{ base: "22px", md: "28px" }}
          px={{ base: 6, md: 10 }}
          py={{ base: 7, md: 9 }}
        >
          <Flex direction="column" gap={2} maxW="640px">
            <Text fontFamily={DISPLAY} fontWeight={800} fontSize={{ base: "28px", md: "34px" }} lineHeight="1.05" textTransform="uppercase" color="white">
              Quer um jogo com a cara da sua marca?
            </Text>
            <Text fontSize="17px" lineHeight="1.55" color="#C3C9DB">
              A Awer cria jogos curtos de navegador para treinamento, onboarding e ações de marca.
            </Text>
          </Flex>
          <ChakraLink
            href={whatsappLink("Olá! Vi os jogos da Awer e quero conversar sobre um jogo para a minha empresa.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ event: "whatsapp_click", origin: "games_cta" })}
            display="inline-flex"
            alignItems="center"
            gap={2.5}
            flexShrink={0}
            color="white"
            fontWeight={700}
            fontSize="17px"
            px={6}
            py={3.5}
            borderRadius="12px"
            border="2px solid #FF5F5E"
            textDecoration="none"
            transition="transform .15s, background-color .15s"
            _hover={{ textDecoration: "none", transform: "translateY(-2px)", bg: "rgba(255,95,94,0.12)" }}
          >
            <Icon as={PiWhatsappLogoBold} boxSize="20px" />
            Falar no WhatsApp
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  );
}

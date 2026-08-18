"use client";

import { Tooltip, Portal, Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}

/**
 * Tooltip para a lista de chamados: ao passar o mouse, mostra o título e a
 * descrição por completo — que na tabela aparecem cortados.
 */
export function TicketTooltip({ titulo, descricao, children }: Props) {
  return (
    <Tooltip.Root openDelay={200} closeDelay={80} positioning={{ placement: "bottom-start" }}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            bg="#0F1115"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="lg"
            boxShadow="0 8px 30px rgba(0,0,0,0.6)"
            maxW="460px"
            px={4}
            py={3}
          >
            <Box>
              <Text color="ghostWhite" fontWeight="semibold" fontSize="sm" mb={descricao ? 2 : 0}>
                {titulo}
              </Text>
              {descricao && (
                <Text color="gray.400" fontSize="xs" lineHeight="1.5" whiteSpace="pre-wrap">
                  {descricao}
                </Text>
              )}
            </Box>
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}

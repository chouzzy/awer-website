"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTicket } from "@/actions/tickets";
import {
  Box, Button, Input, Textarea, Flex, Text, Icon, Spinner,
  Select,
  Portal,
  createListCollection
} from "@chakra-ui/react";
import { PiUploadSimpleBold, PiCheckCircleFill } from "react-icons/pi";
import { useAuth0 } from "@auth0/auth0-react";
import { toaster } from "@/components/ui/toaster";
import { trackEvent } from "@/lib/analytics";

const ticketSchema = z.object({
  projectId: z.string().min(1, "Escolha o projeto."),
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

const priorityOptions = {
  items: [
    { value: "LOW", label: "Baixa" },
    { value: "MEDIUM", label: "Média" },
    { value: "HIGH", label: "Alta" },
    { value: "URGENT", label: "Urgente" },
  ],
};

const priorityColors: Record<string, string> = {
  LOW: "green.400",
  MEDIUM: "yellow.400",
  HIGH: "orange.400",
  URGENT: "red.400",
};

interface Projeto { id: string; nome: string; cliente: string }

export function CreateTicketForm({ clientId, projetos = [] }: { clientId: string; projetos?: Projeto[] }) {
  const { user } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const priorityCollection = useMemo(
    () => createListCollection({ items: priorityOptions.items }),
    []
  );

  const projetoCollection = useMemo(
    () => createListCollection({
      items: projetos.map((p) => ({ value: p.id, label: p.cliente ? `${p.nome} — ${p.cliente}` : p.nome })),
    }),
    [projetos]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "MEDIUM", projectId: projetos.length === 1 ? projetos[0].id : "" }
  });

  const currentPriority = watch("priority");

  const submitCreateTicket = async (data: TicketFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("priority", data.priority);
      formData.append("clientId", clientId);
      formData.append("projectId", data.projectId);
      formData.append("auth0UserId", user?.sub || "");

      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const result = await createTicket(formData);

      if (result.success) {
        reset();
        setSelectedFiles(null);
        trackEvent({ event: 'ticket_create', priority: data.priority, has_attachments: (selectedFiles?.length ?? 0) > 0 });
        toaster.create({ title: "Chamado aberto com sucesso!", type: "success" });
      } else {
        toaster.create({ title: "Erro ao abrir chamado", description: result.error, type: "error" });
      }
    } catch (error) {
      console.error(error);
      toaster.create({ title: "Erro inesperado", description: "Tente novamente.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitCreateTicket)}>
      <Flex direction="column" gap={5}>

        {/* Projeto */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Projeto</Text>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select.Root
                collection={projetoCollection}
                value={field.value ? [field.value] : []}
                onValueChange={({ value }) => field.onChange(value[0])}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor={errors.projectId ? "red.400" : "whiteAlpha.200"}
                    color="white"
                    px={3}
                  >
                    <Select.ValueText placeholder="Sobre qual projeto é este chamado?" />
                  </Select.Trigger>
                  <Select.IndicatorGroup><Select.Indicator /></Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#0F1115" borderColor="whiteAlpha.200">
                      {projetoCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value} color="white" _hover={{ bg: "whiteAlpha.100" }}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            )}
          />
          {projetos.length === 0 && (
            <Text color="orange.300" fontSize="xs" mt={1}>
              Nenhum projeto liberado para você ainda. Fale com a Awer.
            </Text>
          )}
          {errors.projectId && <Text color="red.400" fontSize="xs" mt={1}>{errors.projectId.message}</Text>}
        </Box>

        {/* Título */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Título do Chamado</Text>
          <Input
            {...register("title")}
            placeholder="Ex: Erro no Checkout"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor={errors.title ? "red.400" : "whiteAlpha.200"}
            color="white"
            _placeholder={{ color: "gray.600" }}
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
          />
          {errors.title && <Text color="red.400" fontSize="xs" mt={1}>{errors.title.message}</Text>}
        </Box>

        {/* Descrição */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Descrição do problema</Text>
          <Textarea
            {...register("description")}
            placeholder="Descreva o problema em detalhes: o que aconteceu, quando e como reproduzir."
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor={errors.description ? "red.400" : "whiteAlpha.200"}
            color="white"
            rows={5}
            resize="vertical"
            _placeholder={{ color: "gray.600" }}
            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
          />
          {errors.description && <Text color="red.400" fontSize="xs" mt={1}>{errors.description.message}</Text>}
        </Box>

        {/* Prioridade */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Prioridade</Text>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select.Root
                collection={priorityCollection}
                size="sm"
                name={field.name}
                value={[field.value]}
                onValueChange={(details) => field.onChange(details.value[0])}
                onInteractOutside={() => field.onBlur()}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor={errors.priority ? "red.400" : "whiteAlpha.200"}
                    color="white"
                    _focus={{ borderColor: "brand.500" }}
                  >
                    <Flex align="center" gap={2} flex={1}>
                      {currentPriority && (
                        <Box w={2} h={2} borderRadius="full" bg={priorityColors[currentPriority]} flexShrink={0} />
                      )}
                      <Select.ValueText placeholder="Seleciona a prioridade" />
                    </Flex>
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#1A1A1A" borderColor="whiteAlpha.200">
                      {priorityOptions.items.map((option) => (
                        <Select.Item
                          item={option}
                          key={option.value}
                          _hover={{ bg: "whiteAlpha.100" }}
                          color="white"
                        >
                          <Flex align="center" gap={2}>
                            <Box w={2} h={2} borderRadius="full" bg={priorityColors[option.value]} />
                            {option.label}
                          </Flex>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            )}
          />
          {errors.priority && <Text color="red.400" fontSize="xs" mt={1}>{errors.priority.message}</Text>}
        </Box>

        {/* Anexos */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">
            Anexos
            <Text as="span" color="gray.600" fontWeight="normal" ml={1}>(Imagens, PDFs — opcional)</Text>
          </Text>
          <Flex
            align="center" justify="center" p={5}
            border="1px dashed"
            borderColor={selectedFiles && selectedFiles.length > 0 ? "brand.500" : "whiteAlpha.300"}
            borderRadius="lg" bg="whiteAlpha.50"
            cursor="pointer" position="relative"
            _hover={{ borderColor: "brand.500", bg: "whiteAlpha.100" }}
            transition="all 0.2s"
          >
            <Input
              type="file"
              multiple
              accept="image/*,.pdf"
              position="absolute" top="0" left="0" w="100%" h="100%" opacity="0" cursor="pointer"
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
            <Flex direction="column" align="center" gap={2} color="gray.400">
              {selectedFiles && selectedFiles.length > 0 ? (
                <>
                  <Icon as={PiCheckCircleFill} boxSize={6} color="brand.500" />
                  <Text fontSize="sm" color="brand.400" fontWeight="medium">
                    {selectedFiles.length} ficheiro(s) selecionado(s)
                  </Text>
                </>
              ) : (
                <>
                  <Icon as={PiUploadSimpleBold} boxSize={6} />
                  <Text fontSize="sm">Clica para anexar ou arrasta os ficheiros</Text>
                  <Text fontSize="xs" color="gray.600">PNG, JPG, PDF até 10MB</Text>
                </>
              )}
            </Flex>
          </Flex>
        </Box>

        {/* Submit */}
        <Button
          type="submit"
          mt={2}
          bg="brand.500"
          color="white"
          _hover={{ bg: "brand.600" }}
          disabled={isSubmitting}
          w="100%"
          size="lg"
        >
          {isSubmitting ? <Spinner size="sm" mr={2} /> : null}
          {isSubmitting ? "A enviar..." : "Abrir Chamado"}
        </Button>

      </Flex>
    </form>
  );
}

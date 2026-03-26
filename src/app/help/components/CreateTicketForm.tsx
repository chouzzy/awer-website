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
import { PiUploadSimpleBold } from "react-icons/pi";
import { useAuth0 } from "@auth0/auth0-react";

const ticketSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  // Removemos o .default("MEDIUM") daqui
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

export function CreateTicketForm({ clientId }: { clientId: string }) {
  const { user } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);


  const priorityCollection = useMemo(
    () => createListCollection({ items: priorityOptions.items }),
    []
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "MEDIUM" }
  });

  const submitCreateTicket = async (data: TicketFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("priority", data.priority);
      formData.append("clientId", clientId);
      formData.append("auth0UserId", user?.sub || "");

      // Anexar os ficheiros selecionados
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // Chama a Server Action
      const result = await createTicket(formData);

      if (result.success) {
        reset();
        setSelectedFiles(null);
        // toaster.success({ title: "Chamado aberto com sucesso!" });
        alert("Chamado aberto com sucesso!"); // Fallback caso o toaster não esteja pronto
      } else {
        // toaster.error({ title: "Erro ao abrir chamado", description: result.error });
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitCreateTicket)}>
      <Flex direction="column" gap={4}>

        {/* Campo: Título */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Título do Chamado</Text>
          <Input
            {...register("title")}
            placeholder="Ex: Erro no Checkout"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor={errors.title ? "red.400" : "whiteAlpha.200"}
            color="white"
            _focus={{ borderColor: "brand.500" }}
          />
          {errors.title && <Text color="red.400" fontSize="xs" mt={1}>{errors.title.message}</Text>}
        </Box>

        {/* Campo: Descrição */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Descrição do erro</Text>
          <Textarea
            {...register("description")}
            placeholder="Descrição do problema"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor={errors.description ? "red.400" : "whiteAlpha.200"}
            color="white"
            rows={5}
            _focus={{ borderColor: "brand.500" }}
          />
          {errors.description && <Text color="red.400" fontSize="xs" mt={1}>{errors.description.message}</Text>}
        </Box>

        {/* Campo: Prioridade */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Prioridade</Text>

          <Controller
            control={control} // Adicione o 'control' que vem do useForm
            name="priority"
            render={({ field }) => (
              <Select.Root
                collection={priorityCollection}
                size="sm"
                name={field.name}
                value={[field.value]} // Chakra v3 usa array para valores
                onValueChange={(details) => {
                  field.onChange(details.value[0]); // Atualiza o formulário com a string ("LOW", etc)
                }}
                onInteractOutside={() => field.onBlur()}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Seleciona a prioridade" />
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
                        >
                          {option.label}
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

        {/* Campo: Anexos (DO Spaces) */}
        <Box>
          <Text mb={1} fontSize="sm" color="gray.300" fontWeight="medium">Anexos (Imagens, PDFs)</Text>
          <Flex
            align="center" justify="center" p={4}
            border="1px dashed" borderColor="whiteAlpha.300"
            borderRadius="md" bg="whiteAlpha.50"
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
              <Icon as={PiUploadSimpleBold} boxSize={6} />
              <Text fontSize="sm">
                {selectedFiles && selectedFiles.length > 0
                  ? `${selectedFiles.length} ficheiro(s) selecionado(s)`
                  : "Clica para anexar ou arrasta os ficheiros"}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Botão de Submit */}
        <Button
          type="submit"
          mt={4}
          bg="brand.500"
          color="white"
          _hover={{ bg: "#e55554" }}
          disabled={isSubmitting}
          w="100%"
        >
          {isSubmitting ? <Spinner size="sm" mr={2} /> : null}
          {isSubmitting ? "A enviar..." : "Abrir Chamado"}
        </Button>

      </Flex>
    </form>
  );
}
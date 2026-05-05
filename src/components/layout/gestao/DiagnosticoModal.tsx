'use client';

import { useState } from 'react';
import {
  Box, Button, Flex, Heading, Icon, Input, Select, Text,
  Textarea, VStack, Portal, createListCollection,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PiXBold, PiCheckCircleFill, PiWhatsappLogoBold,
  PiChartLineUpBold, PiArrowRightBold,
} from 'react-icons/pi';
import { trackEvent } from '@/lib/analytics';
import { whatsappLink } from '@/utils';

const schema = z.object({
  nome:         z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  whatsapp:     z.string().min(10, 'WhatsApp inválido'),
  email:        z.string().email('E-mail inválido'),
  tipoEmpresa:  z.enum(['MEI', 'ME', 'EPP', 'Médio porte'], { message: 'Selecione o tipo' }),
  faturamento:  z.enum(['ate10k', '10k50k', '50k200k', 'acima200k'], { message: 'Selecione o faturamento' }),
  principalDor: z.enum(['fluxo', 'lucratividade', 'precificacao', 'planejamento', 'outro'], { message: 'Selecione a dor' }),
});

type FormValues = z.infer<typeof schema>;

const tipoEmpresaCollection = createListCollection({
  items: [
    { label: 'MEI', value: 'MEI' },
    { label: 'ME — Microempresa', value: 'ME' },
    { label: 'EPP — Pequeno Porte', value: 'EPP' },
    { label: 'Médio porte', value: 'Médio porte' },
  ],
});

const faturamentoCollection = createListCollection({
  items: [
    { label: 'Até R$ 10 mil/mês', value: 'ate10k' },
    { label: 'R$ 10 mil – R$ 50 mil/mês', value: '10k50k' },
    { label: 'R$ 50 mil – R$ 200 mil/mês', value: '50k200k' },
    { label: 'Acima de R$ 200 mil/mês', value: 'acima200k' },
  ],
});

const principalDorCollection = createListCollection({
  items: [
    { label: 'Fluxo de caixa', value: 'fluxo' },
    { label: 'Lucratividade', value: 'lucratividade' },
    { label: 'Precificação', value: 'precificacao' },
    { label: 'Planejamento financeiro', value: 'planejamento' },
    { label: 'Outro', value: 'outro' },
  ],
});

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

interface DiagnosticoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticoModal({ isOpen, onClose }: DiagnosticoModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      trackEvent({ event: 'contact_form_submit', source: 'diagnostico_financeiro', tipo: data.tipoEmpresa });
      setStep('success');
    } catch {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    bg: 'whiteAlpha.100',
    border: '1px solid',
    borderColor: 'whiteAlpha.300',
    color: 'white',
    _placeholder: { color: 'gray.500' },
    _focus: { borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%', maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 1001,
              padding: '0 16px',
            }}
          >
            <Box
              bg="#0d0d0f"
              border="1px solid"
              borderColor="whiteAlpha.200"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              position="relative"
            >
              {/* Fechar */}
              <Button
                position="absolute" top={4} right={4}
                size="xs" variant="ghost" color="gray.500"
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                onClick={onClose}
              >
                <Icon as={PiXBold} />
              </Button>

              {step === 'form' ? (
                <VStack gap={5} align="stretch">
                  {/* Header */}
                  <Flex align="center" gap={3} mb={1}>
                    <Flex align="center" justify="center" w={10} h={10}
                      bg="rgba(255,95,94,0.15)" borderRadius="xl"
                    >
                      <Icon as={PiChartLineUpBold} color="brand.400" boxSize={5} />
                    </Flex>
                    <Box>
                      <Heading size="md" color="white">Diagnóstico Financeiro</Heading>
                      <Text color="gray.400" fontSize="sm">Gratuito — sem compromisso</Text>
                    </Box>
                  </Flex>

                  <Box h="1px" bg="whiteAlpha.100" />

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap={4} align="stretch">
                      {/* Nome */}
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={1} fontWeight="medium">Nome completo</Text>
                        <Input {...register('nome')} placeholder="João Silva" {...inputStyle} />
                        {errors.nome && <Text color="red.400" fontSize="xs" mt={1}>{errors.nome.message}</Text>}
                      </Box>

                      {/* WhatsApp */}
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={1} fontWeight="medium">WhatsApp</Text>
                        <Input {...register('whatsapp')} placeholder="(11) 99999-9999" {...inputStyle} />
                        {errors.whatsapp && <Text color="red.400" fontSize="xs" mt={1}>{errors.whatsapp.message}</Text>}
                      </Box>

                      {/* Email */}
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={1} fontWeight="medium">E-mail</Text>
                        <Input {...register('email')} type="email" placeholder="joao@empresa.com" {...inputStyle} />
                        {errors.email && <Text color="red.400" fontSize="xs" mt={1}>{errors.email.message}</Text>}
                      </Box>

                      {/* Tipo de empresa */}
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={1} fontWeight="medium">Tipo de empresa</Text>
                        <Controller control={control} name="tipoEmpresa" render={({ field }) => (
                          <Select.Root
                            collection={tipoEmpresaCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={e => field.onChange(e.value[0])}
                            onInteractOutside={() => field.onBlur()}
                            size="md"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger {...inputStyle}>
                                <Select.ValueText placeholder="Selecione" />
                              </Select.Trigger>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content bg="#1a1a1e" borderColor="whiteAlpha.200">
                                  {tipoEmpresaCollection.items.map(i => (
                                    <Select.Item item={i} key={i.value} color="white" _hover={{ bg: 'whiteAlpha.100' }} cursor="pointer">
                                      {i.label}<Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )} />
                        {errors.tipoEmpresa && <Text color="red.400" fontSize="xs" mt={1}>{errors.tipoEmpresa.message}</Text>}
                      </Box>

                      {/* Faturamento */}
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={1} fontWeight="medium">Faturamento médio mensal</Text>
                        <Controller control={control} name="faturamento" render={({ field }) => (
                          <Select.Root
                            collection={faturamentoCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={e => field.onChange(e.value[0])}
                            onInteractOutside={() => field.onBlur()}
                            size="md"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger {...inputStyle}>
                                <Select.ValueText placeholder="Selecione" />
                              </Select.Trigger>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content bg="#1a1a1e" borderColor="whiteAlpha.200">
                                  {faturamentoCollection.items.map(i => (
                                    <Select.Item item={i} key={i.value} color="white" _hover={{ bg: 'whiteAlpha.100' }} cursor="pointer">
                                      {i.label}<Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )} />
                        {errors.faturamento && <Text color="red.400" fontSize="xs" mt={1}>{errors.faturamento.message}</Text>}
                      </Box>

                      {/* Principal dor */}
                      <Box>
                        <Text color="gray.300" fontSize="sm" mb={1} fontWeight="medium">Principal desafio financeiro</Text>
                        <Controller control={control} name="principalDor" render={({ field }) => (
                          <Select.Root
                            collection={principalDorCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={e => field.onChange(e.value[0])}
                            onInteractOutside={() => field.onBlur()}
                            size="md"
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger {...inputStyle}>
                                <Select.ValueText placeholder="Selecione" />
                              </Select.Trigger>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content bg="#1a1a1e" borderColor="whiteAlpha.200">
                                  {principalDorCollection.items.map(i => (
                                    <Select.Item item={i} key={i.value} color="white" _hover={{ bg: 'whiteAlpha.100' }} cursor="pointer">
                                      {i.label}<Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )} />
                        {errors.principalDor && <Text color="red.400" fontSize="xs" mt={1}>{errors.principalDor.message}</Text>}
                      </Box>

                      {error && <Text color="red.400" fontSize="sm" textAlign="center">{error}</Text>}

                      <Button
                        type="submit"
                        bg="brand.500" color="white"
                        size="lg" w="100%"
                        loading={isSubmitting}
                        _hover={{ bg: 'brand.600' }}
                        mt={1}
                      >
                        {!isSubmitting && <Icon as={PiArrowRightBold} mr={2} />}
                        Quero meu diagnóstico gratuito
                      </Button>

                      <Text color="gray.600" fontSize="xs" textAlign="center">
                        Seus dados são confidenciais. Sem spam.
                      </Text>
                    </VStack>
                  </form>
                </VStack>
              ) : (
                /* Tela de sucesso */
                <VStack gap={6} align="center" py={4} textAlign="center">
                  <Flex align="center" justify="center" w={16} h={16}
                    bg="rgba(72,199,142,0.15)" borderRadius="full"
                  >
                    <Icon as={PiCheckCircleFill} color="green.400" boxSize={8} />
                  </Flex>
                  <Box>
                    <Heading size="md" color="white" mb={2}>Recebemos seu pedido!</Heading>
                    <Text color="gray.400" lineHeight="tall">
                      Nossa equipe vai analisar seu perfil e entrar em contato pelo WhatsApp em até <strong style={{ color: 'white' }}>24 horas</strong>.
                    </Text>
                  </Box>
                  <a
                    href={whatsappLink('Olá! Acabei de solicitar um diagnóstico financeiro gratuito no site da Awer.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%' }}
                    onClick={() => trackEvent({ event: 'whatsapp_click', source: 'diagnostico_sucesso' })}
                  >
                    <Button bg="whatsappColor" color="white" w="100%" _hover={{ opacity: 0.9 }}>
                      <Icon as={PiWhatsappLogoBold} mr={2} boxSize={5} />
                      Falar agora no WhatsApp
                    </Button>
                  </a>
                  <Button variant="ghost" color="gray.500" size="sm" onClick={onClose}
                    _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  >
                    Fechar
                  </Button>
                </VStack>
              )}
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

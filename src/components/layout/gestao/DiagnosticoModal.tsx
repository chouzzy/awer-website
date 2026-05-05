'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, Portal, Button, Input, Text, Box,
  Flex, Icon, VStack, HStack, Badge,
} from '@chakra-ui/react';
import {
  PiXBold, PiCheckCircleBold, PiWhatsappLogoBold,
  PiChartLineUpBold, PiArrowRightBold,
} from 'react-icons/pi';
import { trackEvent } from '@/lib/analytics';
import { whatsappLink } from '@/utils';

const schema = z.object({
  nome:     z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  email:    z.string().email('E-mail inválido'),
});

type FormValues = z.infer<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

const tipoOptions = ['MEI', 'ME', 'EPP', 'Médio porte'];
const fatOptions  = [
  { label: 'Até R$10k', value: 'ate10k' },
  { label: 'R$10k – R$50k', value: '10k50k' },
  { label: 'R$50k – R$200k', value: '50k200k' },
  { label: 'Acima de R$200k', value: 'acima200k' },
];
const dorOptions  = ['Fluxo de caixa', 'Lucratividade', 'Precificação', 'Planejamento', 'Outro'];

function OptionGroup({
  label, options, value, onChange, error,
}: {
  label: string;
  options: { label: string; value: string }[] | string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const normalized = options.map(o =>
    typeof o === 'string' ? { label: o, value: o } : o
  );

  return (
    <Box>
      <Text fontSize="sm" color="gray.400" fontWeight="medium" mb={2}>{label}</Text>
      <Flex wrap="wrap" gap={2}>
        {normalized.map(opt => {
          const selected = value === opt.value;
          return (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant="outline"
              borderColor={selected ? 'brand.500' : 'whiteAlpha.200'}
              bg={selected ? 'rgba(255,95,94,0.12)' : 'whiteAlpha.50'}
              color={selected ? 'brand.400' : 'gray.400'}
              fontWeight={selected ? 'semibold' : 'normal'}
              _hover={{ borderColor: 'brand.400', color: 'brand.300' }}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </Button>
          );
        })}
      </Flex>
      {error && <Text color="red.400" fontSize="xs" mt={1}>{error}</Text>}
    </Box>
  );
}

interface Props { isOpen: boolean; onClose: () => void; }

export function DiagnosticoModal({ isOpen, onClose }: Props) {
  const [step, setStep]               = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError]   = useState('');
  const [tipoEmpresa, setTipoEmpresa]   = useState('');
  const [faturamento, setFaturamento]   = useState('');
  const [principalDor, setPrincipalDor] = useState('');
  const [fieldErrors, setFieldErrors]   = useState<Record<string, string>>({});

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    setStep('form');
    setServerError('');
    setFieldErrors({});
    setTipoEmpresa('');
    setFaturamento('');
    setPrincipalDor('');
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    const fe: Record<string, string> = {};
    if (!tipoEmpresa)  fe.tipoEmpresa  = 'Selecione o tipo';
    if (!faturamento)  fe.faturamento  = 'Selecione o faturamento';
    if (!principalDor) fe.principalDor = 'Selecione o desafio';
    if (Object.keys(fe).length) { setFieldErrors(fe); return; }

    setIsSubmitting(true);
    setServerError('');
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tipoEmpresa, faturamento, principalDor }),
      });
      if (!res.ok) throw new Error();
      trackEvent({ event: 'contact_form_submit', source: 'diagnostico_financeiro', tipo: tipoEmpresa });
      setStep('success');
    } catch {
      setServerError('Erro ao enviar. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => { if (!e.open) handleClose(); }}
      placement="center"
      scrollBehavior="inside"
      size="md"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="#111114"
            border="1px solid"
            borderColor="whiteAlpha.150"
            borderRadius="2xl"
            maxW="500px"
            w="full"
            mx={4}
          >
            {/* Fechar */}
            <Dialog.CloseTrigger asChild>
              <Button
                size="xs"
                variant="ghost"
                color="gray.600"
                position="absolute"
                top={4}
                right={4}
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                onClick={handleClose}
              >
                <Icon as={PiXBold} />
              </Button>
            </Dialog.CloseTrigger>

            {step === 'form' ? (
              <>
                <Dialog.Header pb={0} pt={6} px={6}>
                  <Flex align="center" gap={3}>
                    <Flex
                      align="center" justify="center"
                      w="40px" h="40px" borderRadius="xl"
                      bg="rgba(255,95,94,0.15)" flexShrink={0}
                    >
                      <Icon as={PiChartLineUpBold} color="brand.400" boxSize={5} />
                    </Flex>
                    <Box>
                      <Dialog.Title color="white" fontWeight="bold" fontSize="lg">
                        Diagnóstico Financeiro
                      </Dialog.Title>
                      <Dialog.Description color="gray.500" fontSize="sm">
                        Gratuito — sem compromisso
                      </Dialog.Description>
                    </Box>
                  </Flex>
                </Dialog.Header>

                <Dialog.Body px={6} py={5}>
                  <form id="diagnostico-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <VStack gap={4} align="stretch">

                      {/* Nome */}
                      <Box>
                        <Text fontSize="sm" color="gray.400" fontWeight="medium" mb={1}>Nome completo</Text>
                        <Input
                          {...register('nome')}
                          placeholder="João Silva"
                          bg="whiteAlpha.50"
                          border="1px solid"
                          borderColor={errors.nome ? 'red.400' : 'whiteAlpha.200'}
                          color="white"
                          _placeholder={{ color: 'gray.600' }}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        {errors.nome && <Text color="red.400" fontSize="xs" mt={1}>{errors.nome.message}</Text>}
                      </Box>

                      {/* WhatsApp */}
                      <Box>
                        <Text fontSize="sm" color="gray.400" fontWeight="medium" mb={1}>WhatsApp</Text>
                        <Input
                          {...register('whatsapp')}
                          placeholder="(11) 99999-9999"
                          bg="whiteAlpha.50"
                          border="1px solid"
                          borderColor={errors.whatsapp ? 'red.400' : 'whiteAlpha.200'}
                          color="white"
                          _placeholder={{ color: 'gray.600' }}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        {errors.whatsapp && <Text color="red.400" fontSize="xs" mt={1}>{errors.whatsapp.message}</Text>}
                      </Box>

                      {/* Email */}
                      <Box>
                        <Text fontSize="sm" color="gray.400" fontWeight="medium" mb={1}>E-mail</Text>
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="joao@empresa.com"
                          bg="whiteAlpha.50"
                          border="1px solid"
                          borderColor={errors.email ? 'red.400' : 'whiteAlpha.200'}
                          color="white"
                          _placeholder={{ color: 'gray.600' }}
                          _focus={{ borderColor: 'brand.500' }}
                        />
                        {errors.email && <Text color="red.400" fontSize="xs" mt={1}>{errors.email.message}</Text>}
                      </Box>

                      {/* Tipo */}
                      <OptionGroup
                        label="Tipo de empresa"
                        options={tipoOptions}
                        value={tipoEmpresa}
                        onChange={v => { setTipoEmpresa(v); setFieldErrors(p => ({ ...p, tipoEmpresa: '' })); }}
                        error={fieldErrors.tipoEmpresa}
                      />

                      {/* Faturamento */}
                      <OptionGroup
                        label="Faturamento médio mensal"
                        options={fatOptions}
                        value={faturamento}
                        onChange={v => { setFaturamento(v); setFieldErrors(p => ({ ...p, faturamento: '' })); }}
                        error={fieldErrors.faturamento}
                      />

                      {/* Dor */}
                      <OptionGroup
                        label="Principal desafio financeiro"
                        options={dorOptions}
                        value={principalDor}
                        onChange={v => { setPrincipalDor(v); setFieldErrors(p => ({ ...p, principalDor: '' })); }}
                        error={fieldErrors.principalDor}
                      />

                      {serverError && (
                        <Text color="red.400" fontSize="sm" textAlign="center">{serverError}</Text>
                      )}
                    </VStack>
                  </form>
                </Dialog.Body>

                <Dialog.Footer px={6} pb={6} flexDirection="column" gap={2}>
                  <Button
                    type="submit"
                    form="diagnostico-form"
                    bg="brand.500"
                    color="white"
                    w="full"
                    size="lg"
                    loading={isSubmitting}
                    _hover={{ bg: 'brand.600' }}
                  >
                    <Icon as={PiArrowRightBold} mr={2} />
                    Quero meu diagnóstico gratuito
                  </Button>
                  <Text fontSize="xs" color="gray.600" textAlign="center">
                    Seus dados são confidenciais. Sem spam.
                  </Text>
                </Dialog.Footer>
              </>
            ) : (
              /* Sucesso */
              <Dialog.Body px={6} py={10}>
                <VStack gap={5} align="center" textAlign="center">
                  <Flex
                    align="center" justify="center"
                    w="64px" h="64px" borderRadius="full"
                    bg="rgba(72,199,142,0.15)"
                  >
                    <Icon as={PiCheckCircleBold} color="green.400" boxSize={8} />
                  </Flex>
                  <Box>
                    <Text color="white" fontWeight="bold" fontSize="xl" mb={2}>
                      Recebemos seu pedido!
                    </Text>
                    <Text color="gray.400" lineHeight="tall">
                      Nossa equipe vai analisar seu perfil e entrar em contato pelo WhatsApp em até{' '}
                      <Text as="span" color="white" fontWeight="semibold">24 horas</Text>.
                    </Text>
                  </Box>
                  <a
                    href={whatsappLink('Olá! Acabei de solicitar um diagnóstico financeiro gratuito no site da Awer.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%' }}
                    onClick={() => trackEvent({ event: 'whatsapp_click', source: 'diagnostico_sucesso' })}
                  >
                    <Button w="full" bg="whatsappColor" color="white" _hover={{ opacity: 0.9 }} size="lg">
                      <Icon as={PiWhatsappLogoBold} mr={2} boxSize={5} />
                      Falar agora no WhatsApp
                    </Button>
                  </a>
                  <Button variant="ghost" color="gray.500" size="sm" onClick={handleClose}
                    _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  >
                    Fechar
                  </Button>
                </VStack>
              </Dialog.Body>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

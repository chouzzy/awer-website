'use client';

import { useState, useMemo } from 'react';
import {
  Box, Button, Flex, Heading, Icon, Input, Text,
  VStack, Portal, createListCollection, Select,
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
  nome:         z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp:     z.string().min(10, 'WhatsApp inválido'),
  email:        z.string().email('E-mail inválido'),
  tipoEmpresa:  z.enum(['MEI', 'ME', 'EPP', 'Médio porte'], { message: 'Selecione o tipo' }),
  faturamento:  z.enum(['ate10k', '10k50k', '50k200k', 'acima200k'], { message: 'Selecione' }),
  principalDor: z.enum(['fluxo', 'lucratividade', 'precificacao', 'planejamento', 'outro'], { message: 'Selecione' }),
});

type FormValues = z.infer<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

// ─── Estilos inline fixos (não dependem de tokens Chakra) ─────────────────
const S = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.82)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
  } as React.CSSProperties,

  wrapper: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    zIndex: 1001,
    padding: '0 16px',
  } as React.CSSProperties,

  card: {
    background: '#111114',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '32px',
    position: 'relative' as const,
  } as React.CSSProperties,

  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
  } as React.CSSProperties,

  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
    display: 'block' as const,
    fontWeight: 500,
  } as React.CSSProperties,

  error: {
    color: '#fc8181',
    fontSize: 12,
    marginTop: 3,
  } as React.CSSProperties,

  select: {
    background: '#1e1e22',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
    colorScheme: 'dark',
  } as React.CSSProperties,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticoModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError('');
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
      setServerError('Erro ao enviar. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={S.overlay}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={S.wrapper}
          >
            <div style={S.card}>
              {/* Botão fechar */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#666', fontSize: 18, lineHeight: 1,
                }}
              >
                ✕
              </button>

              {step === 'form' ? (
                <>
                  {/* Header */}
                  <Flex align="center" gap={3} mb={6}>
                    <Flex align="center" justify="center"
                      w="40px" h="40px" borderRadius="10px"
                      style={{ background: 'rgba(255,95,94,0.15)', flexShrink: 0 }}
                    >
                      <Icon as={PiChartLineUpBold} color="brand.400" boxSize={5} />
                    </Flex>
                    <Box>
                      <Text color="white" fontWeight="bold" fontSize="lg" lineHeight={1.2}>
                        Diagnóstico Financeiro
                      </Text>
                      <Text style={{ color: '#888', fontSize: 13 }}>Gratuito — sem compromisso</Text>
                    </Box>
                  </Flex>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack gap={4} align="stretch">

                      {/* Nome */}
                      <div>
                        <label style={S.label}>Nome completo</label>
                        <input {...register('nome')} placeholder="João Silva" style={S.input} />
                        {errors.nome && <p style={S.error}>{errors.nome.message}</p>}
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label style={S.label}>WhatsApp</label>
                        <input {...register('whatsapp')} placeholder="(11) 99999-9999" style={S.input} />
                        {errors.whatsapp && <p style={S.error}>{errors.whatsapp.message}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label style={S.label}>E-mail</label>
                        <input {...register('email')} type="email" placeholder="joao@empresa.com" style={S.input} />
                        {errors.email && <p style={S.error}>{errors.email.message}</p>}
                      </div>

                      {/* Tipo de empresa */}
                      <div>
                        <label style={S.label}>Tipo de empresa</label>
                        <Controller control={control} name="tipoEmpresa" render={({ field }) => (
                          <select
                            value={field.value ?? ''}
                            onChange={e => field.onChange(e.target.value)}
                            style={{ ...S.select, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                          >
                            <option value="" disabled style={{ background: '#1a1a1e' }}>Selecione</option>
                            <option value="MEI" style={{ background: '#1a1a1e' }}>MEI</option>
                            <option value="ME" style={{ background: '#1a1a1e' }}>ME — Microempresa</option>
                            <option value="EPP" style={{ background: '#1a1a1e' }}>EPP — Pequeno Porte</option>
                            <option value="Médio porte" style={{ background: '#1a1a1e' }}>Médio porte</option>
                          </select>
                        )} />
                        {errors.tipoEmpresa && <p style={S.error}>{errors.tipoEmpresa.message}</p>}
                      </div>

                      {/* Faturamento */}
                      <div>
                        <label style={S.label}>Faturamento médio mensal</label>
                        <Controller control={control} name="faturamento" render={({ field }) => (
                          <select
                            value={field.value ?? ''}
                            onChange={e => field.onChange(e.target.value)}
                            style={{ ...S.select, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                          >
                            <option value="" disabled style={{ background: '#1a1a1e' }}>Selecione</option>
                            <option value="ate10k" style={{ background: '#1a1a1e' }}>Até R$ 10 mil/mês</option>
                            <option value="10k50k" style={{ background: '#1a1a1e' }}>R$ 10 mil – R$ 50 mil/mês</option>
                            <option value="50k200k" style={{ background: '#1a1a1e' }}>R$ 50 mil – R$ 200 mil/mês</option>
                            <option value="acima200k" style={{ background: '#1a1a1e' }}>Acima de R$ 200 mil/mês</option>
                          </select>
                        )} />
                        {errors.faturamento && <p style={S.error}>{errors.faturamento.message}</p>}
                      </div>

                      {/* Principal dor */}
                      <div>
                        <label style={S.label}>Principal desafio financeiro</label>
                        <Controller control={control} name="principalDor" render={({ field }) => (
                          <select
                            value={field.value ?? ''}
                            onChange={e => field.onChange(e.target.value)}
                            style={{ ...S.select, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                          >
                            <option value="" disabled style={{ background: '#1a1a1e' }}>Selecione</option>
                            <option value="fluxo" style={{ background: '#1a1a1e' }}>Fluxo de caixa</option>
                            <option value="lucratividade" style={{ background: '#1a1a1e' }}>Lucratividade</option>
                            <option value="precificacao" style={{ background: '#1a1a1e' }}>Precificação</option>
                            <option value="planejamento" style={{ background: '#1a1a1e' }}>Planejamento financeiro</option>
                            <option value="outro" style={{ background: '#1a1a1e' }}>Outro</option>
                          </select>
                        )} />
                        {errors.principalDor && <p style={S.error}>{errors.principalDor.message}</p>}
                      </div>

                      {serverError && (
                        <p style={{ ...S.error, textAlign: 'center', fontSize: 14 }}>{serverError}</p>
                      )}

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

                      <p style={{ color: '#555', fontSize: 12, textAlign: 'center', margin: 0 }}>
                        Seus dados são confidenciais. Sem spam.
                      </p>
                    </VStack>
                  </form>
                </>
              ) : (
                /* Sucesso */
                <VStack gap={6} align="center" py={4} textAlign="center">
                  <Flex align="center" justify="center" w="64px" h="64px" borderRadius="full"
                    style={{ background: 'rgba(72,199,142,0.15)' }}
                  >
                    <Icon as={PiCheckCircleFill} color="green.400" boxSize={8} />
                  </Flex>
                  <Box>
                    <Text color="white" fontWeight="bold" fontSize="lg" mb={2}>Recebemos seu pedido!</Text>
                    <Text style={{ color: '#999', lineHeight: 1.6, fontSize: 14 }}>
                      Nossa equipe vai analisar seu perfil e entrar em contato pelo WhatsApp em até{' '}
                      <strong style={{ color: 'white' }}>24 horas</strong>.
                    </Text>
                  </Box>
                  <a
                    href={whatsappLink('Olá! Acabei de solicitar um diagnóstico financeiro gratuito no site da Awer.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%' }}
                    onClick={() => trackEvent({ event: 'whatsapp_click', source: 'diagnostico_sucesso' })}
                  >
                    <Button style={{ background: '#25D366', color: '#fff', width: '100%' }}
                      _hover={{ opacity: 0.9 }}
                    >
                      <Icon as={PiWhatsappLogoBold} mr={2} boxSize={5} />
                      Falar agora no WhatsApp
                    </Button>
                  </a>
                  <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 13 }}
                  >
                    Fechar
                  </button>
                </VStack>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

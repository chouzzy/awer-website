'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trackEvent } from '@/lib/analytics';
import { whatsappLink } from '@/utils';

const schema = z.object({
  nome:         z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp:     z.string().min(10, 'WhatsApp inválido'),
  email:        z.string().email('E-mail inválido'),
  tipoEmpresa:  z.string().min(1, 'Selecione o tipo'),
  faturamento:  z.string().min(1, 'Selecione o faturamento'),
  principalDor: z.string().min(1, 'Selecione o desafio'),
});

type FormValues = z.infer<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

const tipoOptions   = ['MEI', 'ME', 'EPP', 'Médio porte'];
const fatOptions    = ['Até R$10k', 'R$10k–50k', 'R$50k–200k', 'Acima R$200k'];
const dorOptions    = ['Fluxo de caixa', 'Lucratividade', 'Precificação', 'Planejamento', 'Outro'];

function OptionGroup({
  options, value, onChange, error,
}: { options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${selected ? '#FF5F5E' : 'rgba(255,255,255,0.15)'}`,
                background: selected ? 'rgba(255,95,94,0.15)' : 'rgba(255,255,255,0.04)',
                color: selected ? '#FF5F5E' : '#aaa',
                fontSize: 13,
                fontWeight: selected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && <p style={{ color: '#fc8181', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

interface Props { isOpen: boolean; onClose: () => void; }

export function DiagnosticoModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [tipoEmpresa, setTipoEmpresa]   = useState('');
  const [faturamento, setFaturamento]   = useState('');
  const [principalDor, setPrincipalDor] = useState('');

  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    // validação manual dos grupos de opção
    let hasError = false;
    if (!tipoEmpresa)  { setError('tipoEmpresa',  { message: 'Selecione o tipo' });   hasError = true; }
    if (!faturamento)  { setError('faturamento',  { message: 'Selecione o faturamento' }); hasError = true; }
    if (!principalDor) { setError('principalDor', { message: 'Selecione o desafio' }); hasError = true; }
    if (hasError) return;

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
      setServerError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14,
    background: '#1a1a1e', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  const lbl: React.CSSProperties = {
    display: 'block', color: '#999', fontSize: 13, marginBottom: 6, fontWeight: 500,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%', maxWidth: 520,
              maxHeight: '90vh', overflowY: 'auto',
              zIndex: 1001, padding: '0 16px',
            }}
          >
            <div style={{
              background: '#111114',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '28px 28px 24px',
              position: 'relative',
            }}>
              {/* Fechar */}
              <button onClick={onClose} style={{
                position: 'absolute', top: 14, right: 14,
                background: 'none', border: 'none', color: '#555',
                fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 4,
              }}>✕</button>

              {step === 'form' ? (
                <>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,95,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                      📊
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>Diagnóstico Financeiro</div>
                      <div style={{ color: '#777', fontSize: 13 }}>Gratuito — sem compromisso</div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                      {/* Nome */}
                      <div>
                        <label style={lbl}>Nome completo</label>
                        <input {...register('nome')} placeholder="João Silva" style={inp} />
                        {errors.nome && <p style={{ color: '#fc8181', fontSize: 12, marginTop: 4 }}>{errors.nome.message}</p>}
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label style={lbl}>WhatsApp</label>
                        <input {...register('whatsapp')} placeholder="(11) 99999-9999" style={inp} />
                        {errors.whatsapp && <p style={{ color: '#fc8181', fontSize: 12, marginTop: 4 }}>{errors.whatsapp.message}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label style={lbl}>E-mail</label>
                        <input {...register('email')} type="email" placeholder="joao@empresa.com" style={inp} />
                        {errors.email && <p style={{ color: '#fc8181', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
                      </div>

                      {/* Tipo de empresa */}
                      <div>
                        <label style={lbl}>Tipo de empresa</label>
                        <OptionGroup
                          options={tipoOptions}
                          value={tipoEmpresa}
                          onChange={v => { setTipoEmpresa(v); clearErrors('tipoEmpresa'); }}
                          error={errors.tipoEmpresa?.message}
                        />
                      </div>

                      {/* Faturamento */}
                      <div>
                        <label style={lbl}>Faturamento médio mensal</label>
                        <OptionGroup
                          options={fatOptions}
                          value={faturamento}
                          onChange={v => { setFaturamento(v); clearErrors('faturamento'); }}
                          error={errors.faturamento?.message}
                        />
                      </div>

                      {/* Principal dor */}
                      <div>
                        <label style={lbl}>Principal desafio financeiro</label>
                        <OptionGroup
                          options={dorOptions}
                          value={principalDor}
                          onChange={v => { setPrincipalDor(v); clearErrors('principalDor'); }}
                          error={errors.principalDor?.message}
                        />
                      </div>

                      {serverError && <p style={{ color: '#fc8181', fontSize: 13, textAlign: 'center' }}>{serverError}</p>}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          width: '100%', padding: '13px', borderRadius: 10,
                          background: isSubmitting ? '#b34443' : '#FF5F5E',
                          color: '#fff', fontWeight: 700, fontSize: 15,
                          border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          marginTop: 4, transition: 'background 0.2s',
                        }}
                      >
                        {isSubmitting ? 'Enviando...' : '→ Quero meu diagnóstico gratuito'}
                      </button>

                      <p style={{ color: '#444', fontSize: 12, textAlign: 'center', margin: 0 }}>
                        Seus dados são confidenciais. Sem spam.
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                /* Sucesso */
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                    Recebemos seu pedido!
                  </div>
                  <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                    Nossa equipe vai analisar seu perfil e entrar em contato pelo WhatsApp em até <strong style={{ color: '#fff' }}>24 horas</strong>.
                  </p>
                  <a
                    href={whatsappLink('Olá! Acabei de solicitar um diagnóstico financeiro gratuito no site da Awer.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent({ event: 'whatsapp_click', source: 'diagnostico_sucesso' })}
                    style={{
                      display: 'block', width: '100%', padding: '13px',
                      background: '#25D366', color: '#fff', borderRadius: 10,
                      fontWeight: 700, fontSize: 15, textDecoration: 'none',
                      textAlign: 'center', marginBottom: 12,
                    }}
                  >
                    💬 Falar agora no WhatsApp
                  </a>
                  <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13 }}
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

type Status = 'redirecting' | 'success' | 'error';

export default function BotrtCallbackPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<Status>('redirecting');
    const [errorMsg, setErrorMsg] = useState('');
    const [dots, setDots] = useState('');

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    const deeplink = code
        ? `botrt://callback?code=${encodeURIComponent(code)}${state ? `&state=${encodeURIComponent(state)}` : ''}`
        : null;

    // Animated dots for loading state
    useEffect(() => {
        if (status !== 'redirecting') return;
        const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        if (error) {
            setErrorMsg(errorDescription || error);
            setStatus('error');
            return;
        }
        if (!deeplink) {
            setErrorMsg('Parâmetros de autenticação ausentes.');
            setStatus('error');
            return;
        }

        window.location.href = deeplink;
        const t = setTimeout(() => setStatus('success'), 1200);
        return () => clearTimeout(t);
    }, [deeplink, error, errorDescription]);

    return (
        <>
            <style>{`
                @keyframes checkDraw {
                    from { stroke-dashoffset: 60; opacity: 0; }
                    to   { stroke-dashoffset: 0;  opacity: 1; }
                }
                @keyframes ringExpand {
                    0%   { transform: scale(0.6); opacity: 0; }
                    60%  { transform: scale(1.08); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50%       { opacity: 1; }
                }
                .ring { animation: ringExpand 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .check { animation: checkDraw 0.4s ease forwards 0.35s; stroke-dasharray: 60; stroke-dashoffset: 60; opacity: 0; }
                .fade-up { animation: fadeUp 0.5s ease forwards 0.6s; opacity: 0; }
                .fade-up-delay { animation: fadeUp 0.5s ease forwards 0.85s; opacity: 0; }
                .spinner-dot {
                    display: inline-block;
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: #ef4444;
                    animation: pulse 1.2s ease-in-out infinite;
                }
                .spinner-dot:nth-child(2) { animation-delay: 0.2s; }
                .spinner-dot:nth-child(3) { animation-delay: 0.4s; }
            `}</style>

            {/* Full-screen overlay covering navbar/footer */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#000',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#fff',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: 48, opacity: 0.9 }}>
                    <Image
                        src="/botrt/logo-white.svg"
                        alt="BoTRT"
                        width={120}
                        height={40}
                        style={{ objectFit: 'contain' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                </div>

                {/* Redirecting state */}
                {status === 'redirecting' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span className="spinner-dot" />
                            <span className="spinner-dot" />
                            <span className="spinner-dot" />
                        </div>
                        <p style={{ fontSize: 16, color: '#a1a1aa', margin: 0 }}>
                            Abrindo o BoTRT{dots}
                        </p>
                    </div>
                )}

                {/* Success state */}
                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', maxWidth: 360 }}>
                        {/* Animated checkmark */}
                        <div className="ring" style={{ width: 88, height: 88 }}>
                            <svg viewBox="0 0 88 88" width="88" height="88" fill="none">
                                <circle cx="44" cy="44" r="40" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="2" />
                                <polyline
                                    className="check"
                                    points="26,44 38,56 62,32"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
                                Login realizado!
                            </h1>
                            <p style={{ margin: 0, fontSize: 15, color: '#71717a', lineHeight: 1.5 }}>
                                Você pode fechar esta aba e voltar para o BoTRT.
                            </p>
                        </div>

                        <div className="fade-up-delay">
                            <button
                                onClick={() => { if (deeplink) window.location.href = deeplink; }}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: '#52525b', fontSize: 13, cursor: 'pointer',
                                    textDecoration: 'underline', textDecorationColor: '#3f3f46',
                                    padding: '4px 0',
                                }}
                            >
                                O app não abriu automaticamente? Clique aqui
                            </button>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center', maxWidth: 360 }}>
                        <div style={{ width: 88, height: 88 }}>
                            <svg viewBox="0 0 88 88" width="88" height="88" fill="none">
                                <circle cx="44" cy="44" r="40" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="2" />
                                <line x1="30" y1="30" x2="58" y2="58" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                                <line x1="58" y1="30" x2="30" y2="58" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                            </svg>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#ef4444' }}>
                                Falha na autenticação
                            </h1>
                            <p style={{ margin: 0, fontSize: 14, color: '#71717a', lineHeight: 1.5 }}>
                                {errorMsg || 'Ocorreu um erro inesperado. Tente novamente pelo app.'}
                            </p>
                        </div>

                        <button
                            onClick={() => window.close()}
                            style={{
                                background: 'transparent', border: '1px solid #27272a',
                                color: '#71717a', fontSize: 13, cursor: 'pointer',
                                borderRadius: 8, padding: '8px 20px',
                            }}
                        >
                            Fechar esta aba
                        </button>
                    </div>
                )}

                {/* Bottom credit */}
                <div style={{ position: 'absolute', bottom: 32, fontSize: 12, color: '#3f3f46', letterSpacing: '0.05em' }}>
                    BoTRT · Awer Consultoria
                </div>
            </div>
        </>
    );
}

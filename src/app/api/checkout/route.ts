// src/app/api/checkout/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa o cliente do Stripe com a sua chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-08-27.basil',
});

/**
 * @handler POST /api/checkout
 * @description Cria uma nova sessão de checkout do Stripe para uma assinatura.
 */
export async function POST(request: Request) {
    try {
        // Extrai os dados enviados pelo frontend
        const { priceId, auth0UserId } = await request.json();

        // Validação básica dos dados recebidos
        if (!priceId || !auth0UserId) {
            return NextResponse.json(
                { error: 'ID do Plano e ID do Usuário são obrigatórios.' },
                { status: 400 }
            );
        }

        // Define as URLs de sucesso e cancelamento
        const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/sucesso`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/tecnologia/botrt`;

        // Cria a sessão de checkout no Stripe
        const trialDays = parseInt(process.env.NEXT_PUBLIC_TRIAL_DAYS || '0', 10);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: auth0UserId,
            subscription_data: {
                trial_period_days: trialDays,
                // É uma boa prática também salvar o ID do seu sistema nos metadados da assinatura
                metadata: {
                    auth0UserId: auth0UserId,
                }
            },

            // ====================================================================
            // ✨ ALTERAÇÕES ADICIONADAS AQUI ✨
            // ====================================================================

            // 1. Coleta de endereço (Recomendado para notas fiscais e validação)
            billing_address_collection: 'required',

            // 2. Habilita a coleta de ID Fiscal (CPF ou CNPJ)
            tax_id_collection: {
                enabled: true,
            },

            // 3. Adiciona campos personalizados para outras informações
            custom_fields: [
                {
                    key: 'razao_social',
                    label: {
                        type: 'custom',
                        custom: 'Razão Social',
                    },
                    type: 'text',
                },
                {
                    key: 'inscricao_estadual',
                    label: {
                        type: 'custom',
                        custom: 'Inscrição Estadual (Opcional)',
                    },
                    type: 'text',
                    optional: true, // Define que este campo não é obrigatório
                },
            ],

            // ====================================================================
            // ✨ FIM DAS ALTERAÇÕES ✨
            // ====================================================================
        });

        // Retorna a URL da sessão de checkout para o frontend
        if (session.url) {
            return NextResponse.json({ url: session.url }, { status: 200 });
        } else {
            throw new Error('Não foi possível criar a URL de checkout.');
        }

    } catch (err: any) {
        console.error("❌ Erro ao criar a sessão de checkout:", err);
        return NextResponse.json(
            { error: `Erro interno do servidor: ${err.message}` },
            { status: 500 }
        );
    }
}

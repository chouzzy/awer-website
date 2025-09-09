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
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // O ID do preço do plano (ex: price_xxxxxx)
                    quantity: 1,
                },
            ],
            mode: 'subscription', // Define que estamos criando uma assinatura
            success_url: successUrl,
            cancel_url: cancelUrl,
            
            // A PEÇA CHAVE: Anexa o ID do nosso usuário à sessão.
            // O backend usará este ID para saber para quem é a assinatura.
            client_reference_id: auth0UserId,
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

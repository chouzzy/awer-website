import { GestaoPageData } from "@/types";
import { whatsappLink } from "@/utils";

const pageData: GestaoPageData = {
    hero: {
        title: "Consultoria Especializada em Reestruturação Financeira para Pequenas e Médias Empresas",
        subtitle: "Entregamos clareza nos seus resultados e apontamos o que falta para sua empresa lucrar o que merece.",
        ctaButton: "QUERO UM DIAGNÓSTICO FINANCEIRO GRÁTIS",
    },
    // A MUDANÇA: Novos dados para as seções de serviço
    services: [
        {
            tagLabel: 'Fluxo de Caixa', // Categoria
            tagLabelColor: 'brand.500', // Categoria
            link:whatsappLink(),
            product: "Gestão de Fluxo de Caixa",
            description: "Monitore Entradas e Saídas, Otimize o Capital de Giro e Garanta a Saúde Financeira da Sua Empresa com Nosso Sistema de Gestão de Fluxo de Caixa.",
            image: "/gestao/fluxo-de-caixa.jpg",
            orientation: "image-right" // texto na direita, imagem na esquerda
        },
        {
            tagLabel: 'Estoque e Compras', // Categoria
            tagLabelColor: 'yellow.600', // Categoria
            link:whatsappLink(),
            product: "Gestão Inteligente de Estoque e Compras",
            description: "Controle Seu Estoque de Forma Eficiente, Evitando Perdas e Otimizando o Armazenamento. Gerencie Suas Compras de Forma Estratégica para Não Deixar o Seu Dinheiro Parado",
            image: "/gestao/estoque-2.png",
            orientation: "image-left" // texto na esquerda, imagem na direita
        },
        {
            tagLabel: 'Gestão à Vista', // Categoria
            tagLabelColor: 'cadetBlue', // Categoria
            link:whatsappLink(),
            product: "Painel de Resultados",
            description: "Acompanhe Seus Principais Indicadores de Desempenho em Tempo Real e Tome Decisões Mais Assertivas. Visualize Seus Resultados de Forma Clara e Objetiva.",
            image: "/gestao/dashboard.jpg",
            orientation: "image-right"
        },
        {
            tagLabel: 'Preço e Margens', // Categoria
            tagLabelColor: 'blue.600', // Categoria
            link:whatsappLink(),
            product: "Definição de Preços e Margens de Produtos",
            description: "Defina Preços e Margens de Lucro de Forma Estratégica, Garantindo que Seu Negócio Seja Rentável. Valorize Seus Seus Produtos e Otimize Seus Ganhos.",
            image: "/gestao/compras.jpg",
            orientation: "image-left"
        }
    ]
};


export {pageData}
// src/data/games.ts
// Jogos da Awer exibidos em /games. Para trocar o link de um jogo, edite apenas `url`.

export interface GameFeature {
    label: string;
}

export interface Game {
    slug: string;
    title: string;
    tag: string;
    badge: string;
    description: string;
    url: string;
    image: string;
    imageAlt: string;
    features: GameFeature[];
    featureStyle: 'list' | 'meters';
    theme: {
        stage: string;      // cor do painel com o celular
        stagePattern: string;
        card: string;       // fundo do texto
        title: string;
        tagBg: string;
        tagColor: string;
        button: string;
        buttonText: string;
        frame: string;
        badgeBg: string;
        badgeColor: string;
        muted: string;
        tilt: string;
    };
}

export const games: Game[] = [
    {
        slug: 'jogo-da-eleicao',
        title: 'Jogo da Eleição',
        tag: 'Simulador de campanha',
        badge: 'Plantão',
        description:
            'Você é um candidato desconhecido a presidente, com intenção de voto perto de zero. Tem 11 semanas, um orçamento e seis adversários para virar o jogo.',
        url: 'https://eleicao.awer.co/',
        image: '/games/jogo-da-eleicao.webp',
        imageAlt: 'Tela do Jogo da Eleição com a primeira pesquisa de intenção de voto',
        features: [
            { label: 'Escolha a dificuldade: Favorito, Equilibrada ou Azarão' },
            { label: 'Cada eleição é sorteada: candidatos e cenário mudam' },
            { label: 'Candidatos fictícios, nenhum político real' },
        ],
        featureStyle: 'list',
        theme: {
            stage: '#D62828',
            stagePattern: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.10) 0 14px, transparent 14px 28px)',
            card: '#121A2E',
            title: '#FFFFFF',
            tagBg: '#FFD166',
            tagColor: '#14110A',
            button: '#D62828',
            buttonText: '#FFFFFF',
            frame: '#0A0D18',
            badgeBg: '#0A0D18',
            badgeColor: '#FFFFFF',
            muted: '#C3C9DB',
            tilt: '-4deg',
        },
    },
    {
        slug: 'sobe-ou-some',
        title: 'Sobe ou Some',
        tag: 'Carreira em tech · cartas',
        badge: 'Estagiário → CTO',
        description:
            'Você é dev estagiário. Cada carta é um dilema do dia a dia em tech. Chegue a CTO sem deixar nenhum medidor zerar ou estourar.',
        url: 'https://sobe-ou-some.vercel.app/',
        image: '/games/sobe-ou-some.webp',
        imageAlt: 'Tela do Sobe ou Some com os quatro medidores e uma carta de decisão',
        features: [
            { label: 'Energia' },
            { label: 'Reputação' },
            { label: 'Dinheiro' },
            { label: 'Conhecimento' },
        ],
        featureStyle: 'meters',
        theme: {
            stage: '#FFD166',
            stagePattern: 'radial-gradient(rgba(30,29,47,0.14) 2px, transparent 2px)',
            card: '#1E1D2F',
            title: '#FFD166',
            tagBg: '#2B2A44',
            tagColor: '#FFD166',
            button: '#FFD166',
            buttonText: '#1E1D2F',
            frame: '#1E1D2F',
            badgeBg: '#1E1D2F',
            badgeColor: '#FFD166',
            muted: '#C9C8DD',
            tilt: '4deg',
        },
    },
];

// src/components/layout/ProductCarousel.tsx
'use client';

// ============================================================================
//   IMPORTS
// ============================================================================

// --- React e Frameworks ---
import { Link, useBreakpointValue } from "@chakra-ui/react";
import { motion, Variants } from 'framer-motion';

// --- Componentes Chakra UI ---
import { Flex, IconButton, Image, Text } from "@chakra-ui/react";

// --- Swiper (Carrossel) ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Ícones ---
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

// --- Componentes e Dados Locais ---
import { CustomText } from "@/components/ui/CustomText";
import { GetStartedMotionButton } from "@/components/ui/MotionButton";
import { awerServices, Service } from "@/data/services";
import { productCarouselData } from "@/data/productCarousel";
import { trackEvent } from "@/lib/analytics";

// ============================================================================
//   VARIANTES DE ANIMAÇÃO (Framer Motion)
// ============================================================================
// Definidas fora dos componentes para melhor performance, evitando recriação a cada render.

const carouselContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut",
            delay: 0.2,
        }
    }
};

const slideContentVariants: Variants = {
    hidden: { opacity: 0, x: 120 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 1, ease: "easeOut" }
    }
};

const slideTextContainerVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            ease: "easeInOut",
            delay: 0.2,
        }
    }
};


// ============================================================================
//   COMPONENTE PARA UM SLIDE INDIVIDUAL
// ============================================================================
interface ServiceSlideProps {
    service: Service;
}

function ServiceSlide({ service }: ServiceSlideProps) {

    // --- Hooks e Constantes ---
    const MotionFlex = motion(Flex);
    const isMobile = useBreakpointValue({ base: true, md: false });

    // --- Renderização do Componente ---
    return (
        <Flex
            w='100%'
            h='100%'
            overflow="hidden"
        >
            <Flex
                // Layout principal do slide
                w='100%'
                maxH={{ base: '100%', md: 400 }}
                flexDir={{ base: 'column-reverse', md: 'row' }}
                alignItems="center"
                justify="space-between"
                gap={{ base: 4, md: 12 }}
                pl={{ base: 0, md: 10, lg: 16 }}
            >
                {/* Bloco de Conteúdo Esquerdo (Texto e Botões) */}
                <MotionFlex
                    // Animação para o container do conteúdo
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={slideContentVariants}
                    // Estilização do container
                    style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'grab' }}
                    alignItems={'stretch'}
                >
                    <MotionFlex
                        // Animação para o container do texto
                        initial='hidden'
                        whileInView='visible'
                        variants={slideTextContainerVariants}
                        // Layout do container do texto
                        flexDir={'column'}
                        justifyContent={'space-between'}
                        p={{ base: 8, md: '' }}
                        gap={12}
                    >
                        <Flex flexDir={'column'} justifyContent={'space-between'} gap={{ base: 4, md: 6 }} my='auto'>
                            {/* Título e Subtítulo */}
                            <Flex flexDir={'column'} gap={{ base: 4, md: 2 }} textAlign={{ base: 'center', md: 'left' }} >
                                <CustomText
                                    as={'h2'}
                                    text={service.title}
                                    fontSize={{ base: '2xl', md: '3xl', lg: '5xl' }}
                                    color={'textPrimary'}
                                    fontWeight="bold"
                                    lineHeight={1.2}
                                />
                                {service.subtitle && (
                                    <CustomText
                                        as={'h3'}
                                        text={service.subtitle}
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        color="textSecondary"
                                        mb={{ base: 4, md: 6 }}
                                    />
                                )}
                            </Flex>

                            {/* Botão "Saiba Mais" (visível apenas em desktop neste bloco) */}
                            {!isMobile ? (
                                <Link href={service.link} onClick={() => trackEvent({ event: 'service_click', service_id: service.id, service_title: service.title, source: 'product_carousel_desktop' })}>
                                    <Flex width="full" justifyContent={{ base: 'center', md: 'flex-start' }}>
                                        <GetStartedMotionButton
                                            text={productCarouselData.saibaMaisButtonText}
                                        />
                                    </Flex>
                                </Link>
                            ) : null}
                        </Flex>

                        {/* Controles de Navegação (Setas e Botão Mobile) */}
                        <Flex w={{ base: '100%' }} justifyContent={{ base: 'space-between', md: 'initial' }}>
                            <IconButton
                                className="swiper-button-prev-custom"
                                aria-label="Slide anterior"
                                variant={'ghost'}
                                _hover={{ bg: 'transparent', color: 'brand.500' }}
                            >
                                <PiCaretLeft />
                            </IconButton>

                            {/* Botão "Saiba Mais" (visível apenas em mobile neste bloco) */}
                            {isMobile ? (
                                <Link href={service.link} onClick={() => trackEvent({ event: 'service_click', service_id: service.id, service_title: service.title, source: 'product_carousel_mobile' })}>
                                    <Flex width="full" justifyContent={{ base: 'center', md: 'flex-start' }}>
                                        <GetStartedMotionButton
                                            text={productCarouselData.saibaMaisButtonText}
                                        />
                                    </Flex>
                                </Link>
                            ) : ''}

                            <IconButton
                                className="swiper-button-next-custom"
                                aria-label="Próximo slide"
                                variant={'ghost'}
                                _hover={{ bg: 'transparent', color: 'brand.500' }}
                            >
                                <PiCaretRight />
                            </IconButton>
                        </Flex>
                    </MotionFlex>
                </MotionFlex>

                {/* Bloco de Imagem Direito */}
                <MotionFlex
                    // Animação da imagem
                    initial="hidden"
                    whileInView="visible"
                    variants={slideContentVariants}
                    // Layout do container da imagem
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
                >
                    <Image
                        w='100%'
                        h='100%'
                        maxH={{ base: 64, md: '100%' }}
                        src={service.image ? `/showcase/${service.image}` : `https://placehold.co/400x300/FF5F5E/FFFFFF?text=${encodeURIComponent(service.title)}`}
                        alt={`Ilustração para ${service.title}`}
                        objectFit="cover"
                        objectPosition={'center'}
                    />
                </MotionFlex>
            </Flex>
        </Flex>
    );
}


// ============================================================================
//   COMPONENTE PRINCIPAL DO CARROSSEL
// ============================================================================
export function ProductCarousel() {

    const FlexMotion = motion(Flex);
    const slidesPerView = 1;

    return (
        <FlexMotion
            // Animação do container geral
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={carouselContainerVariants}
            // Estilização do container geral
            w='100%'
            bg="gunMetal"
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Flex
                flexDir={'row'}
                w='100%'
                borderRadius={64}
                bgColor={'transparent'}
            >
                <Swiper
                    // Módulos do Swiper para funcionalidade
                    modules={[Navigation, A11y, Autoplay]}

                    // Configurações do Carrossel
                    spaceBetween={30}
                    slidesPerView={slidesPerView}
                    loop={true}

                    // Navegação customizada via classes CSS
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}

                    // Paginação (não visível, mas pode ser ativada)
                    pagination={{ clickable: true, dynamicBullets: true }}

                    // Autoplay
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                >
                    {/* Mapeia os dados para criar um slide para cada serviço */}
                    {awerServices.map((service, idx) => (
                        <SwiperSlide key={service.id || idx}>
                            <ServiceSlide service={service} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Flex>
        </FlexMotion>
    );
}

import { Flex, Link, Text } from "@chakra-ui/react";
import { BsWhatsapp } from "react-icons/bs";
import { RiWhatsappFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { whatsappLink } from "@/utils";
import { pageData } from "@/data/gestao";
import { track } from '@vercel/analytics';

const handleWhatsAppClick = () => {
    // Dispara o evento customizado na Vercel
    track('Click_WhatsApp', {
        local: 'Hero_Section',
        texto_botao: pageData.hero.ctaButton
    });

    // Abre o link do WhatsApp
    window.open(whatsappLink(), '_blank');
};

export default function WhatsButton() {
    
    return (
        <Link className="zap-tag" target={'_blank'} onClick={handleWhatsAppClick}>
        
        <Flex zIndex={1} bg='#25D366' color="#fffafa"
        fontSize='1.8rem' borderRadius={'full'} p={4} 
        position='fixed'bottom={8} right={8}
        _hover={{ transition:' 400ms', fontSize:'2.4rem'}}
        cursor='pointer'>
            <BsWhatsapp/>
        </Flex>
        </Link>
    )
}

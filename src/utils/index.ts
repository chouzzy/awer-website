// ============================================================================
//   INFORMAÇÕES DE CONTATO E LINKS EXTERNOS
// ============================================================================
// Este bloco centraliza todas as informações de contato e links estáticos
// da empresa, facilitando a manutenção e garantindo consistência.

const whatsappNumber = 5511939437893;
const email = `danilo@awer.co`;
const instagram = `https://www.instagram.com/awer.consultoria/`;
const linkedin = `https://br.linkedin.com/company/awer-assessoria-de-gest%C3%A3o-e-solu%C3%A7%C3%B5es-tecnol%C3%B3gicas`;
const mapsLink = "https://www.google.com/maps/place/Av.+Prof.+Othon+Gama+D'E%C3%A7a,+677+-+Centro,+Florian%C3%B3polis+-+SC,+88015-240/@-27.589685,-48.5521411,986m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95273818ef44cf45:0x820c90460fe96ac6!8m2!3d-27.589685!4d-48.5521411!16s%2Fg%2F11c51w2ntx?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D";

// ============================================================================
//   FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Converte uma string em um "slug" amigável para URLs.
 * Remove acentos, espaços e caracteres especiais, transformando tudo em minúsculas.
 * Exemplo: "Soluções de Tecnologia" -> "solucoes-de-tecnologia"
 * @param {string} text - O texto a ser convertido.
 * @returns {string} O texto formatado como slug.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")               // Separa letras e acentos (ex: "á" -> "a" + "´")
        .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
        .replace(/\s+/g, '-')           // Substitui espaços por hífens
        .replace(/[^\w\-]+/g, '')        // Remove todos os caracteres não-alfanuméricos, exceto hífens
        .replace(/\-\-+/g, '-')          // Substitui múltiplos hífens por um único
        .replace(/^-+/, '')             // Remove hífens do início do texto
        .replace(/-+$/, '');            // Remove hífens do final do texto
}

/**
 * Rola a página suavemente até um elemento com o ID especificado.
 * @param {string} id - O ID do elemento para o qual rolar.
 */
const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
        // Se o elemento for encontrado, rola até ele com uma animação suave
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Alerta no console se o elemento não for encontrado, para ajudar na depuração
        console.warn(`Elemento com ID "${id}" não encontrado.`);
    }
};

// ============================================================================
//   FUNÇÕES GERADORAS DE LINKS
// ============================================================================
// Funções que constroem URLs dinâmicas para evitar repetição de código.

/**
 * Gera um link para o WhatsApp com uma mensagem padrão pré-preenchida.
 * @returns {string} A URL completa para o WhatsApp.
 */
const whatsappLink = (message?: string): string => {
    const defaultMessage = "Olá! Acessei o site da Awer e gostaria de mais informações";
    const text = message ?? defaultMessage;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
};

/**
 * Retorna o link do perfil do Instagram.
 * @returns {string} A URL do Instagram.
 */
const instagramLink = (): string => {
    return instagram;
};

/**
 * Retorna o link da página do LinkedIn.
 * @returns {string} A URL do LinkedIn.
 */
const linkedinLink = (): string => {
    return linkedin;
};

/**
 * Gera um link "mailto:" para abrir o cliente de e-mail padrão do usuário.
 * @returns {string} O link mailto.
 */
const mailLink = (): string => {
    return `mailto:${email}`;
};

// ============================================================================
//   OBJETOS DE DADOS PARA UI
// ============================================================================
// Centraliza textos e rótulos usados na interface para facilitar traduções ou alterações.

const footerSectionsLabel = {
    consultoria: 'Consultoria',
    tecnologia: 'Tecnologia',
    empresa: 'Awer'
};

// ============================================================================
//   EXPORTS
// ============================================================================
// Exporta todas as constantes e funções que serão usadas em outras partes da aplicação.

export {
    scrollToSection,
    whatsappLink,
    whatsappNumber,
    mapsLink,
    instagramLink,
    mailLink,
    footerSectionsLabel,
    linkedinLink
};

// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Aplica a regra para todos os robôs
      allow: '/',      // Permite que eles acessem todas as páginas
      // disallow: '/admin/', // Exemplo: Se tivéssemos uma área privada
    },
    sitemap: 'https://www.awer.co/sitemap.xml', // Aponta para o nosso sitemap
  }
}
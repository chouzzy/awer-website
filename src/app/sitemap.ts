import { MetadataRoute } from "next";

const base = "https://www.awer.co";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Prioridade máxima ─────────────────────────────────────────────
    { url: `${base}/`,                                   priority: 1.0,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/tecnologia/botrt`,                   priority: 0.95, changeFrequency: "monthly",  lastModified: new Date() },

    // ── Hubs principais ───────────────────────────────────────────────
    { url: `${base}/consultoria`,                        priority: 0.9,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/tecnologia`,                         priority: 0.9,  changeFrequency: "monthly",  lastModified: new Date() },

    // ── Serviços de Tecnologia ────────────────────────────────────────
    { url: `${base}/tecnologia/ai`,                      priority: 0.85, changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/tecnologia/aplicativos-web`,         priority: 0.85, changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/tecnologia/ecommerce`,               priority: 0.85, changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/tecnologia/crawlers`,                priority: 0.85, changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/tecnologia/landing-pages`,           priority: 0.85, changeFrequency: "monthly",  lastModified: new Date() },

    // ── Gestão / Consultoria ──────────────────────────────────────────
    { url: `${base}/gestao/gestao-estrategia`,           priority: 0.8,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/gestao/comercial-vendas`,            priority: 0.8,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/gestao/prospeccao`,                  priority: 0.8,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/gestao/acompanhamento-desempenho`,   priority: 0.8,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/gestao/gestao-financeira`,           priority: 0.8,  changeFrequency: "monthly",  lastModified: new Date() },
    { url: `${base}/gestao/apoio-operacional`,           priority: 0.8,  changeFrequency: "monthly",  lastModified: new Date() },

    // ── Institucional ─────────────────────────────────────────────────
    { url: `${base}/nossa-historia`,                     priority: 0.6,  changeFrequency: "yearly",   lastModified: new Date() },
    { url: `${base}/politica-de-privacidade`,            priority: 0.2,  changeFrequency: "yearly",   lastModified: new Date() },
  ];
}

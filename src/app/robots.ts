import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/minha-conta",
          "/help",
          "/help/",
          "/awer-admin/",
          "/pagamento/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.awer.co/sitemap.xml",
  };
}

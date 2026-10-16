// src/lib/adminAuth.ts
// Verificação de admin NO SERVIDOR.
//
// O site usa o SDK do Auth0 no navegador (sem sessão no servidor). Para uma server action saber
// quem está chamando, o navegador manda o access token do Auth0 e aqui conferimos esse token com
// o próprio Auth0 (/userinfo). Só passa quem tem e-mail @awer.co VERIFICADO.
// Nunca confie em e-mail ou id de usuário enviados pelo navegador.

// Use apenas a partir de server actions ("use server") ou componentes de servidor.

export const ADMIN_DOMAIN = "@awer.co";

export interface AdminUser {
  email: string;
  name: string;
}

// Cache curto por token: o /userinfo do Auth0 tem limite de chamadas por usuário.
const cache = new Map<string, { user: AdminUser | null; expires: number }>();
const CACHE_MS = 5 * 60 * 1000;

function userinfoUrl(): string {
  // AUTH0_USERINFO_URL só existe para testes locais; em produção vem do domínio do Auth0.
  if (process.env.AUTH0_USERINFO_URL) return process.env.AUTH0_USERINFO_URL;
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  if (!domain) throw new Error("NEXT_PUBLIC_AUTH0_DOMAIN não configurado");
  return `https://${domain}/userinfo`;
}

export async function verifyAdminToken(accessToken: unknown): Promise<AdminUser | null> {
  if (typeof accessToken !== "string" || accessToken.length < 20 || accessToken.length > 8000) return null;

  const now = Date.now();
  const hit = cache.get(accessToken);
  if (hit && hit.expires > now) return hit.user;

  let user: AdminUser | null = null;
  try {
    const res = await fetch(userinfoUrl(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (res.ok) {
      const info = (await res.json()) as { email?: string; email_verified?: boolean; name?: string };
      const email = typeof info.email === "string" ? info.email.toLowerCase() : "";
      if (email.endsWith(ADMIN_DOMAIN) && info.email_verified === true) {
        user = { email, name: info.name || email };
      }
    }
  } catch (err) {
    console.error("[adminAuth] falha ao consultar o Auth0", err);
    return null; // falha de rede não entra no cache
  }

  if (cache.size > 500) cache.clear();
  cache.set(accessToken, { user, expires: now + CACHE_MS });
  return user;
}

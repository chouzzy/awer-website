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
const cache = new Map<string, { user: AdminUser; expires: number }>();
const CACHE_MS = 5 * 60 * 1000;

function userinfoUrl(): string {
  // AUTH0_USERINFO_URL só existe para testes locais; em produção vem do domínio do Auth0.
  if (process.env.AUTH0_USERINFO_URL) return process.env.AUTH0_USERINFO_URL;
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  if (!domain) throw new Error("NEXT_PUBLIC_AUTH0_DOMAIN não configurado");
  return `https://${domain}/userinfo`;
}

export type AdminDenyReason = "sem_token" | "token_recusado" | "email_nao_verificado" | "fora_do_dominio" | "erro_auth0";

export async function verifyAdminTokenDetailed(
  accessToken: unknown,
): Promise<{ user: AdminUser | null; reason?: AdminDenyReason }> {
  if (typeof accessToken !== "string" || accessToken.length < 20 || accessToken.length > 8000) {
    return { user: null, reason: "sem_token" };
  }

  const now = Date.now();
  const hit = cache.get(accessToken);
  if (hit && hit.expires > now && hit.user) return { user: hit.user };

  try {
    const res = await fetch(userinfoUrl(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[adminAuth] negado: /userinfo respondeu ${res.status}`);
      return { user: null, reason: "token_recusado" };
    }
    const info = (await res.json()) as { email?: string; email_verified?: boolean; name?: string };
    const email = typeof info.email === "string" ? info.email.toLowerCase() : "";
    if (!email.endsWith(ADMIN_DOMAIN)) {
      console.warn(`[adminAuth] negado: e-mail fora do domínio (${email ? email.split("@")[1] : "sem e-mail no /userinfo"})`);
      return { user: null, reason: "fora_do_dominio" };
    }
    if (info.email_verified !== true) {
      console.warn(`[adminAuth] negado: ${email} com email_verified=${String(info.email_verified)}`);
      return { user: null, reason: "email_nao_verificado" };
    }
    const user = { email, name: info.name || email };
    if (cache.size > 500) cache.clear();
    cache.set(accessToken, { user, expires: now + CACHE_MS }); // só aprovações vão para o cache
    return { user };
  } catch (err) {
    console.error("[adminAuth] falha ao consultar o Auth0", err);
    return { user: null, reason: "erro_auth0" };
  }
}

export async function verifyAdminToken(accessToken: unknown): Promise<AdminUser | null> {
  return (await verifyAdminTokenDetailed(accessToken)).user;
}

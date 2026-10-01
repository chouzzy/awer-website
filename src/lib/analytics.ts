declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

export type TrackEventName =
  | 'cta_click'
  | 'plan_select'
  | 'checkout_start'
  | 'whatsapp_click'
  | 'service_click'
  | 'ticket_create'
  | 'ticket_message_send'
  | 'contact_form_submit'
  | 'login_click'
  | 'nav_click'
  | 'game_click';

interface TrackParams {
  event: TrackEventName;
  [key: string]: unknown;
}

export function trackEvent({ event, ...params }: TrackParams): void {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push({ event, ...params });
}

// ---------------------------------------------------------------------------
// Consentimento de cookies (Google Consent Mode v2)
// O padrão "negado" é definido em GoogleTagManager.tsx antes do GTM carregar.
// Esta função é chamada quando o visitante clica em Aceitar ou Rejeitar.
// ---------------------------------------------------------------------------
export type CookieConsent = 'accepted' | 'rejected';

export const CONSENT_STORAGE_KEY = 'cookie_consent';

export function updateConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) window.dataLayer = [];
  const value = consent === 'accepted' ? 'granted' : 'denied';
  // O Consent Mode exige o objeto `arguments`, não um array comum.
  // eslint-disable-next-line prefer-rest-params
  const gtag = function (..._args: unknown[]) { window.dataLayer.push(arguments); };
  gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
  window.dataLayer.push({ event: 'cookie_consent_update', consent });
}

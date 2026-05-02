declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
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
  | 'nav_click';

interface TrackParams {
  event: TrackEventName;
  [key: string]: unknown;
}

export function trackEvent({ event, ...params }: TrackParams): void {
  if (typeof window === 'undefined') return;
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push({ event, ...params });
}

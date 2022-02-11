import type { IDOMRenderer } from '../domBuilder';
import { DOMRendererClient } from '../domBuilder/client';

declare const window: { __applize?: { render?: IDOMRenderer<[]> } };

export function ClientInitialize() {
  window.__applize = {
    render: new DOMRendererClient(document.body),
  };

  const pageScript = document.createElement('script');
  pageScript.type = 'text/javascript';
  pageScript.src = `/applize?page=${location.pathname}`;

  document.head.appendChild(pageScript);
}

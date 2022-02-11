import type { IDOMRenderer } from '../domBuilder';
import { DOMRendererClient } from '../domBuilder/client';

declare const window: {
  __applize?: { render?: IDOMRenderer<Record<never, never>> };
};

export function ClientInitialize(applizeRoot: string) {
  window.__applize = {
    render: new DOMRendererClient<Record<never, never>>(
      document.body,
      applizeRoot
    ),
  };

  const pageScript = document.createElement('script');
  pageScript.type = 'text/javascript';
  pageScript.src = `/${applizeRoot}?page=${location.pathname}`;

  document.head.appendChild(pageScript);
}

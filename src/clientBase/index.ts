import type { IDOMRenderer } from '../domBuilder';
import { DOMRendererClient } from '../domBuilder/client';

declare const window: {
  __applize?: {
    render?: IDOMRenderer<Record<never, never>>;
    pageMove?: (pathname: string, targetElement?: HTMLElement) => void;
  };
};

export function ClientInitialize(applizeRoot: string) {
  const content = document.getElementById('applize_content');
  const progress = document.getElementById('applize_spa_progress');
  if (content) {
    window.__applize = {};

    window.__applize.pageMove = (
      pathname: string,
      targetElement: HTMLElement = content
    ) => {
      const targetFile = `${applizeRoot}?page=${pathname}`;
      if (progress) progress.style.width = '0%';
      if (progress) progress.style.opacity = '1';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', targetFile);
      xhr.send();
      xhr.addEventListener('progress', e => {
        if (e.lengthComputable) {
          if (progress) progress.style.width = `${(e.loaded / e.total) * 100}%`;
        }
      });
      xhr.addEventListener('load', () => {
        if (progress) progress.style.width = '100%';

        setTimeout(() => {
          if (progress) progress.style.opacity = '0';
        }, 300);
        setTimeout(() => {
          if (progress) progress.style.width = '0%';
        }, 800);

        const cloned = targetElement.cloneNode(false);
        const fragment = document.createDocumentFragment();
        if (window.__applize)
          window.__applize.render = new DOMRendererClient<Record<never, never>>(
            fragment,
            applizeRoot,
            () => {
              cloned.appendChild(fragment);
              targetElement.replaceWith(cloned);
            }
          );

        const pageScript = document.createElement('script');
        pageScript.type = 'text/javascript';
        pageScript.src = targetFile;
        document.head.appendChild(pageScript);
      });
    };

    window.__applize.pageMove(location.pathname, content);
  } else {
    console.log('#applize_content not found');
  }
}

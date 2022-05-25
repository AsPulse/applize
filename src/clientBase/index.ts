import type { IDOMRenderer } from '../domBuilder';
import { DOMRendererClient } from '../domBuilder/client';

declare const window: {
  __applize?: {
    render?: IDOMRenderer<Record<never, never>>;
    pageMove?: (
      pathname: string,
      targetElement?: HTMLElement | 'root',
      stateStyle?: 'none' | 'replace' | 'push'
    ) => void;
  };
} & Window;

interface IPageLoading {
  script: HTMLScriptElement;
  targetElement: Node;
  onLeave: () => void;
}
let pageLoadings: IPageLoading[] = [];
let pageUnique = -1;

let loadingStatus: XMLHttpRequest | 'rendering' | null = null;

export function ClientInitialize(applizeRoot: string) {
  const content = () => document.getElementById('applize_content');
  const progressOriginal = document.getElementById('applize_spa_progress');
  if (content()) {
    window.__applize = {};

    window.__applize.pageMove = (
      pathname: string,
      targetElement: HTMLElement | 'root' = 'root',
      stateStyle: 'none' | 'replace' | 'push' = 'push'
    ) => {
      if (loadingStatus === 'rendering') return;
      if (loadingStatus !== null) {
        loadingStatus.abort();
        loadingStatus = null;
      }

      const targetFile = `${applizeRoot}?page=${pathname}`;
      const progress = progressOriginal?.cloneNode();
      const progressUseable =
        progress !== undefined && progress instanceof HTMLElement;
      if (progressUseable) {
        progressOriginal?.after(progress);
        progress.style.width = '0%';
        progress.style.opacity = '1';
      }
      const xhr = new XMLHttpRequest();
      loadingStatus = xhr;
      xhr.open('GET', targetFile);
      xhr.send();
      xhr.addEventListener('progress', e => {
        if (e.lengthComputable) {
          if (progressUseable)
            progress.style.width = `${(e.loaded / e.total) * 100}%`;
        }
      });
      xhr.addEventListener('load', () => {
        loadingStatus = 'rendering';
        if (progressUseable) {
          progress.style.width = '100%';

          setTimeout(() => (progress.style.opacity = '0'), 300);
          setTimeout(() => progress.remove(), 800);
        }
        const renderedTarget =
          targetElement === 'root' ? content() : targetElement;
        if (!renderedTarget) return;

        const cloned = renderedTarget.cloneNode(false);
        if (cloned instanceof HTMLElement) {
          [...cloned.classList]
            .filter(v => /^style-page-([0-9]+)$/.test(v))
            .map(v => cloned.classList.remove(v));
        }
        const fragment = document.createDocumentFragment();

        const pageScript = document.createElement('script');
        pageScript.type = 'text/javascript';
        const pageUniqueTurn = ++pageUnique;
        if (window.__applize)
          window.__applize.render = new DOMRendererClient<Record<never, never>>(
            pathname,
            fragment,
            applizeRoot,
            `${pageUniqueTurn}`,
            finish => {
              if (cloned instanceof HTMLElement) {
                cloned.classList.add(`style-page-${pageUniqueTurn}`);
              }
              cloned.appendChild(fragment);
              renderedTarget.replaceWith(cloned);
              if (stateStyle === 'replace') {
                history.replaceState({}, finish.title, pathname);
              }
              if (stateStyle === 'push') {
                history.pushState({}, finish.title, pathname);
              }
              document.title = finish.title;
              pageLoadings = pageLoadings.filter(v => {
                if (renderedTarget.contains(v.targetElement)) {
                  v.onLeave();
                  v.script.remove();
                  return false;
                }
                return true;
              });
              pageLoadings.push({
                script: pageScript,
                targetElement: cloned,
                onLeave: finish.onLeave,
              });
              loadingStatus = null;
            }
          );
        pageScript.src = targetFile;
        document.head.appendChild(pageScript);
      });
    };

    window.__applize.pageMove(location.pathname, 'root', 'replace');
    window.addEventListener('popstate', () => {
      if (window.__applize?.pageMove)
        window.__applize.pageMove(location.pathname, 'root', 'none');
    });
  } else {
    console.log('#applize_content not found');
  }
}

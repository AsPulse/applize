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
  title: string,
  targetElement: Node,
  onLeave: () => void;
}let pageLoadings: IPageLoading[] = [];

export function ClientInitialize(applizeRoot: string) {
  const content = () => document.getElementById('applize_content');
  const progress = document.getElementById('applize_spa_progress');
  if (content()) {
    window.__applize = {};

    window.__applize.pageMove = (
      pathname: string,
      targetElement: HTMLElement | 'root' = 'root',
      stateStyle: 'none' | 'replace' | 'push' = 'push'
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

        const renderedTarget =
          targetElement === 'root' ? content() : targetElement;
        if (!renderedTarget) return;

        pageLoadings = pageLoadings.filter(v => {
          if ( renderedTarget.contains(v.targetElement) ) {
            v.onLeave();
            console.log('Page leaved: ' + v.title);
            return false;
          }
          return true;
        });


        const cloned = renderedTarget.cloneNode(false);
        const fragment = document.createDocumentFragment();
        if (window.__applize)
          window.__applize.render = new DOMRendererClient<Record<never, never>>(
            fragment,
            applizeRoot,
            finish => {
              cloned.appendChild(fragment);
              renderedTarget.replaceWith(cloned);
              if (stateStyle === 'replace') {
                history.replaceState({}, finish.title, pathname);
              }
              if (stateStyle === 'push') {
                history.pushState({}, finish.title, pathname);
              }
              document.title = finish.title;
              pageLoadings.push({
                title: finish.title,
                targetElement: cloned,
                onLeave: () => undefined
              });
            }
          );

        const pageScript = document.createElement('script');
        pageScript.type = 'text/javascript';
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

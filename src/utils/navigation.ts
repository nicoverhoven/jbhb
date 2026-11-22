import { useEffect, useState } from 'react';
import { getRouteSEO } from '../shared/seoMeta';

const NAV_EVENT = 'freecvrater:navigate';

export function navigateTo(path: string): void {
  if (typeof window === 'undefined') return;
  const [pathnamePart, hashPart] = path.split('#');
  const targetPath = pathnamePart || '/';
  const currentPath = window.location.pathname || '/';

  if (currentPath !== targetPath) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event(NAV_EVENT));
  }

  if (hashPart) {
    window.setTimeout(() => {
      const el = document.getElementById(hashPart);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const sync = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  return pathname;
}

export function syncDocumentSEO(pathname: string): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const seo = getRouteSEO(pathname, window.location.origin);
  document.title = seo.title;

  const setMeta = (selector: string, attrName: string, content: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute(attrName, content);
    }
  };

  setMeta('meta[name="description"]', 'content', seo.description);
  setMeta('meta[name="robots"]', 'content', seo.robots);
  setMeta('meta[property="og:title"]', 'content', seo.title);
  setMeta('meta[property="og:description"]', 'content', seo.description);
  setMeta('meta[property="og:url"]', 'content', seo.canonicalUrl);
  setMeta('meta[name="twitter:title"]', 'content', seo.title);
  setMeta('meta[name="twitter:description"]', 'content', seo.description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', seo.canonicalUrl);
  }
}

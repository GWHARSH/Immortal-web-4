import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — applies 'reveal--visible' class when elements
 * with '.reveal' scroll into the viewport. GPU-accelerated, zero lag.
 */
export function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current || document;
    const elements = root.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}

/**
 * Global scroll reveal — attach to document body, watches all .reveal elements.
 * Call this once in App or a layout component.
 */
export function useGlobalScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
    );

    // Observe existing elements
    const observe = () => {
      document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => {
        observer.observe(el);
      });
    };

    observe();

    // Re-observe on route changes (MutationObserver)
    const mutObs = new MutationObserver(() => {
      requestAnimationFrame(observe);
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObs.disconnect();
    };
  }, []);
}

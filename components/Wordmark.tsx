'use client';

/* Footer wordmark that scales to exactly fill its container width — measured, so it never clips. */

import { useEffect, useRef } from 'react';

export function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      el.style.fontSize = '100px';               // measure at a known size…
      const ratio = parent.clientWidth / el.scrollWidth;
      el.style.fontSize = `${Math.floor(100 * ratio * 0.995)}px`; // …then scale to fill
    };
    fit();
    document.fonts?.ready.then(fit);             // re-fit once the display font lands
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement!);
    return () => ro.disconnect();
  }, []);

  return <div className="footer-wordmark" ref={ref} aria-hidden="true">The Giggling <em>Cult</em></div>;
}

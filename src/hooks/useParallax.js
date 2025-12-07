// Lightweight parallax hook using requestAnimationFrame and element bounding rect.
// - depth: small numeric factor; positive/negative to invert direction
// - axis: 'both'|'x'|'y'
// Respects prefers-reduced-motion and uses will-change: transform.

import { useEffect } from 'react';

export default function useParallax(ref, opts = {}) {
  const { depth = 0.03, axis = 'both' } = typeof opts === 'number' ? { depth: opts, axis: 'both' } : opts;

  useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = null;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (centerX - winW / 2) * depth; // small translation
      const offsetY = (centerY - winH / 2) * depth;

      const tx = (axis === 'both' || axis === 'x') ? offsetX : 0;
      const ty = (axis === 'both' || axis === 'y') ? offsetY : 0;

      el.style.willChange = 'transform';
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    }

    function loop() {
      update();
      rafId = requestAnimationFrame(loop);
    }

    loop();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (el) el.style.transform = '';
    };
  }, [ref, depth, axis]);
}

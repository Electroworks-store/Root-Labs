import { useEffect, useRef } from 'react';
import gsap from '../gsap-config';
import { useGSAP } from '@gsap/react';

/**
 * Example: Stagger objects into view
 * Usage: const scope = useRef(null);
 *        useStaggerIn(scope);
 *        <div ref={scope}><p className="stagger-item">Item 1</p>...</div>
 */
export function useStaggerIn(scope, delay = 0) {
  useGSAP(() => {
    gsap.from('.stagger-item', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out',
      delay,
    });
  }, { scope });
}

/**
 * Example: Scroll-triggered reveal
 * Usage: const ref = useRef(null);
 *        useScrollReveal(ref);
 *        <div ref={ref} className="scroll-reveal">Content</div>
 */
export function useScrollReveal(ref) {
  useGSAP(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.3,
        markers: false,
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
    });
  });
}

/**
 * Example: Text animation letter by letter
 * Usage: useTextAnimation(ref, { duration: 0.05 })
 */
export function useTextAnimation(ref, options = {}) {
  const { duration = 0.05, stagger = 0.05, ease = 'power1.out' } = options;
  useGSAP(() => {
    if (!ref.current) return;
    // Split text into individual characters (requires SplitText)
    const split = new gsap.SplitText(ref.current, { type: 'chars' });
    gsap.from(split.chars, {
      opacity: 0,
      y: 10,
      rotationZ: -10,
      duration,
      stagger,
      ease,
    });
  });
}

/**
 * Example: Hover animation on element
 * Usage: const hoverRef = useRef(null);
 *        useHoverScale(hoverRef, { scale: 1.1, duration: 0.3 })
 */
export function useHoverScale(ref, options = {}) {
  const { scale = 1.1, duration = 0.3 } = options;
  useGSAP(() => {
    if (!ref.current) return;
    ref.current.addEventListener('mouseenter', () => {
      gsap.to(ref.current, { scale, duration });
    });
    ref.current.addEventListener('mouseleave', () => {
      gsap.to(ref.current, { scale: 1, duration });
    });
  }, { scope: ref });
}

/**
 * Example: Floating animation (continuous)
 * Usage: useFloating(ref, { distance: 20, duration: 3 })
 */
export function useFloating(ref, options = {}) {
  const { distance = 20, duration = 3 } = options;
  useGSAP(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: distance,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

export default {
  useStaggerIn,
  useScrollReveal,
  useTextAnimation,
  useHoverScale,
  useFloating,
};

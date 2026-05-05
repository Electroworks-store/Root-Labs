import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '../gsap-config';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    // Expose instance so smoothScrollTo() in App.jsx can call lenis.scrollTo()
    window.lenis = lenis;

    // Keep ScrollTrigger in sync with Lenis-driven scroll
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // Drive Lenis from GSAP's ticker so animations and scroll share one clock
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return null;
}

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap-config';
import Hero2Section from './Hero2Section';

/* ─── Scoped styles ─────────────────────────────────────────────────────── */
const STYLES = `
.hero-wipe {
  position: relative;
}
.hero-wipe-stage {
  position: relative;
  overflow: hidden;
}
/* Single oversized petal that sweeps the screen */
.hero-wipe-petal {
  position: absolute;
  pointer-events: none;
  top: 50%;
  left: 50%;
  width: 55vmin;
  height: 55vmin;
  transform-origin: center;
  will-change: transform, opacity;
  z-index: 25;       /* above petal rain (z-20) and hero text, below FloatingNav */
  opacity: 0;
  filter: drop-shadow(0 18px 40px rgba(123, 79, 191, 0.22));
}
@media (prefers-reduced-motion: reduce) {
  .hero-wipe-petal { display: none; }
}
`;

export default function HeroWipe() {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const petalRef = useRef(null);

  useEffect(() => {
    // Inject scoped styles once
    let styleEl = document.querySelector('style[data-hero-wipe-styles]');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-hero-wipe-styles', '');
      styleEl.textContent = STYLES;
      document.head.appendChild(styleEl);
    }

    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const petal = petalRef.current;
    if (!wrap || !stage || !petal) return;

    // Skip the whole effect for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Wait for layout (Hero2Section delays its own setup, but the wipe is
    // independent). One rAF is enough to ensure refs measure correctly.
    let st = null;
    let tl = null;
    const ctx = gsap.context(() => {
      // Resolve hero's animated layers (defensive — if missing, just skip)
      const heroEl     = stage.querySelector('.h2-hero');
      const contentEl  = stage.querySelector('.h2-content');
      const footerEl   = stage.querySelector('.h2-footer');
      const treeEl     = stage.querySelector('.h2-tree');
      const petalsEl   = stage.querySelector('.h2-petals');

      // Initial petal pose: tucked into the sakura branch (top-right of the
      // hero, where .h2-tree sits). Tiny + tilted as if hanging from a twig.
      gsap.set(petal, {
        xPercent: -50,
        yPercent: -50,
        x: '32vw',
        y: '-28vh',
        scale: 0.08,
        rotation: -35,
        opacity: 0,
      });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=80%',            // shorter runway — snap covers the rest
          pin: stage,              // pin the hero stage during the scrub
          pinSpacing: true,        // reserve scroll length so next section appears after wipe
          scrub: 0.8,
          anticipatePin: 1,
          // Snap fires early (> 30%) so the remaining animation plays during
          // the snap tween itself — user lands on the next section immediately.
          snap: {
            snapTo: (value) => (value > 0.3 ? 1 : 0),
            duration: { min: 0.3, max: 0.6 },
            delay: 0.05,
            ease: 'power2.inOut',
          },
        },
      });
      st = tl.scrollTrigger;

      /* ── PHASE 1 — ENTRY (0 → 0.35) ───────────────────────────────────────
         Petal swoops in from bottom-right, scales 0.12 → 1, rotates ~40°.
         Hero content & footer fade to 0.4 to cede focus.                  */
      tl.to(petal, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 20,
        opacity: 1,
        ease: 'none',
        duration: 0.35,
      }, 0);
      if (contentEl) {
        tl.to(contentEl, { opacity: 0.4, ease: 'none', duration: 0.35 }, 0);
      }
      if (footerEl) {
        tl.to(footerEl, { opacity: 0.4, ease: 'none', duration: 0.35 }, 0);
      }

      /* ── PHASE 2 — COVER (0.35 → 0.65) ────────────────────────────────────
         Petal scales up to fully cover the viewport, continues rotating.
         Hero layers fade to 0 so only the petal & cream bg remain.        */
      tl.to(petal, {
        scale: 4.8,
        rotation: 55,
        ease: 'none',
        duration: 0.30,
      }, 0.35);
      const fadeTargets = [contentEl, footerEl, treeEl, petalsEl].filter(Boolean);
      if (fadeTargets.length) {
        tl.to(fadeTargets, {
          opacity: 0,
          ease: 'none',
          duration: 0.30,
        }, 0.35);
      }

      /* ── PHASE 3 — EXIT (0.65 → 1.0) ──────────────────────────────────────
         Petal translates out to top-left while the hero stage itself fades
         away — revealing the next section (WhyUsPricing) underneath. By the
         end of the scrub the user is already looking at the timeline.    */
      tl.to(petal, {
        x: '-95vw',
        y: '-95vh',
        rotation: 95,
        opacity: 0,
        ease: 'none',
        duration: 0.30,
      }, 0.65);

      // Force the sakura branch + petal rain to stay hidden through exit
      // (their CSS keyframe animations won't re-apply mid-scrub, but we
      // explicitly hold them at 0 so nothing peeks back in).
      if (treeEl) {
        tl.to(treeEl, { opacity: 0, ease: 'none', duration: 0.001 }, 0.64);
      }
      if (petalsEl) {
        tl.to(petalsEl, { opacity: 0, ease: 'none', duration: 0.001 }, 0.64);
      }

      // Hero (.h2-hero) fades out EARLY — starting mid-cover — so the timeline
      // section shows through behind the petal as it begins its exit. The
      // petal is a sibling of .h2-hero (not a child) so it stays fully
      // visible above the revealed timeline.
      if (heroEl) {
        tl.to(heroEl, {
          opacity: 0,
          ease: 'none',
          duration: 0.30,
        }, 0.50);
      }

      // Refresh once layout settles (hero waits ~1.7s for fonts/entrance)
      const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1800);
      // Stash so cleanup can clear it
      tl._refreshTimer = refreshTimer;
    }, wrap);

    return () => {
      if (tl?._refreshTimer) clearTimeout(tl._refreshTimer);
      if (st) st.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div className="hero-wipe" ref={wrapRef}>
      <div className="hero-wipe-stage" ref={stageRef}>
        <Hero2Section />

        {/* Oversized transition petal — same purple family as the falling rain */}
        <svg
          className="hero-wipe-petal"
          ref={petalRef}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hwpGrad" cx="50%" cy="35%" r="70%">
              <stop offset="0%"  stopColor="#B088E8" />
              <stop offset="55%" stopColor="#9B6FD4" />
              <stop offset="100%" stopColor="#7B4FBF" />
            </radialGradient>
          </defs>
          <path
            d="M10 0 C14 4, 18 10, 10 20 C2 10, 6 4, 10 0 Z"
            fill="url(#hwpGrad)"
            stroke="#7B4FBF"
            strokeOpacity="0.35"
            strokeWidth="0.25"
          />
        </svg>
      </div>
    </div>
  );
}

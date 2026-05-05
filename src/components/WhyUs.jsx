import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap-config';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(SplitText, Flip);

/* ─── Data ──────────────────────────────────────────────────────────────── */

const FONT = "'Inter', system-ui, sans-serif";
const CARD_HEIGHT = '12.25rem';

const ITEMS = [
  {
    title: 'We move fast',
    body: 'AI-accelerated redesigns in days, not months. No waiting in agency queues.',
    stat: '7 days',
    statLabel: 'DELIVERY',
  },
  {
    title: 'Agency-grade output',
    body: 'Design and code built to convert visitors not just look good in mockups.',
    stat: '100 %',
    statLabel: 'SATISFACTION',
  },
  {
    title: 'Unique by design',
    body: 'No templates. No recycled layouts. Every site is built from a blank canvas, so your brand looks like yours, not everyone else\'s.',
    stat: '0',
    statLabel: 'TEMPLATES USED',
  },
];

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function WhyUs() {
  const wordRefs = [useRef(null), useRef(null), useRef(null)];
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    let hoverCleanups = [];
    const ctx = gsap.context(() => {
      // ── Final resting state: cards stack in left col, words to right col ──
      const playFinal = () => {
        const grid = gridRef.current;
        const c = cardRefs.map((r) => r.current);
        const w = wordRefs.map((r) => r.current);
        if (!grid || c.some((x) => !x) || w.some((x) => !x)) return;

        // Lock each card's current rendered width in pixels so the upcoming
        // grid-cell change can't reflow them to a different size during Flip.
        const cardWidths = c.map((card) => card.getBoundingClientRect().width);
        c.forEach((card, i) => {
          card.style.width = `${cardWidths[i]}px`;
        });

        const elements = [c[0], w[0], c[1], w[1], c[2], w[2]];
        const state = Flip.getState(elements);

        grid.style.rowGap = '2rem';
        c[0].style.gridColumn = '1'; c[0].style.gridRow = '1';
        w[0].style.gridColumn = '3'; w[0].style.gridRow = '1'; w[0].style.alignSelf = 'center';
        c[1].style.gridColumn = '1'; c[1].style.gridRow = '2';
        w[1].style.gridColumn = '3'; w[1].style.gridRow = '2'; w[1].style.alignSelf = 'center';
        c[2].style.gridColumn = '1'; c[2].style.gridRow = '3';
        w[2].style.gridColumn = '3'; w[2].style.gridRow = '3'; w[2].style.alignSelf = 'center';

        Flip.from(state, {
          duration: 0.6,
          ease: 'power2.inOut',
          stagger: (idx) => Math.floor(idx / 2) * 0.1,
          onComplete: () => {
            c.forEach((card) => { card.style.width = ''; });
          },
        });
      };

      // ── Heading words: chars split upward, triggered per word ──
      wordRefs.forEach((ref) => {
        if (!ref.current) return;
        const split = new SplitText(ref.current, { type: 'chars', charsClass: 'why-char' });
        gsap.set(ref.current, { overflow: 'hidden' });
        gsap.from(split.chars, {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // ── Cards: clip-path + translateY reveal ──
      cardRefs.forEach((ref, i) => {
        if (!ref.current) return;
        gsap.from(ref.current, {
          y: 40,
          opacity: 0,
          scale: 0.97,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          onComplete: i === 2 ? playFinal : undefined,
        });
      });

      // ── Cards: hover lift + stat pop ──
      hoverCleanups = cardRefs.map((ref) => {
        const card = ref.current;
        if (!card) return () => {};

        const stat = card.querySelector('[data-card-stat]');
        const title = card.querySelector('[data-card-title]');

        // Keep box-shadow geometry identical on enter/leave — only the alpha
        // changes — so GSAP can interpolate smoothly without a snap.
        const SHADOW_ON = '0 20px 40px -12px rgba(17, 17, 17, 0.18)';
        const SHADOW_OFF = '0 20px 40px -12px rgba(17, 17, 17, 0)';
        gsap.set(card, { boxShadow: SHADOW_OFF });

        const enter = () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            boxShadow: SHADOW_ON,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(stat, {
            scale: 1.08,
            color: '#6A61D6',
            duration: 0.4,
            ease: 'power3.out',
            transformOrigin: 'left center',
            overwrite: 'auto',
          });
          gsap.to(title, {
            x: 4,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: SHADOW_OFF,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(stat, {
            scale: 1,
            color: '#7F77DD',
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(title, {
            x: 0,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        card.addEventListener('mouseenter', enter);
        card.addEventListener('mouseleave', leave);
        return () => {
          card.removeEventListener('mouseenter', enter);
          card.removeEventListener('mouseleave', leave);
        };
      });

    });

    return () => {
      hoverCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ background: 'var(--bg, #F7F6F4)', fontFamily: FONT }}>
      {/* Desktop: diagonal grid layout */}
      <div ref={gridRef} style={s.grid}>
        {/* Row 1, Col 1 — "Three" */}
        <div ref={wordRefs[0]} style={{ ...s.word, gridColumn: '1', gridRow: '1' }}>Three</div>

        {/* Row 2, Col 1 — Card 1 */}
        <div ref={cardRefs[0]} style={{ ...s.card, gridColumn: '1', gridRow: '2' }}>
          <CardContent item={ITEMS[0]} />
        </div>

        {/* Row 2, Col 2 — "Reasons" */}
        <div ref={wordRefs[1]} style={{ ...s.word, gridColumn: '2', gridRow: '2', alignSelf: 'end' }}>Reasons</div>

        {/* Row 3, Col 2 — Card 2 */}
        <div ref={cardRefs[1]} style={{ ...s.card, gridColumn: '2', gridRow: '3' }}>
          <CardContent item={ITEMS[1]} />
        </div>

        {/* Row 3, Col 3 — "Why" */}
        <div ref={wordRefs[2]} style={{ ...s.word, gridColumn: '3', gridRow: '3', alignSelf: 'end' }}>Why</div>

        {/* Row 4, Col 3 — Card 3 */}
        <div ref={cardRefs[2]} style={{ ...s.card, gridColumn: '3', gridRow: '4' }}>
          <CardContent item={ITEMS[2]} />
        </div>
      </div>
    </section>
  );
}

/* ─── Card content ───────────────────────────────────────────────────────── */

function CardContent({ item }) {
  return (
    <div style={s.cardInner}>
      <h3 data-card-title style={s.cardTitle}>{item.title}</h3>
      <p style={s.cardBody}>{item.body}</p>
      <div style={s.statRow}>
        <span data-card-stat style={s.stat}>{item.stat}</span>
        <span style={s.statLabel}>{item.statLabel}</span>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const s = {
  /* Outer grid — 3 equal columns, diagonal placement */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    columnGap: 'clamp(1.25rem, 2.5vw, 2rem)',
    rowGap: 'clamp(0.5rem, 1vw, 0.85rem)',
    padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 4rem)',
    maxWidth: '1280px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },

  /* Large diagonal heading words */
  word: {
    fontFamily: FONT,
    fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
    fontWeight: 400,
    color: 'var(--text, #111)',
    lineHeight: 1,
    letterSpacing: '-0.03em',
    alignSelf: 'start',
    margin: 0,
  },

  /* Card shell */
  card: {
    background: '#FFFFFF',
    borderRadius: '20px',
    alignSelf: 'start',
    justifySelf: 'stretch',
    width: '100%',
    height: CARD_HEIGHT,
    boxSizing: 'border-box',
    cursor: 'pointer',
    willChange: 'transform',
  },

  /* Card inner padding */
  cardInner: {
    height: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },

  /* Card title */
  cardTitle: {
    fontFamily: FONT,
    fontSize: '1.125rem',
    fontWeight: 400,
    color: 'var(--text, #111)',
    margin: '0 0 0.5rem',
    lineHeight: 1.2,
  },

  /* Card body */
  cardBody: {
    fontFamily: FONT,
    fontSize: '0.875rem',
    color: 'var(--muted, #6B6563)',
    margin: '0 0 1.5rem',
    lineHeight: 1.65,
  },

  /* Stat row */
  statRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.45rem',
  },

  /* Big purple number */
  stat: {
    fontFamily: FONT,
    fontSize: '2rem',
    fontWeight: 700,
    color: '#7F77DD',
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },

  /* Small uppercase label beside stat */
  statLabel: {
    fontFamily: FONT,
    fontSize: '0.6rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--muted, #6B6563)',
  },
};

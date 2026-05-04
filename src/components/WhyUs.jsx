import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../gsap-config';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

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
    title: 'Real designers',
    body: 'Work directly with the people doing the work — no account managers in the way.',
    stat: '80 %',
    statLabel: 'TIME SAVED',
  },
];

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function WhyUs() {
  const wordRefs = [useRef(null), useRef(null), useRef(null)];
  const cardRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const ctx = gsap.context(() => {
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
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section style={{ background: 'var(--bg, #F7F6F4)', fontFamily: FONT }}>
      {/* Desktop: diagonal grid layout */}
      <div style={s.grid}>
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
      <h3 style={s.cardTitle}>{item.title}</h3>
      <p style={s.cardBody}>{item.body}</p>
      <div style={s.statRow}>
        <span style={s.stat}>{item.stat}</span>
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
    rowGap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
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

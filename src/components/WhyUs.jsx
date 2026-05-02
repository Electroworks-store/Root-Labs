import { useEffect, useRef, useState } from 'react';

/* ─── Data ──────────────────────────────────────────────────────────────── */

const ITEMS = [
  {
    index: '01',
    tag: 'Speed',
    tagColor: '#7F77DD',
    title: 'We move fast',
    body: 'AI-accelerated redesigns in days, not months. No waiting in agency queues.',
    stat: '7 days',
    statLabel: 'DELIVERY',
  },
  {
    index: '02',
    tag: 'Quality',
    tagColor: '#1D9E75',
    title: 'Agency-grade output',
    body: 'Design and code built to convert visitors — not just look good in mockups.',
    stat: '100%',
    statLabel: 'SATISFACTION',
  },
  {
    index: '03',
    tag: 'Direct access',
    tagColor: '#D85A30',
    title: 'Real designers',
    body: 'Work directly with the people doing the work — no account managers in the way.',
    stat: '80%',
    statLabel: 'TIME SAVED',
  },
];

const N = ITEMS.length; // 3
const FONT = "'Inter', system-ui, sans-serif";

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function WhyUs() {
  const stickyZoneRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  /* Detect: >= 768px AND no prefers-reduced-motion */
  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
    );
    const handler = (e) => setIsSticky(e.matches);
    setIsSticky(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* Scroll driver — progress 0 → 1 across N×100vh of sticky time */
  useEffect(() => {
    if (!isSticky) return;
    const zone = stickyZoneRef.current;
    if (!zone) return;

    const onScroll = () => {
      const rect = zone.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      // sticky time = zone height (400vh) - 1 viewport (100vh) = 300vh
      const maxScroll = zone.offsetHeight - window.innerHeight;
      setProgress(Math.min(1, scrolled / maxScroll));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isSticky]);

  return (
    <section style={{ background: 'var(--bg, #F7F6F4)', fontFamily: FONT }}>
      {/* Sticky zone (desktop) or simple stack (mobile/reduced-motion) */}
      {isSticky ? (
        /*
         * Outer div is 400vh: the sticky inner has 100vh height, so sticky
         * duration = 400vh − 100vh = 300vh = N × 100vh (one card each).
         * Header lives inside the sticky frame so cards appear directly below it.
         */
        <div ref={stickyZoneRef} style={{ height: '400vh', position: 'relative' }}>
          <div style={s.stickyViewport}>
            {/* Header pinned at top of sticky frame */}
            <div style={s.stickyHeader}>
              <span style={s.eyebrow}>WHY US</span>
              <h2 style={s.h2}>Three reasons that set us apart</h2>
            </div>

            {/* Card stage — fills the remaining height below the header */}
            <div style={s.cardStage}>
              {ITEMS.map((item, i) => {
                const cardProg = Math.max(0, Math.min(1, (progress - i / N) * N));
                const tx = (1 - cardProg) * 110;
                const opacity = Math.min(1, cardProg / 0.15);
                const buried = Math.max(0, progress * N - (i + 1));
                const scale = Math.max(0.92, 1 - buried * 0.025);

                return (
                  <div
                    key={item.index}
                    style={{
                      ...s.card,
                      transform: 'translateX(' + tx + '%) scale(' + scale + ')',
                      opacity,
                      zIndex: 10 + i,
                    }}
                  >
                    <CardInner item={item} index={i} />
                  </div>
                );
              })}
            </div>

            {/* Comparison strip — pinned at the bottom of the sticky frame, fades in when all cards landed */}
            <div
              style={{
                ...s.stripInline,
                opacity: Math.min(1, Math.max(0, (progress - 0.85) / 0.15)),
              }}
            >
              <span style={s.stripMuted}>Typical agency · 6 months</span>
              <span style={s.stripBadge}>26× faster</span>
              <span style={s.stripMuted}>
                With us ·{' '}
                <strong style={{ color: '#7F77DD', fontWeight: 700 }}>7 days</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile: header + cards flow normally */
        <>
          <div style={s.headerWrap}>
            <span style={s.eyebrow}>WHY US</span>
            <h2 style={s.h2}>Three reasons that set us apart</h2>
          </div>
          <SimpleStack />
        </>
      )}

      {/* Spacer below sticky zone + mobile comparison bar */}
      {!isSticky && <ComparisonBar />}
      <div style={{ height: 'clamp(6rem, 14vw, 12rem)' }} />
    </section>
  );
}

/* ─── Mobile / reduced-motion fallback ──────────────────────────────────── */

function SimpleStack() {
  return (
    <div style={s.simpleStack}>
      {ITEMS.map((item, i) => (
        <div key={item.index} style={s.simpleCard}>
          <CardInner item={item} index={i} />
        </div>
      ))}
    </div>
  );
}

/* ─── Card inner content ─────────────────────────────────────────────────── */

function CardInner({ item, index }) {
  return (
    <div style={s.cardInner}>
      {/* Top row: index number + tag pill */}
      <div style={s.topRow}>
        <span style={s.indexNum}>{item.index}</span>
        <span
          style={{
            ...s.tag,
            color: '#7F77DD',
            borderColor: '#7F77DD55',
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* Title */}
      <h3 style={s.title}>{item.title}</h3>

      {/* Body */}
      <p style={s.body}>{item.body}</p>

      {/* Bottom row: big stat left, progress pips right */}
      <div style={s.bottomRow}>
        <div style={s.statRow}>
          <span style={{ ...s.stat, color: '#7F77DD' }}>{item.stat}</span>
          <span style={s.statLabel}>{item.statLabel}</span>
        </div>
        <div style={s.pips}>
          {ITEMS.map((_, j) => (
            <span
              key={j}
              style={{
                ...s.pip,
                background: j === index ? item.tagColor : 'rgba(0,0,0,0.15)',
                width: j === index ? '26px' : '10px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Comparison bar ─────────────────────────────────────────────────────── */

function ComparisonBar() {
  return (
    <div style={s.strip}>
      <span style={s.stripMuted}>Typical agency · 6 months</span>
      <span style={s.stripBadge}>26× faster</span>
      <span style={s.stripMuted}>
        With us ·{' '}
        <strong style={{ color: '#7F77DD', fontWeight: 700 }}>7 days</strong>
      </span>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const s = {
  /* Header */
  headerWrap: {
    padding: 'clamp(3rem, 6vw, 4.5rem) clamp(1.5rem, 6vw, 4rem) clamp(0.5rem, 1vw, 0.75rem)',
    maxWidth: '780px',
  },
  eyebrow: {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.22em',
    color: 'var(--muted, #888)',
    marginBottom: '0.75rem',
    fontFamily: FONT,
  },
  h2: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 600,
    color: 'var(--text, #111)',
    margin: 0,
    lineHeight: 1.08,
    letterSpacing: '-0.03em',
    fontFamily: FONT,
  },

  /* Sticky viewport — stays fixed at top:0 for all 300vh of sticky time */
  stickyViewport: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'clamp(3.5rem, 7vw, 5.5rem) clamp(1.5rem, 6vw, 4rem) clamp(3.5rem, 6vw, 5rem)',
    boxSizing: 'border-box',
    gap: 'clamp(2rem, 4vw, 3.5rem)',
  },

  /* Header inside sticky frame */
  stickyHeader: {
    width: '100%',
    maxWidth: '920px',
    flexShrink: 0,
  },

  /* Card stage — fills remaining height below header, establishes stacking context */
  cardStage: {
    position: 'relative',
    flex: 1,
    width: '100%',
    maxWidth: '920px',
    overflow: 'hidden',
  },

  /* Card shell — absolute within cardStage */
  card: {
    position: 'absolute',
    inset: 0,
    maxWidth: '100%',
    height: '100%',
    background: '#FFFFFF',
    borderRadius: '20px',
    willChange: 'transform, opacity',
    transformOrigin: 'top center',
  },

  cardInner: {
    height: '100%',
    padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },

  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: 'clamp(1.25rem, 2.5vw, 2rem)',
  },

  indexNum: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'rgba(0,0,0,0.25)',
    fontFamily: FONT,
  },

  tag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    padding: '0.22rem 0.6rem',
    border: '1px solid',
    borderRadius: '999px',
    fontFamily: FONT,
  },

  title: {
    fontSize: 'clamp(1.9rem, 4vw, 3rem)',
    fontWeight: 700,
    color: 'var(--text, #111)',
    margin: '0 0 clamp(0.75rem, 1.5vw, 1.25rem)',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    fontFamily: FONT,
  },

  body: {
    fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
    color: 'var(--muted, #666)',
    margin: 0,
    lineHeight: 1.75,
    maxWidth: '50ch',
    fontFamily: FONT,
    flex: 1,
  },

  bottomRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'clamp(1.25rem, 2.5vw, 2rem)',
  },

  statRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
  },

  stat: {
    fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    fontFamily: FONT,
  },

  statLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: 'rgba(0,0,0,0.35)',
    fontFamily: FONT,
  },

  pips: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },

  pip: {
    height: '3px',
    borderRadius: '2px',
    transition: 'width 0.3s ease, background 0.3s ease',
  },

  /* Simple stack (mobile) */
  simpleStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '0 clamp(1rem, 4vw, 2rem) 2rem',
  },

  simpleCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    minHeight: '300px',
  },

  /* Comparison strip — inside sticky frame, aligned with cards */
  stripInline: {
    width: '100%',
    maxWidth: '920px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    padding: '0 clamp(1.75rem, 3.5vw, 2.75rem) clamp(1rem, 2vw, 1.5rem)',
  },

  /* Comparison strip — mobile / fallback */
  strip: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    padding: 'clamp(1.5rem, 3vw, 2.25rem) clamp(1.5rem, 6vw, 4rem)',
    borderTop: '1px solid rgba(0,0,0,0.08)',
    background: 'var(--bg, #F7F6F4)',
  },

  stripMuted: {
    fontSize: '0.82rem',
    color: 'var(--muted, #888)',
    fontFamily: FONT,
  },

  stripBadge: {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#fff',
    background: '#7F77DD',
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    fontFamily: FONT,
  },
};
